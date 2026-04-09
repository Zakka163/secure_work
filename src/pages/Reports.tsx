import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockReports, type Report } from '../data/mockData';
import { MapPin, Clock, ChevronRight, ImageIcon } from 'lucide-react';
import ReportDetailModal from '../components/ReportDetailModal';
import CustomDatePicker from '../components/CustomDatePicker';

const AVATAR_COLORS = [
  { bg: '#FF6B6B', text: '#fff' }, { bg: '#4ECDC4', text: '#fff' }, { bg: '#45B7D1', text: '#fff' },
  { bg: '#96CEB4', text: '#fff' }, { bg: '#FFEAA7', text: '#636e72' }, { bg: '#DDA0DD', text: '#fff' },
  { bg: '#98D8C8', text: '#fff' }, { bg: '#F7DC6F', text: '#636e72' }, { bg: '#BB8FCE', text: '#fff' }, { bg: '#85C1E9', text: '#fff' },
];
const getAvatarColor = (name: string) => {
  const idx = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const Reports: React.FC = () => {
  const { data: reports = [] } = useQuery({ queryKey: ['reports'], queryFn: () => mockReports });

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeShift, setActiveShift] = useState<string>('Semua');
  const [activeDate, setActiveDate] = useState<string>('');

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const formatDateTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [dateP, timeP] = timeStr.split(' ');
    const d = new Date(dateP);
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} • ${timeP}`;
  };

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchShift = activeShift === 'Semua' || r.shift === activeShift;
      const matchDate = !activeDate || r.time.startsWith(activeDate);
      return matchShift && matchDate;
    });
  }, [reports, activeShift, activeDate]);

  return (
    <div style={{ paddingBottom: '24px' }}>
      
      {/* Premium iOS Filter Section */}
      <div className="ios-header" style={{ paddingBottom: '16px', paddingTop: '16px', background: 'var(--bg-main)' }}>
        
        {/* Date Filter Custom Component */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
           <CustomDatePicker activeDate={activeDate} setActiveDate={setActiveDate} />
        </div>
        
        {/* iOS Segmented Control for Shifts */}
        <div style={{ display: 'flex', background: '#E3E3E8', borderRadius: '10px', padding: '3px', width: '100%' }}>
          {['Semua', 'Pagi', 'Sore', 'Malam'].map(shift => (
            <button 
              key={shift}
              onClick={() => setActiveShift(shift)}
              style={{
                flex: 1, padding: '7px 0', border: 'none', borderRadius: '8px',
                background: activeShift === shift ? '#FFFFFF' : 'transparent',
                color: activeShift === shift ? '#000000' : '#8E8E93',
                fontWeight: activeShift === shift ? 600 : 500,
                fontSize: '14px', cursor: 'pointer',
                boxShadow: activeShift === shift ? '0 3px 8px rgba(0,0,0,0.12), 0 3px 1px rgba(0,0,0,0.04)' : 'none',
                transition: 'all 0.2s ease-out'
              }}
            >
              {shift}
            </button>
          ))}
        </div>
      </div>

      {/* iOS Card Feed with Image Preview */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {filteredReports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>Data tidak ditemukan.</div>
        ) : (
          filteredReports.map(report => {
            const hasImage = report.evidence.length > 0 && report.evidence[0].before;
            
            return (
              <div key={report.id} onClick={() => setSelectedReport(report)} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', border: '0.5px solid var(--border)' }}>
                {/* Header */}
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid var(--border)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ 
                       width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                       background: getAvatarColor(report.employeeName).bg, 
                       color: getAvatarColor(report.employeeName).text, 
                       display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' 
                     }}>
                       {getInitials(report.employeeName)}
                     </div>
                     <div>
                       <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{report.employeeName}</h3>
                       <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Shift {report.shift}</p>
                     </div>
                   </div>
                </div>

                {/* Body Content with Image Preview */}
                <div style={{ padding: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                   
                   {/* Image Thumbnail Container */}
                   {hasImage ? (
                     <div style={{ width: '85px', height: '85px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#E5E5EA' }}>
                       <img 
                         src={report.evidence[0].before} 
                         alt="Bukti Laporan" 
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                       />
                     </div>
                   ) : (
                     <div style={{ width: '85px', height: '85px', borderRadius: '10px', flexShrink: 0, background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C7C7CC' }}>
                       <ImageIcon size={28} />
                     </div>
                   )}

                   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.3 }}>
                        <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> 
                        <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{report.location}</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        <Clock size={14} /> <span>{formatDateTime(report.time)}</span>
                      </div>
                      
                      {report.notes && (
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 500 }}>
                          {report.notes}
                        </p>
                      )}
                   </div>
                   
                   <div style={{ alignSelf: 'center', marginLeft: '-4px' }}>
                     <ChevronRight size={20} style={{ color: '#C7C7CC' }} />
                   </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedReport && (
        <ReportDetailModal 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)} 
        />
      )}
    </div>
  );
};

export default Reports;
