import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockReports, getStats } from '../data/mockData';
import { Clock, MapPin, FileCheck, Users, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: getStats });
  const { data: reports } = useQuery({ queryKey: ['recentReports'], queryFn: () => mockReports.slice(0, 5) });

  // Avatar Utils
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const getAvatarProps = (name: string) => {
    const colors = ['#DBEAFE', '#E0E7FF', '#F3E8FF', '#FCE7F3', '#FFE4E6', '#FFEDD5', '#FEF3C7', '#D1FAE5'];
    const textColors = ['#1E3A8A', '#3730A3', '#6B21A8', '#9D174D', '#BE123C', '#9A2B22', '#92400E', '#065F46'];
    const idx = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return { bg: colors[idx], text: textColors[idx] };
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Dashboard</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Ringkasan aktivitas dan performa pemantauan hari ini</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--sp-5)', marginBottom: 'var(--sp-6)' }}>
        
        {/* Metric 1 */}
        <div style={{ 
            background: 'white', padding: '24px', borderRadius: '12px', 
            border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'
        }}>
          <div>
            <p style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>Laporan Masuk Hari Ini</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {stats?.totalReportsToday || 0}
              </h2>
              <span style={{ 
                  background: '#ECFDF5', color: '#059669', padding: '4px 10px', 
                  borderRadius: '20px', fontSize: '12px', fontWeight: 700 
              }}>
                +12% Baru
              </span>
            </div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <FileCheck size={24} />
          </div>
        </div>

        {/* Metric 2 */}
        <div style={{ 
            background: 'white', padding: '24px', borderRadius: '12px', 
            border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'
        }}>
          <div>
            <p style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>Karyawan Aktif Memantau</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {stats?.activeEmployees || 0}
              </h2>
              <span style={{ 
                  background: '#EFF6FF', color: '#1D4ED8', padding: '4px 10px', 
                  borderRadius: '20px', fontSize: '12px', fontWeight: 700 
              }}>
                Online
              </span>
            </div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* Main Content Table */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} style={{ color: 'var(--primary)' }} /> Aktivitas Laporan Terbaru
          </h2>
        </div>
        
        <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#F8FAFC' }}>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ width: '35%', padding: '16px 24px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  KARYAWAN
                </th>
                <th style={{ width: '25%', padding: '16px 24px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  LOKASI
                </th>
                <th style={{ width: '40%', padding: '16px 24px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  WAKTU
                </th>
              </tr>
            </thead>
            <tbody>
              {!reports || reports.length === 0 ? (
                 <tr>
                   <td colSpan={3} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-secondary)', background: 'white' }}>
                      Belum ada aktivitas laporan terbaru.
                   </td>
                 </tr>
              ) : (
                reports.map((report) => {
                  const avatar = getAvatarProps(report.employeeName);
                  return (
                    <tr
                      key={report.id}
                      style={{ transition: 'all 0.2s', borderBottom: '1px solid var(--border)', background: 'white' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ 
                             width: '38px', height: '38px', borderRadius: '50%', 
                             background: avatar.bg, color: avatar.text, 
                             display: 'flex', alignItems: 'center', justifyContent: 'center',
                             fontWeight: 600, fontSize: '14px', border: `1px solid ${avatar.text}20`
                          }}>
                            {getInitials(report.employeeName)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>
                              {report.employeeName}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                              Shift {report.shift}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} style={{ color: 'var(--text-muted)' }} /> 
                          {report.location}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                          <Clock size={14} style={{ color: 'var(--text-muted)' }} /> {report.time}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
