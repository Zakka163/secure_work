import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Clock, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import type { Report } from '../data/mockData';

interface ReportDetailModalProps {
  report: Report | null;
  onClose: () => void;
}

const AVATAR_COLORS = [
  { bg: '#FF6B6B', text: '#fff' }, { bg: '#4ECDC4', text: '#fff' }, { bg: '#45B7D1', text: '#fff' },
  { bg: '#96CEB4', text: '#fff' }, { bg: '#FFEAA7', text: '#636e72' }, { bg: '#DDA0DD', text: '#fff' },
  { bg: '#98D8C8', text: '#fff' }, { bg: '#F7DC6F', text: '#636e72' }, { bg: '#BB8FCE', text: '#fff' }, { bg: '#85C1E9', text: '#fff' },
];
const getAvatarColor = (name: string) => {
  const idx = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

const formatDateTime = (timeStr: string) => {
  if (!timeStr) return '';
  const [dateP, timeP] = timeStr.split(' ');
  const d = new Date(dateP);
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} • ${timeP}`;
};

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ report, onClose }) => {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [activePairIdx, setActivePairIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');

  if (!report) return null;

  const avatar = getAvatarColor(report.employeeName);
  const totalPairs = report.evidence.length;
  const currentPair = report.evidence[activePairIdx];
  const currentImg = activeTab === 'before' ? currentPair?.before : (currentPair?.after ?? currentPair?.before);

  return createPortal(
    <>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9998 }}>
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: '430px',
            background: 'var(--bg-main)',
            borderRadius: '24px 24px 0 0',
            maxHeight: '92vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideUpMobile 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: 'var(--shadow-modal)',
          }}
        >

          {/* ── Header (Action Sheet Style like Employees) ── */}
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px 24px 0 0',
            borderBottom: '0.5px solid var(--border)',
            padding: '14px 16px 0',
            flexShrink: 0,
          }}>
            {/* Drag Handle */}
            <div style={{ width: '36px', height: '4px', background: 'var(--border)', borderRadius: '2px', margin: '0 auto 16px auto' }} />

            {/* Profile section - centered like iOS Action Sheet */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '16px', gap: '8px' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: avatar.bg, color: avatar.text,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '22px',
                boxShadow: `0 6px 20px ${avatar.bg}55`,
                marginBottom: '4px',
              }}>
                {getInitials(report.employeeName)}
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {report.employeeName}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {formatDateTime(report.time)}
                </span>
                <span style={{ color: 'var(--border)', fontSize: '13px' }}>•</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} /> {report.location}
                </span>
              </div>
              <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' }}>
                Shift {report.shift}
              </span>
            </div>

            {/* Before / After Segment */}
            {totalPairs > 0 && (
              <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: '10px', padding: '3px', marginBottom: '14px' }}>
                {(['before', 'after'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    disabled={tab === 'after' && !currentPair?.after}
                    style={{
                      flex: 1, padding: '8px 0', border: 'none', borderRadius: '8px', fontFamily: 'inherit',
                      background: activeTab === tab ? 'white' : 'transparent',
                      color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: activeTab === tab ? 600 : 500,
                      fontSize: '14px',
                      cursor: tab === 'after' && !currentPair?.after ? 'not-allowed' : 'pointer',
                      opacity: tab === 'after' && !currentPair?.after ? 0.4 : 1,
                      boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {tab === 'before' ? 'Sebelum' : 'Sesudah'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Close button floating */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              width: '32px', height: '32px', borderRadius: '50%', border: 'none',
              background: 'var(--bg-input)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', zIndex: 10,
            }}
          >
            <X size={16} />
          </button>

          {/* ── Scrollable Body ── */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '16px 16px 32px' }}>

            {/* Image */}
            {totalPairs > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div
                  onClick={() => currentImg && setLightboxImg(currentImg)}
                  style={{
                    width: '100%', borderRadius: 'var(--radius-card)', overflow: 'hidden',
                    background: '#1C1C1E', position: 'relative', cursor: 'pointer', aspectRatio: '4/3',
                  }}
                >
                  {currentImg ? (
                    <img src={currentImg} alt={activeTab} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                      Tidak ada foto
                    </div>
                  )}
                  {currentImg && (
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.45)', borderRadius: '20px', padding: '6px 10px', display: 'flex', alignItems: 'center' }}>
                      <ZoomIn size={14} color="white" />
                    </div>
                  )}
                </div>

                {/* Carousel nav */}
                {totalPairs > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
                    <button
                      onClick={() => setActivePairIdx(i => Math.max(0, i - 1))}
                      disabled={activePairIdx === 0}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: activePairIdx === 0 ? 0.3 : 1 }}
                    ><ChevronLeft size={18} color="var(--text-primary)" /></button>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      {report.evidence.map((_, i) => (
                        <div key={i} onClick={() => setActivePairIdx(i)} style={{ width: i === activePairIdx ? '20px' : '8px', height: '8px', borderRadius: '4px', background: i === activePairIdx ? 'var(--primary)' : 'var(--border)', cursor: 'pointer', transition: 'all 0.3s' }} />
                      ))}
                    </div>

                    <button
                      onClick={() => setActivePairIdx(i => Math.min(totalPairs - 1, i + 1))}
                      disabled={activePairIdx === totalPairs - 1}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: activePairIdx === totalPairs - 1 ? 0.3 : 1 }}
                    ><ChevronRight size={18} color="var(--text-primary)" /></button>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {report.notes && (
              <div className="mobile-list-container">
                <div className="mobile-list-item" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '6px', cursor: 'default' }}>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>CATATAN</p>
                  <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.6 }}>{report.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.97)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px' }}
          onClick={() => setLightboxImg(null)}
        >
          <button style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
            <X size={22} />
          </button>
          <img src={lightboxImg} alt="Preview" onClick={e => e.stopPropagation()} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px' }} />
        </div>
      )}
    </>,
    document.body
  );
};

export default ReportDetailModal;
