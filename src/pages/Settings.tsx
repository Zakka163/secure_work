/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Clock, Plus, Shield, ChevronUp, LogOut, ChevronRight } from 'lucide-react';

type ShiftConfig = { id: string; name: string; start: string; end: string; };

const DEFAULT_SHIFTS: ShiftConfig[] = [
  { id: '1', name: 'Pagi', start: '06:00', end: '14:00' },
  { id: '2', name: 'Sore', start: '14:00', end: '22:00' },
  { id: '3', name: 'Malam', start: '22:00', end: '06:00' },
];

const toMins = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const checkOverlap = (newStart: string, newEnd: string, existingShifts: ShiftConfig[], ignoreId?: string): boolean => {
  const ns = toMins(newStart); const ne = toMins(newEnd);
  if (ns === ne) return true;
  const getIntervals = (s: number, e: number) => s < e ? [[s, e]] : [[s, 24 * 60], [0, e]];
  const newInts = getIntervals(ns, ne);
  for (const shift of existingShifts) {
    if (shift.id === ignoreId) continue;
    const oInts = getIntervals(toMins(shift.start), toMins(shift.end));
    for (const x of newInts) for (const y of oInts) if (x[0] < y[1] && x[1] > y[0]) return true;
  }
  return false;
};

// Shared accordion row style
const ICON_BOX = (bg: string, color: string) => ({
  width: '40px', height: '40px', borderRadius: '12px',
  background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center',
});

