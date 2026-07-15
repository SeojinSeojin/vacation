import React, { useState } from 'react';
import { Settings, CloudOff, Cloud, RefreshCw } from 'lucide-react';
import TodoList from './components/TodoList';
import Calendar from './components/Calendar';
import SettingsModal from './components/SettingsModal';
import { useCloudSync } from './hooks/useCloudSync';

export default function App() {
  const { todos, saveTodos, status, syncConfig, saveConfig, fetchTodos } = useCloudSync();
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSettings, setShowSettings] = useState(!syncConfig.binId);

  const assignDateToTodo = (todoId, newDate) => {
    const updatedTodos = todos.map(t => t.id === todoId ? { ...t, date: newDate } : t);
    saveTodos(updatedTodos);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <header style={{ width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className="title text-gradient" style={{ fontSize: '1.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Vacation Sync</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', padding: '8px 15px', borderRadius: '20px' }}>
            {status === 'loading' && <><RefreshCw size={16} className="animate-spin" /> Syncing...</>}
            {status === 'saving' && <><RefreshCw size={16} className="animate-spin" /> Saving...</>}
            {status === 'idle' && (syncConfig.binId ? <><Cloud size={16} color="var(--success)" /> Synced</> : <><CloudOff size={16} /> Local Mode</>)}
            {status === 'error' && <><CloudOff size={16} color="var(--danger)" /> Sync Error</>}
          </div>
          
          <button 
            onClick={() => fetchTodos()}
            style={{ color: 'var(--text-light)', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            title="Refresh Data"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <RefreshCw size={20} />
          </button>
          
          <button 
            onClick={() => setShowSettings(true)}
            style={{ color: 'var(--text-light)', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            title="Settings"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main style={{
        width: '100%', maxWidth: '1200px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px',
        height: 'calc(100vh - 150px)', minHeight: '600px'
      }}>
        <TodoList 
          todos={todos} 
          saveTodos={saveTodos} 
          setHoveredDate={setHoveredDate} 
          selectedDate={selectedDate}
        />
        <Calendar 
          todos={todos} 
          hoveredDate={hoveredDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          assignDateToTodo={assignDateToTodo}
        />
      </main>

      {showSettings && (
        <SettingsModal 
          syncConfig={syncConfig} 
          saveConfig={saveConfig} 
          onClose={() => setShowSettings(false)} 
        />
      )}
    </div>
  );
}
