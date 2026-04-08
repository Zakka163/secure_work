import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockEmployees } from '../data/mockData';
import { Activity, Clock, ChevronRight, ChevronLeft, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { Employee } from '../data/mockData';

const Employees: React.FC = () => {
  const { data: employees } = useQuery({ queryKey: ['employees'], queryFn: () => mockEmployees });

  // Pagination & Sorting States
  const [sortConfig, setSortConfig] = useState<{ key: keyof Employee | null, direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Table Utils
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const getAvatarProps = (name: string) => {
    const colors = ['#DBEAFE', '#E0E7FF', '#F3E8FF', '#FCE7F3', '#FFE4E6', '#FFEDD5', '#FEF3C7', '#D1FAE5'];
    const textColors = ['#1E3A8A', '#3730A3', '#6B21A8', '#9D174D', '#BE123C', '#9A2B22', '#92400E', '#065F46'];
    const idx = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return { bg: colors[idx], text: textColors[idx] };
  };

  const renderSortIcon = (columnKey: keyof Employee) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} style={{ color: 'var(--primary)' }} /> : <ArrowDown size={14} style={{ color: 'var(--primary)' }} />;
  };

  // Processed Data
  const tableData = useMemo(() => {
    if (!employees) return { items: [], totalPages: 0, totalItems: 0, safePage: 1 };
    let flat = [...employees];

    // Sorting
    flat.sort((a, b) => {
      if (!sortConfig.key) return 0;

      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    const totalPages = Math.ceil(flat.length / itemsPerPage);
    const safePage = Math.min(currentPage, Math.max(1, totalPages));
    const paginated = flat.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

    return { items: paginated, totalPages, totalItems: flat.length, safePage };
  }, [employees, sortConfig, currentPage]);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Karyawan Lapangan</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Monitoring aktivitas dan performa harian karyawan</p>
          </div> */}
        </div>
      </div>

      {/* Main Content Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#F8FAFC' }}>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th
                  onClick={() => setSortConfig({ key: 'name', direction: sortConfig.key === 'name' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                  style={{ cursor: 'pointer', width: '35%', padding: '16px 24px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>NAMA {renderSortIcon('name')}</div>
                </th>
                <th
                  onClick={() => setSortConfig({ key: 'reportCount', direction: sortConfig.key === 'reportCount' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                  style={{ cursor: 'pointer', width: '20%', padding: '16px 24px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>TOTAL LAPORAN {renderSortIcon('reportCount')}</div>
                </th>
                <th
                  onClick={() => setSortConfig({ key: 'lastActive', direction: sortConfig.key === 'lastActive' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                  style={{ cursor: 'pointer', width: '25%', padding: '16px 24px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>LOGIN TERKINI {renderSortIcon('lastActive')}</div>
                </th>
                <th
                  onClick={() => setSortConfig({ key: 'status', direction: sortConfig.key === 'status' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                  style={{ cursor: 'pointer', width: '20%', padding: '16px 24px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>STATUS {renderSortIcon('status')}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.items.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-secondary)', background: 'white' }}>
                    Tidak ada data karyawan.
                  </td>
                </tr>
              ) : (
                tableData.items.map((emp) => {
                  const avatar = getAvatarProps(emp.name);
                  const isOnline = emp.status === 'online'; // Assuming mock data has status online/offline
                  return (
                    <tr
                      key={emp.id}
                      style={{ transition: 'all 0.2s', borderBottom: '1px solid var(--border)', background: 'white' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F1F5F9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                      }}
                    >
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '38px', height: '38px', borderRadius: '50%',
                            background: avatar.bg, color: avatar.text,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 600, fontSize: '14px', border: `1px solid ${avatar.text}20`
                          }}>
                            {getInitials(emp.name)}
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>
                            {emp.name}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Activity size={14} />
                          {emp.reportCount} Laporan
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                          <Clock size={14} /> {emp.lastActive}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isOnline ? '#16A34A' : '#EF4444', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize' }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: isOnline ? '#16A34A' : '#EF4444', boxShadow: `0 0 4px ${isOnline ? '#16A34A' : '#EF4444'}80` }} />
                          {emp.status}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--border)', background: '#F8FAFC' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Menampilkan {tableData.items.length} dari {tableData.totalItems} Karyawan
          </span>

          {tableData.totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Halaman {tableData.safePage} / {tableData.totalPages}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  disabled={tableData.safePage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)',
                    background: tableData.safePage === 1 ? '#F1F5F9' : 'white',
                    color: tableData.safePage === 1 ? '#94A3B8' : 'var(--text-primary)',
                    cursor: tableData.safePage === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = 'white')}
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: tableData.totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '36px', height: '36px', borderRadius: '8px',
                      border: tableData.safePage === pageNum ? '1px solid var(--primary)' : '1px solid var(--border)',
                      background: tableData.safePage === pageNum ? '#EFF6FF' : 'white',
                      color: tableData.safePage === pageNum ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: tableData.safePage === pageNum ? 700 : 500,
                      cursor: 'pointer', fontSize: '13px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (tableData.safePage !== pageNum) e.currentTarget.style.background = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (tableData.safePage !== pageNum) e.currentTarget.style.background = 'white';
                    }}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  disabled={tableData.safePage === tableData.totalPages}
                  onClick={() => setCurrentPage(p => Math.min(tableData.totalPages, p + 1))}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)',
                    background: tableData.safePage === tableData.totalPages ? '#F1F5F9' : 'white',
                    color: tableData.safePage === tableData.totalPages ? '#94A3B8' : 'var(--text-primary)',
                    cursor: tableData.safePage === tableData.totalPages ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = 'white')}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;
