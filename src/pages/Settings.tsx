/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { Clock, Plus, Settings as SettingsIcon, Shield, ChevronRight } from 'lucide-react';

/* --- Domain Types --- */
type ShiftConfig = {
  id: string;
  name: string;
  start: string;
  end: string;
};

const DEFAULT_SHIFTS: ShiftConfig[] = [
  { id: '1', name: 'Pagi', start: '06:00', end: '14:00' },
  { id: '2', name: 'Sore', start: '14:00', end: '22:00' },
  { id: '3', name: 'Malam', start: '22:00', end: '06:00' },
];

/* --- Validation Utils --- */
const toMins = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const checkOverlap = (newStart: string, newEnd: string, existingShifts: ShiftConfig[], ignoreId?: string): boolean => {
  const ns = toMins(newStart);
  const ne = toMins(newEnd);
  
  if (ns === ne) return true; // Invalid span

  const getIntervals = (s: number, e: number) => s < e ? [[s, e]] : [[s, 24 * 60], [0, e]];
  const newInts = getIntervals(ns, ne);
  
  for (const shift of existingShifts) {
    if (shift.id === ignoreId) continue;
    
    const os = toMins(shift.start);
    const oe = toMins(shift.end);
    const oInts = getIntervals(os, oe);
    
    for (const x of newInts) {
      for (const y of oInts) {
        if (x[0] < y[1] && x[1] > y[0]) return true; // overlap!
      }
    }
  }
  return false;
};

