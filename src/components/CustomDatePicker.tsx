import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomDatePickerProps {
  activeDate: string;
  setActiveDate: (date: string) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ activeDate, setActiveDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // By default, open to April 2026 since mock data is there, or current date if empty
  const initialDate = activeDate ? new Date(activeDate) : new Date('2026-04-08');
  const [currentMonth, setCurrentMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));

  // Sync internal month view if activeDate changes from outside
  useEffect(() => {
    if (activeDate) {
      const d = new Date(activeDate);
      setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }, [activeDate]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const handleSelect = (day: number) => {
    const y = year;
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    setActiveDate(`${y}-${m}-${d}`);
    setIsOpen(false);
  };

  const isSelected = (day: number) => {
    if (!activeDate) return false;
    const y = year;
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return activeDate === `${y}-${m}-${d}`;
  };

  const isToday = (day: number) => {
     // Hardcode today as 2026-04-08 for the demo, or use real today:
     const today = new Date('2026-04-08'); 
     return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  // Format display text
  let btnText = 'Semua Tanggal';
  if (activeDate) {
     const ad = new Date(activeDate);
     btnText = `${ad.getDate()} ${monthNames[ad.getMonth()]} ${ad.getFullYear()}`;
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
          background: activeDate ? '#E0F2FE' : '#FFFFFF', 
          color: activeDate ? '#007AFF' : '#1C1C1E', 
          border: activeDate ? '1px solid #BAE6FD' : '1px solid #E5E5EA', 
          padding: '10px 16px', borderRadius: '12px', fontWeight: 600, fontSize: '15px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer', flex: 1,
          transition: 'all 0.2s'
        }}
      >
        <Calendar size={18} color={activeDate ? '#007AFF' : '#8E8E93'} /> 
        {btnText}
      </button>

      {isOpen && createPortal(
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 99999 }}>
          <div className="modal-content" style={{ background: 'var(--bg-main)', borderRadius: '24px 24px 0 0', padding: '24px', animation: 'slideUpMobile 0.3s cubic-bezier(0.16, 1, 0.3, 1)', margin: '0 auto' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button 
                onClick={prevMonth}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#E5E5EA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}
              >
                <ChevronLeft size={20} />
              </button>
              
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{monthNames[month]} {year}</h3>
              
              <button 
                onClick={nextMonth}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#E5E5EA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Calendar Grid Container */}
            <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
               {/* Day Headers */}
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '12px' }}>
                 {dayNames.map(dn => (
                   <div key={dn} style={{ textAlign: 'center', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                     {dn}
                   </div>
                 ))}
               </div>

               {/* Days */}
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', rowGap: '8px' }}>
                 {days.map((day, idx) => {
                   if (!day) return <div key={`empty-${idx}`} />;
                   
                   const selected = isSelected(day);
                   const today = isToday(day);

                   return (
                     <button
                       key={day}
                       onClick={() => handleSelect(day)}
                       style={{
                         aspectRatio: '1',
                         borderRadius: '50%',
                         border: 'none',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontSize: '15px', fontWeight: selected ? 600 : 500,
                         cursor: 'pointer',
                         background: selected ? 'var(--primary)' : today ? 'var(--bg-input)' : 'transparent',
                         color: selected ? 'white' : today ? 'var(--primary)' : 'var(--text-primary)',
                         transition: 'all 0.1s'
                       }}
                     >
                       {day}
                     </button>
                   );
                 })}
               </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
               <button 
                 onClick={() => { setActiveDate(''); setIsOpen(false); }} 
                 style={{ flex: 1, padding: '16px', background: 'transparent', color: '#FF3B30', border: 'none', fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}>
                 Hapus Filter
               </button>
               <button 
                 onClick={() => setIsOpen(false)} 
                 style={{ flex: 1, padding: '16px', background: '#007AFF', color: 'white', borderRadius: '14px', border: 'none', fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}>
                 Selesai
               </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default CustomDatePicker;
