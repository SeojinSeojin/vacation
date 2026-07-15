import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay } from 'date-fns';

export default function Calendar({ todos, hoveredDate, selectedDate, setSelectedDate, assignDateToTodo }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dragHoveredDate, setDragHoveredDate] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  const dateFormat = "MMMM yyyy";
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // padding for first day of month
  const startDay = getDay(monthStart);
  const paddingDays = Array(startDay).fill(null);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const hasTodo = (date) => {
    const formatted = format(date, 'yyyy-MM-dd');
    return todos.some(t => t.date === formatted);
  };

  const isHovered = (date) => {
    if (!hoveredDate) return false;
    return format(date, 'yyyy-MM-dd') === hoveredDate;
  };

  const isSelected = (date) => {
    if (!selectedDate) return false;
    return format(date, 'yyyy-MM-dd') === selectedDate;
  };

  const handleDateClick = (date) => {
    const formatted = format(date, 'yyyy-MM-dd');
    if (selectedDate === formatted) {
      setSelectedDate(null);
    } else {
      setSelectedDate(formatted);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 className="title" style={{ fontSize: '1.8rem', color: 'var(--text-light)' }}>
          {format(currentDate, dateFormat)}
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={prevMonth} style={{ color: 'var(--text-light)', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextMonth} style={{ color: 'var(--text-light)', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginBottom: '15px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ textAlign: 'center', color: 'var(--text-main)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
        {paddingDays.map((_, i) => <div key={`pad-${i}`} />)}
        {daysInMonth.map((day, i) => {
          const hovered = isHovered(day);
          const selected = isSelected(day);
          const active = hasTodo(day);

          return (
            <div 
              key={i} 
              onClick={() => handleDateClick(day)}
              onDragOver={(e) => {
                e.preventDefault();
                setDragHoveredDate(format(day, 'yyyy-MM-dd'));
              }}
              onDragLeave={() => setDragHoveredDate(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragHoveredDate(null);
                const todoId = e.dataTransfer.getData('todoId');
                if (todoId) {
                  assignDateToTodo(todoId, format(day, 'yyyy-MM-dd'));
                }
              }}
              style={{
                aspectRatio: '1',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                borderRadius: '14px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: (dragHoveredDate === format(day, 'yyyy-MM-dd') || selected) ? 'rgba(0, 240, 255, 0.15)' : (hovered ? 'rgba(123, 97, 255, 0.4)' : 'rgba(255,255,255,0.03)'),
                border: (dragHoveredDate === format(day, 'yyyy-MM-dd') || selected) ? '1px solid var(--accent)' : (hovered ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)'),
                boxShadow: (dragHoveredDate === format(day, 'yyyy-MM-dd') || hovered) ? 'var(--primary-glow)' : (selected ? 'var(--accent-glow)' : 'none'),
                transform: (dragHoveredDate === format(day, 'yyyy-MM-dd') || hovered) ? 'scale(1.1) translateY(-2px)' : (selected ? 'scale(1.05)' : 'scale(1)'),
                color: selected || hovered || active || dragHoveredDate === format(day, 'yyyy-MM-dd') ? 'var(--text-light)' : 'var(--text-main)',
                position: 'relative',
                zIndex: hovered || dragHoveredDate === format(day, 'yyyy-MM-dd') ? 10 : 1
              }}
              onMouseOver={e => {
                if(!hovered && !selected) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseOut={e => {
                if(!hovered && !selected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <span style={{ fontSize: '1.2rem', fontWeight: active || hovered || selected ? '600' : '400' }}>
                {format(day, 'd')}
              </span>
              {active && (
                <div style={{
                  position: 'absolute', bottom: '8px', width: '6px', height: '6px', 
                  borderRadius: '50%', background: hovered ? '#fff' : 'var(--accent)',
                  boxShadow: hovered ? '0 0 10px #fff' : 'var(--accent-glow)',
                  transition: 'all 0.3s ease'
                }} />
              )}
            </div>
          );
        })}
      </div>
      
      {selectedDate && (
        <div className="animate-fade-in" style={{ marginTop: 'auto', paddingTop: '30px', display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={() => setSelectedDate(null)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              padding: '12px 24px', borderRadius: '30px', 
              background: 'rgba(255,255,255,0.1)', color: 'var(--text-light)',
              transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.1)'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <X size={18} /> Clear Date Filter
          </button>
        </div>
      )}
    </div>
  );
}
