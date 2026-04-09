import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mockEmployees, type Employee } from '../data/mockData';
import { MessageCircle, Search, UserPlus, Trash2, ChevronRight, FileText } from 'lucide-react';
import { createPortal } from 'react-dom';

// Colorful avatar palette (iOS Contacts style)
const AVATAR_COLORS = [
  { bg: '#FF6B6B', text: '#fff' },
  { bg: '#4ECDC4', text: '#fff' },
  { bg: '#45B7D1', text: '#fff' },
  { bg: '#96CEB4', text: '#fff' },
  { bg: '#FFEAA7', text: '#636e72' },
  { bg: '#DDA0DD', text: '#fff' },
  { bg: '#98D8C8', text: '#fff' },
  { bg: '#F7DC6F', text: '#636e72' },
  { bg: '#BB8FCE', text: '#fff' },
  { bg: '#85C1E9', text: '#fff' },
];

const getAvatarColor = (name: string) => {
  const idx = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const Employees: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: employees = [] } = useQuery({ queryKey: ['employees'], queryFn: () => mockEmployees });

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addSearch, setAddSearch] = useState('');
  const [selectedActionEmployee, setSelectedActionEmployee] = useState<Employee | null>(null);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const processedList = useMemo(() => {
    return employees
      .filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.phone.includes(search)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [employees, search]);

  const handleWhatsApp = (phone: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(`https://wa.me/${phone}`, '_blank');
    setSelectedActionEmployee(null);
  };

  const handleAddEmployee = () => {
    if (!addSearch.trim()) return;
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: addSearch.charAt(0).toUpperCase() + addSearch.slice(1),
      reportCount: 0,
      lastActive: `2026-04-09 12:00`,
      phone: `628999${Math.floor(100000 + Math.random() * 900000)}`,
    };
    mockEmployees.push(newEmployee);
    queryClient.invalidateQueries({ queryKey: ['employees'] });
    setIsAddModalOpen(false);
    setAddSearch('');
  };

  const handleDeleteEmployee = () => {
    if (!selectedActionEmployee) return;
    const idx = mockEmployees.findIndex(e => e.id === selectedActionEmployee.id);
    if (idx > -1) {
      mockEmployees.splice(idx, 1);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
    setSelectedActionEmployee(null);
  };

  return (
    <div style={{ paddingBottom: '24px' }}>

      {/* Search + Add Button */}
      <div className="ios-header" style={{ paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8E8E93' }} />
            <input
              type="text"
              placeholder="Cari nama atau nomor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', height: '40px', paddingLeft: '36px', paddingRight: '12px',
                background: '#E3E3E8', borderRadius: '10px', border: 'none',
                fontSize: '15px', color: 'var(--text-primary)', outline: 'none',
              }}
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              width: '40px', height: '40px', borderRadius: '12px', border: 'none',
              background: '#007AFF', color: 'white', display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              flexShrink: 0, boxShadow: '0 4px 12px rgba(0,122,255,0.35)',
            }}
          >
            <UserPlus size={18} />
          </button>
        </div>
      </div>

      {/* Employee List */}
      <div style={{ marginTop: '8px' }}>
        {processedList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 16px', color: 'var(--text-secondary)' }}>
            <Search size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p style={{ margin: 0 }}>Tidak ada karyawan ditemukan</p>
          </div>
        ) : (
          <div className="mobile-list-container" style={{ margin: '0 0 16px 0' }}>
            {processedList.map((emp, index) => {
              const avatarColor = getAvatarColor(emp.name);
              const isLast = index === processedList.length - 1;

              return (
                <div
                  key={emp.id}
                  onClick={() => setSelectedActionEmployee(emp)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 16px', cursor: 'pointer',
                    borderBottom: isLast ? 'none' : '0.5px solid var(--border)',
                    background: 'white', transition: 'background 0.15s',
                  }}
                >
                  {/* Colorful Avatar */}
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                    background: avatarColor.bg, color: avatarColor.text,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '17px',
                    boxShadow: `0 4px 12px ${avatarColor.bg}55`,
                  }}>
                    {getInitials(emp.name)}
                  </div>

                  {/* Name & Phone */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {emp.name}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#8E8E93' }}>
                      +{emp.phone}
                    </p>
                  </div>

                  {/* Report Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      background: '#F2F2F7', borderRadius: '20px', padding: '4px 10px',
                    }}>
                      <FileText size={12} color="#8E8E93" />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#8E8E93' }}>{emp.reportCount}</span>
                    </div>
                    <ChevronRight size={16} color="#C7C7CC" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {isAddModalOpen && createPortal(
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'flex-end' }}>
          <div className="modal-content" style={{ background: 'var(--bg-main)', borderRadius: '24px 24px 0 0', padding: '28px 24px', margin: '0 auto', width: '100%', maxWidth: '430px' }}>
            <div style={{ width: '40px', height: '4px', background: '#E5E5EA', borderRadius: '2px', margin: '0 auto 20px auto' }} />
            <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 700, textAlign: 'center' }}>Tambah Karyawan</h2>

            <input
              type="text"
              placeholder="Ketik username (misal: andi22)..."
              value={addSearch}
              onChange={e => setAddSearch(e.target.value)}
              autoFocus
              style={{
                width: '100%', padding: '14px 16px', background: 'white',
                border: '1.5px solid #E5E5EA', borderRadius: '14px', fontSize: '16px',
                outline: 'none', boxSizing: 'border-box', marginBottom: '16px',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#007AFF'}
              onBlur={e => e.currentTarget.style.borderColor = '#E5E5EA'}
            />

            {addSearch.length >= 3 && (
              <div style={{
                background: 'white', borderRadius: '14px', padding: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '16px', border: '1px solid #E5E5EA',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: AVATAR_COLORS[addSearch.length % AVATAR_COLORS.length].bg,
                    color: AVATAR_COLORS[addSearch.length % AVATAR_COLORS.length].text,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '16px',
                  }}>
                    {addSearch.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{addSearch.charAt(0).toUpperCase() + addSearch.slice(1)}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#8E8E93' }}>@{addSearch.toLowerCase()}</p>
                  </div>
                </div>
                <button
                  onClick={handleAddEmployee}
                  style={{
                    background: '#007AFF', color: 'white', border: 'none',
                    borderRadius: '20px', padding: '8px 18px', fontWeight: 700,
                    fontSize: '14px', cursor: 'pointer',
                  }}
                >
                  Tambah
                </button>
              </div>
            )}

            <button
              onClick={() => { setIsAddModalOpen(false); setAddSearch(''); }}
              style={{
                width: '100%', padding: '16px', background: '#F2F2F7',
                color: '#8E8E93', border: 'none', borderRadius: '14px',
                fontWeight: 600, fontSize: '16px', cursor: 'pointer',
              }}
            >
              Batal
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* ACTION SHEET */}
      {selectedActionEmployee && createPortal(
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'flex-end', padding: '0 16px 16px 16px' }}>
          <div style={{ width: '100%', maxWidth: '398px', margin: '0 auto', animation: 'slideUpMobile 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>

            {/* Main Sheet */}
            <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', overflow: 'hidden', marginBottom: '10px' }}>
              {/* Profile Header */}
              <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%', marginBottom: '10px',
                  background: getAvatarColor(selectedActionEmployee.name).bg,
                  color: getAvatarColor(selectedActionEmployee.name).text,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '22px',
                  boxShadow: `0 6px 16px ${getAvatarColor(selectedActionEmployee.name).bg}55`,
                }}>
                  {getInitials(selectedActionEmployee.name)}
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{selectedActionEmployee.name}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#8E8E93' }}>+{selectedActionEmployee.phone}</p>
                <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
                  <div style={{ background: '#F2F2F7', borderRadius: '20px', padding: '4px 10px', fontSize: '12px', color: '#8E8E93', fontWeight: 600 }}>
                    {selectedActionEmployee.reportCount} Laporan
                  </div>
                </div>
              </div>

              {/* WhatsApp Action */}
              <button
                onClick={() => handleWhatsApp(selectedActionEmployee.phone)}
                style={{
                  width: '100%', padding: '18px 16px', border: 'none',
                  borderBottom: '0.5px solid rgba(0,0,0,0.08)', background: 'transparent',
                  color: '#25D366', fontSize: '17px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                }}
              >
                <MessageCircle size={22} fill="#25D366" color="#25D366" />
                Chat WhatsApp
              </button>

              {/* Delete Action */}
              <button
                onClick={handleDeleteEmployee}
                style={{
                  width: '100%', padding: '18px 16px', border: 'none',
                  background: 'transparent', color: '#FF3B30', fontSize: '17px',
                  fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                }}
              >
                <Trash2 size={20} />
                Hapus Karyawan
              </button>
            </div>

            {/* Cancel */}
            <button
              onClick={() => setSelectedActionEmployee(null)}
              style={{
                width: '100%', padding: '18px', background: 'white', borderRadius: '16px',
                border: 'none', color: '#007AFF', fontSize: '17px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Batal
            </button>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default Employees;
