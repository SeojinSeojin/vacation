import React, { useState } from 'react';
import { Trash2, Plus, CheckCircle, Circle, Edit2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function TodoList({ todos, saveTodos, setHoveredDate, selectedDate }) {
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');

  const filteredTodos = selectedDate 
    ? todos.filter(t => t.date === selectedDate)
    : todos;

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    // 1. Completed items go to the bottom
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;

    // 2. Unscheduled items go to the bottom
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1; // Unscheduled at the bottom
    if (!b.date) return -1;
    
    // 3. Otherwise sort by date
    return new Date(a.date) - new Date(b.date);
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newTodo = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      date: newDate || '', // empty string if no date selected
      completed: false
    };
    saveTodos([...todos, newTodo]);
    setNewTitle('');
    setNewDate('');
  };

  const handleToggle = (id) => {
    saveTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id) => {
    saveTodos(todos.filter(t => t.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDate(todo.date);
  };

  const saveEdit = (id) => {
    if (!editTitle.trim()) return;
    saveTodos(todos.map(t => t.id === id ? { ...t, title: editTitle.trim(), date: editDate || '' } : t));
    setEditingId(null);
  };

  return (
    <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '500px', overflow: 'hidden' }}>
      <h2 className="title text-gradient" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Bucket List</h2>
      
      {selectedDate && (
        <div style={{ marginBottom: '15px', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: '500' }}>
          Filtering by: {format(parseISO(selectedDate), 'MMM do, yyyy')}
        </div>
      )}

      <form onSubmit={handleAdd} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          value={newTitle} 
          onChange={e => setNewTitle(e.target.value)} 
          placeholder="What do you want to do?"
          style={{ flex: '1 1 200px', padding: '15px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', color: 'var(--text-light)', fontSize: '1rem' }}
        />
        <input 
          type="date" 
          value={newDate} 
          onChange={e => setNewDate(e.target.value)}
          style={{ flex: '1 1 140px', padding: '15px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', color: 'var(--text-light)', fontSize: '1rem' }}
        />
        <button type="submit" style={{ 
          flex: '0 0 auto',
          background: 'var(--primary)', color: '#fff', padding: '0 25px', borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--primary-glow)',
          transition: 'all 0.2s', cursor: 'pointer'
        }}
        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.2)'}
        onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
        >
          <Plus size={24} />
        </button>
      </form>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', paddingRight: '10px' }}>
        {sortedTodos.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-main)', marginTop: '40px', fontSize: '1.1rem' }}>
            No items found. Time to dream big! ✨
          </div>
        ) : null}

        {sortedTodos.map(todo => (
          <div 
            key={todo.id}
            draggable={!todo.date}
            onDragStart={(e) => {
              if (!todo.date) e.dataTransfer.setData('todoId', todo.id);
            }}
            onMouseEnter={() => todo.date && setHoveredDate(todo.date)}
            onMouseLeave={() => setHoveredDate(null)}
            className="animate-fade-in"
            style={{ 
              display: 'flex', alignItems: 'center', padding: '20px', 
              background: 'rgba(255,255,255,0.03)', borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease',
              opacity: todo.completed ? 0.6 : 1,
              transform: 'translateY(0)',
              cursor: !todo.date ? 'grab' : 'default'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <button onClick={() => handleToggle(todo.id)} style={{ color: todo.completed ? 'var(--success)' : 'var(--text-main)', marginRight: '20px' }}>
              {todo.completed ? <CheckCircle size={28} /> : <Circle size={28} />}
            </button>
            
            {editingId === todo.id ? (
              <div style={{ flex: 1, display: 'flex', gap: '10px' }}>
                <input 
                  type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--primary)', color: '#fff' }}
                />
                <input 
                  type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
                  style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--primary)', color: '#fff' }}
                />
                <button onClick={() => saveEdit(todo.id)} style={{ color: 'var(--success)', padding: '10px' }}><CheckCircle size={24}/></button>
              </div>
            ) : (
              <div style={{ flex: 1 }}>
                <div style={{ color: todo.completed ? 'var(--text-main)' : 'var(--text-light)', fontSize: '1.2rem', fontWeight: '500', textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {todo.title}
                </div>
                <div style={{ color: 'var(--accent)', fontSize: '0.9rem', marginTop: '6px', fontWeight: '400' }}>
                  {todo.date ? format(parseISO(todo.date), 'MMMM do, yyyy') : 'Someday ✨'}
                </div>
              </div>
            )}
            
            {editingId !== todo.id && (
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => startEdit(todo)} style={{ color: 'var(--text-main)', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--accent)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-main)'}>
                  <Edit2 size={20} />
                </button>
                <button onClick={() => handleDelete(todo.id)} style={{ color: 'var(--text-main)', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='var(--danger)'} onMouseOut={e=>e.currentTarget.style.color='var(--text-main)'}>
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