const Settings: React.FC = () => {
  const [expandedId, setExpandedId] = useState<'shift' | 'security' | null>('shift');
  const toggle = (id: 'shift' | 'security') => setExpandedId(prev => prev === id ? null : id);

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* ── Shift Card ── */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-card)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', border: '0.5px solid var(--border)' }}>
          <button
            onClick={() => toggle('shift')}
            style={{ width: '100%', padding: '18px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={ICON_BOX('var(--primary-light)', 'var(--primary)')}>
                <Clock size={20} />
              </div>
              <span style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>Shift Sistem</span>
            </div>
            {expandedId === 'shift'
              ? <ChevronUp size={20} color="var(--text-muted)" />
              : <ChevronRight size={20} color="var(--text-muted)" />}
          </button>

          <div style={{ maxHeight: expandedId === 'shift' ? '1000px' : '0', opacity: expandedId === 'shift' ? 1 : 0, overflow: 'hidden', transition: 'all 0.35s ease' }}>
            <div style={{ padding: '0 16px 20px 16px', borderTop: '0.5px solid var(--border)' }}>
              <ShiftSettingsContent />
            </div>
          </div>
        </div>

        {/* ── Security Card ── */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-card)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', border: '0.5px solid var(--border)' }}>
          <button
            onClick={() => toggle('security')}
            style={{ width: '100%', padding: '18px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={ICON_BOX('#FFF0F5', '#FF2D55')}>
                <Shield size={20} />
              </div>
              <span style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>Kata Sandi</span>
            </div>
            {expandedId === 'security'
              ? <ChevronUp size={20} color="var(--text-muted)" />
              : <ChevronRight size={20} color="var(--text-muted)" />}
          </button>

          <div style={{ maxHeight: expandedId === 'security' ? '1000px' : '0', opacity: expandedId === 'security' ? 1 : 0, overflow: 'hidden', transition: 'all 0.35s ease' }}>
            <div style={{ padding: '0 16px 20px 16px', borderTop: '0.5px solid var(--border)' }}>
              <SecuritySettingsContent />
            </div>
          </div>
        </div>

      </div>

      {/* Logout */}
      <div style={{ marginTop: '32px' }}>
        <button
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'var(--bg-card)', color: 'var(--danger)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '17px', fontSize: '17px', fontWeight: 600, cursor: 'pointer', boxShadow: 'var(--shadow-card)', fontFamily: 'inherit' }}
        >
          <LogOut size={20} /> Keluar
        </button>
      </div>
    </div>
  );
};

/* ─── Shift Settings ─── */
const ShiftSettingsContent: React.FC = () => {
  const [shifts, setShifts] = useState<ShiftConfig[]>(DEFAULT_SHIFTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftConfig | null>(null);
  const [name, setName] = useState('');
  const [start, setStart] = useState('08:00');
  const [end, setEnd] = useState('17:00');

  const openModal = (shift?: ShiftConfig) => {
    if (shift) { setEditingShift(shift); setName(shift.name); setStart(shift.start); setEnd(shift.end); }
    else { setEditingShift(null); setName(''); setStart('08:00'); setEnd('17:00'); }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (checkOverlap(start, end, shifts, editingShift?.id)) return;
    if (editingShift) {
      setShifts(prev => prev.map(s => s.id === editingShift.id ? { ...s, name, start, end } : s));
    } else {
      setShifts(prev => [...prev, { id: Date.now().toString(), name, start, end }]);
    }
    setIsModalOpen(false);
  };

  const SHIFT_COLORS: Record<string, { bg: string; text: string }> = {
    'Pagi': { bg: '#FFF9E6', text: '#B45309' },
    'Sore': { bg: '#EEF2FF', text: '#4338CA' },
    'Malam': { bg: '#F0FDF4', text: '#166534' },
  };

  return (
    <div style={{ paddingTop: '16px' }}>
      <button
        onClick={() => openModal()}
        style={{ width: '100%', padding: '13px', background: 'var(--bg-input)', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-inner)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px', fontWeight: 600, marginBottom: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
      >
        <Plus size={18} /> Tambah Shift
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {shifts.map(shift => {
          const color = SHIFT_COLORS[shift.name] || { bg: 'var(--bg-input)', text: 'var(--text-secondary)' };
          return (
            <div
              key={shift.id}
              onClick={() => openModal(shift)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-inner)', cursor: 'pointer', border: '0.5px solid var(--border)' }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: color.bg, color: color.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{shift.name}</p>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{shift.start} — {shift.end}</p>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>
          );
        })}
      </div>

      {isModalOpen && createPortal(
        <div className="modal-overlay" style={{ zIndex: 99999 }}>
          <div className="modal-content" style={{ background: 'var(--bg-main)' }}>
            <div style={{ width: '36px', height: '4px', background: 'var(--border)', borderRadius: '2px', margin: '0 auto 20px auto' }} />
            <h2 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '20px' }}>{editingShift ? 'Edit Shift' : 'Shift Baru'}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama Shift"
                style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-inner)', fontSize: '16px', outline: 'none', fontFamily: 'inherit', color: 'var(--text-primary)' }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Mulai</label>
                  <input type="time" value={start} onChange={e => setStart(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-inner)', fontSize: '16px', outline: 'none', fontFamily: 'inherit' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Selesai</label>
                  <input type="time" value={end} onChange={e => setEnd(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-inner)', fontSize: '16px', outline: 'none', fontFamily: 'inherit' }} />
                </div>
              </div>
            </div>

            <button onClick={handleSave} className="btn-primary" style={{ marginBottom: '10px' }}>Simpan</button>
            <button onClick={() => setIsModalOpen(false)} className="btn-secondary">Batal</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

/* ─── Security Settings ─── */
const SecuritySettingsContent: React.FC = () => (
  <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <input type="password" placeholder="Sandi Lama"
      style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-input)', border: '1.5px solid transparent', borderRadius: 'var(--radius-inner)', fontSize: '16px', outline: 'none', fontFamily: 'inherit', color: 'var(--text-primary)' }} />
    <input type="password" placeholder="Sandi Baru"
      style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-input)', border: '1.5px solid transparent', borderRadius: 'var(--radius-inner)', fontSize: '16px', outline: 'none', fontFamily: 'inherit', color: 'var(--text-primary)' }} />
    <input type="password" placeholder="Konfirmasi Sandi Baru"
      style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-input)', border: '1.5px solid transparent', borderRadius: 'var(--radius-inner)', fontSize: '16px', outline: 'none', fontFamily: 'inherit', color: 'var(--text-primary)' }} />
    <button className="btn-primary" style={{ marginTop: '4px' }}>Simpan Sandi</button>
  </div>
);

export default Settings;