/* --- Main Component --- */
const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shift' | 'security'>('shift');

  return (
    <div style={{ paddingBottom: '40px', maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
      
      {/* LEFT PANE: Settings Navigation */}
      <div style={{ width: '240px', flexShrink: 0, position: 'sticky', top: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 24px 0', color: 'var(--text-primary)' }}>Pengaturan</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('shift')}
            style={{ 
               display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: 'none', background: activeTab === 'shift' ? '#EFF6FF' : 'transparent',
               color: activeTab === 'shift' ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 600, fontSize: '14px', borderRadius: '8px', cursor: 'pointer',
               textAlign: 'left', transition: 'all 0.2s', boxShadow: activeTab === 'shift' ? 'inset 3px 0 0 var(--primary)' : 'none'
            }}
            onMouseEnter={e => { if(activeTab !== 'shift') e.currentTarget.style.background = '#F8FAFC' }}
            onMouseLeave={e => { if(activeTab !== 'shift') e.currentTarget.style.background = 'transparent' }}
          >
            <Clock size={18} style={{ opacity: activeTab === 'shift' ? 1 : 0.6 }} /> 
            <span style={{ flex: 1 }}>Shift Operasional</span>
            {activeTab === 'shift' && <ChevronRight size={16} />}
          </button>
          
          <button 
            onClick={() => setActiveTab('security')}
            style={{ 
               display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: 'none', background: activeTab === 'security' ? '#EFF6FF' : 'transparent',
               color: activeTab === 'security' ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 600, fontSize: '14px', borderRadius: '8px', cursor: 'pointer',
               textAlign: 'left', transition: 'all 0.2s', boxShadow: activeTab === 'security' ? 'inset 3px 0 0 var(--primary)' : 'none'
            }}
            onMouseEnter={e => { if(activeTab !== 'security') e.currentTarget.style.background = '#F8FAFC' }}
            onMouseLeave={e => { if(activeTab !== 'security') e.currentTarget.style.background = 'transparent' }}
          >
            <Shield size={18} style={{ opacity: activeTab === 'security' ? 1 : 0.6 }} /> 
            <span style={{ flex: 1 }}>Keamanan Akun</span>
            {activeTab === 'security' && <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {/* RIGHT PANE: Dynamic Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {activeTab === 'shift' && <ShiftSettingsTab />}
        {activeTab === 'security' && <SecuritySettingsTab />}
      </div>
    
    </div>
  );
};


/* --- INTERNAL COMPOENTS (Sub-Tabs) --- */

const ShiftSettingsTab: React.FC = () => {
  const [shifts, setShifts] = useState<ShiftConfig[]>(DEFAULT_SHIFTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftConfig | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [name, setName] = useState('');
  const [start, setStart] = useState('00:00');
  const [end, setEnd] = useState('00:00');

  const getCurrentShiftPreview = () => {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    for (const shift of shifts) {
      const s = toMins(shift.start);
      const e = toMins(shift.end);
      if (s < e) {
        if (currentMins >= s && currentMins < e) return shift.name;
      } else {
        if (currentMins >= s || currentMins < e) return shift.name;
      }
    }
    return 'Di luar shift';
  };

  const [currentShiftName, setCurrentShiftName] = useState(getCurrentShiftPreview());
  useEffect(() => {
    const timer = setInterval(() => setCurrentShiftName(getCurrentShiftPreview()), 60000); 
    return () => clearInterval(timer);
  }, [shifts]);

  const openModal = (shift?: ShiftConfig) => {
    setErrorMsg('');
    if (shift) {
      setEditingShift(shift); setName(shift.name); setStart(shift.start); setEnd(shift.end);
    } else {
      setEditingShift(null); setName(''); setStart('08:00'); setEnd('17:00');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => { setEditingShift(null); setName(''); }, 200);
  };

  const handleSave = () => {
    if (!name.trim()) return setErrorMsg('Nama shift tidak boleh kosong.');
    if (toMins(start) === toMins(end)) return setErrorMsg('Jam masuk dan keluar tidak boleh sama.');
    if (checkOverlap(start, end, shifts, editingShift?.id)) return setErrorMsg('Waktu shift bertabrakan dengan shift lain.');

    if (editingShift) {
      setShifts(prev => prev.map(s => s.id === editingShift.id ? { ...s, name, start, end } : s));
    } else {
      setShifts(prev => [...prev, { id: Date.now().toString(), name, start, end }]);
    }
    closeModal();
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Integrasi Waktu Laporan</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Otomatisasi pengelompokan laporan berdasarkan zona jam operasional.</p>
        </div>
        <button 
          onClick={() => openModal()}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#2563EB'} onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
        >
          <Plus size={16} /> Tambah
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '12px 16px', background: '#EFF6FF', borderRadius: '8px', border: '1px solid #DBEAFE' }}>
        <Clock size={16} style={{ color: 'var(--primary)' }} />
        <span style={{ fontSize: '13px', color: '#1E3A8A', fontWeight: 500 }}>
          Jam saat ini ({new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}) otomatis membaca <b>Shift {currentShiftName}</b>
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {shifts.map(shift => (
          <div 
            key={shift.id}
            onClick={() => openModal(shift)}
            style={{
              background: 'white', borderRadius: '12px', padding: '16px 20px', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#93C5FD'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>{shift.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <Clock size={14} style={{ opacity: 0.6 }} /> {shift.start} — {shift.end}
                {toMins(shift.start) > toMins(shift.end) && (
                  <span style={{ background: '#F1F5F9', padding: '2px 8px', borderRadius: '16px', fontSize: '11px', fontWeight: 600, marginLeft: '6px', color: '#64748B' }}>Melintas Malam</span>
                )}
              </div>
            </div>
            <div style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: 600 }}>Tinjau</div>
          </div>
        ))}
        {shifts.length === 0 && <div style={{ textAlign: 'center', padding: '40px', background: 'transparent', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--text-secondary)' }}>Belum ada aturan shift terpeta.</div>}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', padding: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', animation: 'zoomIn 0.2s ease' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{editingShift ? 'Edit Rentang Shift' : 'Pemetaan Shift Baru'}</h2>
            </div>
            <div style={{ padding: '24px' }}>
              {errorMsg && <div style={{ padding: '12px', background: '#FEF2F2', color: '#B91C1C', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', border: '1px solid #FECACA' }}>{errorMsg}</div>}
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Label Shift</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Shift Pagi" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Mulai Aktual</label>
                  <input type="time" value={start} onChange={e => setStart(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Berakhir Di</label>
                  <input type="time" value={end} onChange={e => setEnd(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 24px', background: '#F8FAFC', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={closeModal} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Batal</button>
              <button onClick={handleSave} style={{ padding: '10px 16px', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)' }}>Konfirmasi</button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

const SecuritySettingsTab: React.FC = () => {
  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Autentikasi Akun</h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Tinjau dan perbarui sandi rahasia untuk akses kredensial ke sistem kerja operasional Anda.</p>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Sandi Utama Lama</label>
            <input type="password" placeholder="Masukkan struktur sandi lama" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }} onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Pembaruan Sandi Jaringan</label>
            <input type="password" placeholder="Struktur pengamanan abjad-angka (min. 8 kata)" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }} onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Konfirmasi Pola Sandi</label>
            <input type="password" placeholder="Ulangi pengetikan" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }} onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'} />
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <button style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)' }}>
              Proses Pembaruan Kredensial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
