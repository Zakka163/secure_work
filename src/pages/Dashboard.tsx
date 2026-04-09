import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockReports, getStats, type Report } from '../data/mockData';
import { Clock, MapPin, FileCheck, Users, ChevronRight, ImageIcon } from 'lucide-react';
import ReportDetailModal from '../components/ReportDetailModal';

const Dashboard: React.FC = () => {
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: getStats });
  const { data: reports } = useQuery({ queryKey: ['recentReports'], queryFn: () => mockReports.slice(0, 5) });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const AVATAR_COLORS = [
    { bg: '#FF6B6B', text: '#fff' }, { bg: '#4ECDC4', text: '#fff' }, { bg: '#45B7D1', text: '#fff' },
    { bg: '#96CEB4', text: '#fff' }, { bg: '#FFEAA7', text: '#636e72' }, { bg: '#DDA0DD', text: '#fff' },
    { bg: '#98D8C8', text: '#fff' }, { bg: '#F7DC6F', text: '#636e72' }, { bg: '#BB8FCE', text: '#fff' }, { bg: '#85C1E9', text: '#fff' },
  ];
  const getAvatarColor = (name: string) => {
    const idx = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
  };
  
  const formatDateTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [dateP, timeP] = timeStr.split(' ');
    const d = new Date(dateP);
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} • ${timeP}`;
  };

  return (
    <div style={{ paddingBottom: '20px', paddingTop: '16px' }}>

      {/* Top Metrics Boxed Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: 0 }}>
          <div style={{ color: 'var(--primary)' }}><FileCheck size={28} /></div>
          <div>
            <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', margin: 0, paddingBottom: '4px' }}>{stats?.totalReportsToday || 0}</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Laporan Baru</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: 0 }}>
          <div style={{ color: '#FF9500' }}><Users size={28} /></div>
          <div>
            <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', margin: 0, paddingBottom: '4px' }}>{stats?.activeEmployees || 0}</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Karyawan</p>
          </div>
        </div>
      </div>


      {/* Feed Container matching Reports.tsx */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {!reports || reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-secondary)' }}>Belum ada aktivitas.</div>
        ) : (
          reports.map(report => {
            const hasImage = report.evidence.length > 0 && report.evidence[0].before;
            
            return (
              <div key={report.id} className="card" onClick={() => setSelectedReport(report)} style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', border: '0.5px solid var(--border)', marginBottom: '16px' }}>
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

      <ReportDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />
    </div>
  );
};

export default Dashboard;
