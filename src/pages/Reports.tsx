import React, { useState, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockReports } from '../data/mockData';
import { Calendar, LayoutGrid, List, MapPin, Clock, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import ReportDetailModal from '../components/ReportDetailModal';
import type { Report, Shift } from '../data/mockData';

type ViewMode = 'card' | 'list';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Table Utils
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const getAvatarProps = (name: string) => {
    const colors = ['#DBEAFE', '#E0E7FF', '#F3E8FF', '#FCE7F3', '#FFE4E6', '#FFEDD5', '#FEF3C7', '#D1FAE5'];
    const textColors = ['#1E3A8A', '#3730A3', '#6B21A8', '#9D174D', '#BE123C', '#9A2B22', '#92400E', '#065F46'];
    const idx = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return { bg: colors[idx], text: textColors[idx] };
  };
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [dateFilter, setDateFilter] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Pagination & List Table States
  const [listShift, setListShift] = useState<Shift | 'Semua'>('Semua');
  const [sortConfig, setSortConfig] = useState<{key: keyof Report | null, direction: 'asc' | 'desc'}>({ key: 'time', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: reports } = useQuery({ queryKey: ['reports'], queryFn: () => mockReports });

  // 1. Date Filter Base
  const baseFiltered = useMemo(() => {
    if (!reports) return [];
    return reports.filter(r => {
      return dateFilter ? r.time.startsWith(dateFilter) : true;
    });
  }, [reports, dateFilter]);

  // 2. Grouped Reports (For Card View Only)
  const groupedReports = useMemo(() => {
    const groups: Record<Shift, Report[]> = { Pagi: [], Sore: [], Malam: [] };
    baseFiltered.forEach((report) => {
      groups[report.shift].push(report);
    });
    return groups;
  }, [baseFiltered]);

  // 3. Flat Reports (For Table List View Only)
  const tableData = useMemo(() => {
    let flat = [...baseFiltered];
    
    // Shift Filter
    if (listShift !== 'Semua') {
      flat = flat.filter(r => r.shift === listShift);
    }

    // Sort Config
    flat.sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];
      
      if (sortConfig.key === 'time') {
         valA = new Date(a.time).getTime() as any;
         valB = new Date(b.time).getTime() as any;
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination Calculation
    const totalPages = Math.ceil(flat.length / itemsPerPage) || 1;
    const safePage = Math.min(currentPage, Math.max(1, totalPages));
    const paginated = flat.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

    return { items: paginated, totalPages, totalItems: flat.length, safePage };
  }, [baseFiltered, listShift, sortConfig, currentPage]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, listShift, viewMode]);

  const shifts: Shift[] = ['Pagi', 'Sore', 'Malam'];

  // Helper for Card Slide
  const scrollContainer = (node: HTMLDivElement | null, direction: 'left' | 'right') => {
    if (node) {
      const scrollAmount = 300; // width of card + gap
      node.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const renderSortIcon = (columnKey: keyof Report) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} style={{ color: 'var(--primary)' }} /> : <ArrowDown size={14} style={{ color: 'var(--primary)' }} />;
  };

  return (
    <div>
      {/* Header */}
      <header className="header" style={{ marginBottom: 'var(--sp-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* View Toggles (Moved to Left) */}
        <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border)', padding: '2px' }}>
          <button
            onClick={() => setViewMode('card')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '6px 16px', border: 'none', background: viewMode === 'card' ? '#EFF6FF' : 'transparent',
              color: viewMode === 'card' ? 'var(--primary)' : 'var(--text-secondary)',
              borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600, fontSize: '13px'
            }}
          >
            <LayoutGrid size={16} /> Card
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '6px 16px', border: 'none', background: viewMode === 'list' ? '#EFF6FF' : 'transparent',
              color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-secondary)',
              borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600, fontSize: '13px'
            }}
          >
            <List size={16} /> List
          </button>
        </div>

        <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}>

          {/* List Mode Shift Filter */}
          {viewMode === 'list' && (
            <select 
              value={listShift} 
              onChange={(e) => setListShift(e.target.value as Shift | 'Semua')}
              className="btn-secondary"
              style={{ padding: '7px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', outline: 'none', height: '34px' }}
            >
              <option value="Semua">Semua Shift</option>
              <option value="Pagi">Shift Pagi</option>
              <option value="Sore">Shift Sore</option>
              <option value="Malam">Shift Malam</option>
            </select>
          )}

          {/* Date Filter - Styled Native Wrapper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  try {
                    dateInputRef.current?.showPicker();
                  } catch (e) {
                    dateInputRef.current?.focus();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: dateFilter ? '#EFF6FF' : '#F1F5F9', // Active state color
                  color: dateFilter ? 'var(--primary)' : 'var(--text-secondary)',
                  border: '1px solid transparent',
                  padding: '7px 14px',
                  cursor: 'pointer'
                }}
              >
                <Calendar size={18} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>
                  {dateFilter || 'Tanggal'}
                </span>
              </button>

              {/* Hidden native trigger */}
              <input
                ref={dateInputRef}
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{
                  position: 'absolute',
                  width: 0,
                  height: 0,
                  opacity: 0,
                  border: 'none',
                  padding: 0,
                  pointerEvents: 'none'
                }}
              />
            </div>

            {/* Clear Button (only when active) */}
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                title="Hapus filter tanggal"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Fork - Card View vs List View */}
      {viewMode === 'card' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {groupedReports && shifts.map((shift) => {
            const shiftReports = groupedReports[shift];
            if (shiftReports.length === 0) return null;

            return (
              <ShiftSection
                key={shift}
                shift={shift}
                reports={shiftReports}
                onSelectReport={setSelectedReport}
                onScroll={scrollContainer}
              />
            );
          })}

          {/* Empty State Card */}
          {groupedReports && shifts.every(s => groupedReports[s].length === 0) && (
            <div style={{ padding: 'var(--sp-4)', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-card)', borderRadius: 'var(--radius-card)', border: '1px dashed var(--border)' }}>
              Tidak menemukan laporan yang sesuai dengan filter.
            </div>
          )}
        </div>
      ) : (
        /* 📋 List View Table */
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {/* Table Content */}
          <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#F8FAFC' }}>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th 
                    onClick={() => setSortConfig({ key: 'employeeName', direction: sortConfig.key === 'employeeName' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    style={{ cursor: 'pointer', width: '30%', padding: '16px 24px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>NAMA {renderSortIcon('employeeName')}</div>
                  </th>
                  <th 
                    onClick={() => setSortConfig({ key: 'shift', direction: sortConfig.key === 'shift' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    style={{ cursor: 'pointer', width: '10%', padding: '16px 24px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>SHIFT {renderSortIcon('shift')}</div>
                  </th>
                  <th 
                    onClick={() => setSortConfig({ key: 'location', direction: sortConfig.key === 'location' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    style={{ cursor: 'pointer', width: '30%', padding: '16px 24px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>LOKASI {renderSortIcon('location')}</div>
                  </th>
                  <th 
                    onClick={() => setSortConfig({ key: 'time', direction: sortConfig.key === 'time' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                    style={{ cursor: 'pointer', width: '25%', padding: '16px 24px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>WAKTU {renderSortIcon('time')}</div>
                  </th>
                  <th style={{ width: '5%', padding: '16px 24px' }}></th>
                </tr>
              </thead>
              <tbody>
                {tableData.items.length === 0 ? (
                   <tr>
                     <td colSpan={5} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-secondary)', background: 'white' }}>
                        Tidak ada laporan yang sesuai dengan filter.
                     </td>
                   </tr>
                ) : (
                  tableData.items.map((report) => {
                    const avatar = getAvatarProps(report.employeeName);
                    return (
                      <tr
                        key={report.id}
                        onClick={() => setSelectedReport(report)}
                        style={{ cursor: 'pointer', transition: 'all 0.2s', borderBottom: '1px solid var(--border)', background: 'white' }}
                        onMouseEnter={(e) => {
                           e.currentTarget.style.background = '#F1F5F9';
                           e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                           e.currentTarget.style.background = 'white';
                           e.currentTarget.style.transform = 'translateY(0)';
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
                              {getInitials(report.employeeName)}
                            </div>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>
                              {report.employeeName}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ 
                             background: report.shift === 'Pagi' ? '#FEF08A' : report.shift === 'Sore' ? '#FFEDD5' : '#E2E8F0', 
                             color: report.shift === 'Pagi' ? '#854D0E' : report.shift === 'Sore' ? '#9A3412' : '#334155',
                             padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 
                          }}>
                            {report.shift}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} /> 
                            <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{report.location}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                            <Clock size={14} style={{ color: 'var(--text-secondary)' }} /> {report.time}
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <ChevronRight size={18} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* List Footer (Total Data & Pagination) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--border)', background: '#F8FAFC' }}>
             <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Menampilkan {tableData.items.length} dari {tableData.totalItems} Laporan
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
      )}

      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
};

// --- Sub Component for Card View Shift Section ---
interface ShiftSectionProps {
  shift: Shift;
  reports: Report[];
  onSelectReport: (r: Report) => void;
  onScroll: (node: HTMLDivElement | null, dir: 'left' | 'right') => void;
}

const ShiftSection: React.FC<ShiftSectionProps> = ({ shift, reports, onSelectReport, onScroll }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
        <h2 style={{ fontSize: '16px', color: 'var(--text-primary)' }}>Shift {shift}</h2>
        <span className="muted" style={{ fontSize: '12px', background: '#F1F5F9', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
          {reports.length} Laporan
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)', margin: '0 var(--sp-2)' }}></div>

        {/* Slide Controls */}
        {reports.length > 3 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onScroll(scrollRef.current, 'left')}
              style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => onScroll(scrollRef.current, 'right')}
              style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* 🔲 Card View Slider */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: 'var(--sp-3)',
          paddingBottom: 'var(--sp-2)',
          scrollBehavior: 'smooth',
          scrollSnapType: 'x mandatory',
          msOverflowStyle: 'none',  /* IE and Edge */
          scrollbarWidth: 'none',  /* Firefox */
          alignItems: 'flex-start'
        }}
        className="hide-scrollbar"
      >
        {reports.map((report) => (
          <div
            key={report.id}
            className="card"
            style={{
              minWidth: '280px',
              width: '280px',
              flexShrink: 0,
              scrollSnapAlign: 'start',
              padding: 0,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
            onClick={() => onSelectReport(report)}
          >
            {/* Image Thumbnail */}
            <div style={{ position: 'relative', width: '100%', height: '160px', background: '#F8FAFC', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
              <img
                src={report.evidence[0]?.before || ''}
                alt="Report thumbnail"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {report.evidence.length > 1 && (
                <div style={{
                  position: 'absolute', top: '8px', right: '8px',
                  background: 'rgba(15, 23, 42, 0.6)', color: 'white',
                  padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500,
                  backdropFilter: 'blur(4px)'
                }}>
                  +{report.evidence.length - 1} Foto
                </div>
              )}
            </div>

            {/* Card Info */}
            <div style={{ padding: 'var(--sp-2)' }}>
              <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px', color: 'var(--text-primary)' }}>
                {report.employeeName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px' }}>
                <Clock size={14} />
                <span>{report.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {report.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Reports;
