import { useState, useEffect, useCallback } from 'react';

const defaultTodos = [];

export function useCloudSync() {
  const [todos, setTodos] = useState(defaultTodos);
  const [status, setStatus] = useState('idle'); // idle, loading, saving, error
  
  // Read from localStorage OR fallback to environment variables (for sharing without keys)
  const [syncConfig, setSyncConfig] = useState({
    apiKey: localStorage.getItem('bucket_list_apiKey') || import.meta.env.VITE_JSONBIN_KEY || '',
    binId: localStorage.getItem('bucket_list_binId') || import.meta.env.VITE_JSONBIN_ID || ''
  });

  const saveConfig = (apiKey, binId) => {
    localStorage.setItem('bucket_list_apiKey', apiKey);
    localStorage.setItem('bucket_list_binId', binId);
    setSyncConfig({ apiKey, binId });
  };

  const fetchTodos = useCallback(async () => {
    const binId = syncConfig.binId?.trim();
    const apiKey = syncConfig.apiKey?.trim();
    
    if (!binId || !apiKey) return;
    setStatus('loading');
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
        headers: {
          'X-Master-Key': apiKey
        }
      });
      if (!response.ok) throw new Error('Failed to fetch from JSONBin');
      
      const data = await response.json();
      if (data.record && data.record.todos) {
        setTodos(data.record.todos);
      }
      setStatus('idle');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }, [syncConfig]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const saveTodos = async (newTodos) => {
    setTodos(newTodos); // Optimistic update
    
    const binId = syncConfig.binId?.trim();
    const apiKey = syncConfig.apiKey?.trim();
    
    if (!apiKey || !binId) return;
    
    setStatus('saving');
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': apiKey
        },
        body: JSON.stringify({ todos: newTodos })
      });
      
      if (!response.ok) throw new Error('Failed to save to JSONBin');
      setStatus('idle');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return { todos, saveTodos, status, syncConfig, saveConfig, fetchTodos };
}
