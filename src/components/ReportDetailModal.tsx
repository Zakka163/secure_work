import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Report } from '../data/mockData';

interface ReportDetailModalProps {
  report: Report | null;
  onClose: () => void;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ report, onClose }) => {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  if (!report) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 100 }}>
        <div 
           className="modal-content" 
           onClick={(e) => e.stopPropagation()}
           style={{ 
             maxWidth: '960px', 
             padding: '40px',
             borderRadius: '16px',
             background: 'var(--bg-card)',
             boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
             animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
           }}
        >
          {/* Header Section */}
          <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {report.employeeName}
              </h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '15px' }}>
                <span>8 Apr • {report.time.split(' ')[1]}</span>
                <span>–</span>
                <span>{report.location}</span>
              </div>
            </div>

            {/* Sidebar-style Close Button (Icon Only) */}
            <button 
              onClick={onClose}
              style={{ 
                 display: 'flex', alignItems: 'center', justifyContent: 'center', 
                 background: 'transparent', border: 'none', 
                 color: 'var(--text-secondary)', cursor: 'pointer',
                 padding: '8px', borderRadius: '8px',
                 transition: 'all 0.2s',
                 marginTop: '4px'
              }}
              onMouseEnter={(e) => {
                 e.currentTarget.style.background = '#F1F5F9';
                 e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                 e.currentTarget.style.background = 'transparent';
                 e.currentTarget.style.color = 'var(--text-secondary)';
              }}
              title="Tutup"
            >
              <X size={20} />
            </button>
          </div>



          {/* Evidence Section (Main Focus) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
             {/* Pairs Loop */}
             {report.evidence.map((pair, idx) => (
               <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={{ position: 'relative' }}>
                     {/* Tiny subtle pill label inside image */}
                     <div style={{ 
                       position: 'absolute', top: '12px', left: '12px', 
                       background: 'rgba(255,255,255,0.95)', padding: '4px 10px', 
                       borderRadius: '6px', fontSize: '11px', fontWeight: 700, 
                       color: 'var(--text-primary)', letterSpacing: '0.05em', zIndex: 10,
                       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                     }}>BEFORE</div>
                     <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <img 
                         src={pair.before} 
                         alt="Before evidence" 
                         onClick={() => setFullscreenImage(pair.before)}
                         style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain', cursor: 'pointer', transition: 'transform 0.4s ease-out', display: 'block' }}
                         onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                         onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                       />
                     </div>
                  </div>
                  
                  <div style={{ position: 'relative' }}>
                     <div style={{ 
                       position: 'absolute', top: '12px', left: '12px', 
                       background: 'rgba(255,255,255,0.95)', padding: '4px 10px', 
                       borderRadius: '6px', fontSize: '11px', fontWeight: 700, 
                       color: 'var(--text-primary)', letterSpacing: '0.05em', zIndex: 10,
                       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                     }}>AFTER</div>
                     <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {pair.after ? (
                           <img 
                             src={pair.after} 
                             alt="After evidence" 
                             onClick={() => setFullscreenImage(pair.after)}
                             style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain', cursor: 'pointer', transition: 'transform 0.4s ease-out', display: 'block' }}
                             onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                             onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                           />
                        ) : (
                           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '14px' }}>Tidak ada gambar</div>
                        )}
                     </div>
                  </div>
               </div>
             ))}
          </div>

          {/* Notes Section */}
          {report.notes && (
             <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {report.notes}
                </p>
             </div>
          )}


        </div>
      </div>

      {/* Fullscreen Image Preview */}
      {fullscreenImage && (
         <div 
           style={{ 
              position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.95)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              zIndex: 9999, padding: '24px', backdropFilter: 'blur(4px)'
           }}
           onClick={() => setFullscreenImage(null)}
         >
            <button 
              style={{ 
                position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', 
                border: 'none', color: 'white', cursor: 'pointer', borderRadius: '50%',
                width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <X size={24} />
            </button>
            <img 
               src={fullscreenImage} 
               alt="Fullscreen preview" 
               style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} 
               onClick={(e) => e.stopPropagation()}
            />
         </div>
      )}
    </>
  );
};

export default ReportDetailModal;
