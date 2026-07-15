import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function SettingsModal({ syncConfig, saveConfig, onClose }) {
  const [apiKey, setApiKey] = useState(syncConfig.apiKey);
  const [binId, setBinId] = useState(syncConfig.binId);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveConfig(apiKey, binId);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    }} className="animate-fade-in">
      <div className="glass-panel" style={{ width: '90%', maxWidth: '450px', padding: '30px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', color: 'var(--text-main)' }}>
          <X size={20} />
        </button>
        <h2 className="title" style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Cloud Sync (JSONBin)</h2>
        <p style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
          We use <strong>JSONBin.io</strong> to sync your list without any GitHub PATs. 
          Create a free account, get your Master Key, and create a new Bin. 
          Once you set it up here, your friends can simply visit the site if you hardcode these keys in the `.env` file!
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-light)' }}>JSONBin Bin ID</label>
            <input 
              type="text" 
              value={binId} 
              onChange={e => setBinId(e.target.value)}
              placeholder="e.g. 64b123...456"
              style={{
                width: '100%', padding: '10px', borderRadius: '8px',
                background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)',
                color: 'var(--text-light)', outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-light)' }}>JSONBin Master Key</label>
            <input 
              type="password" 
              value={apiKey} 
              onChange={e => setApiKey(e.target.value)}
              placeholder="$2a$10$..."
              style={{
                width: '100%', padding: '10px', borderRadius: '8px',
                background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)',
                color: 'var(--text-light)', outline: 'none'
              }}
            />
          </div>
          <button type="submit" style={{
            marginTop: '10px', padding: '12px', borderRadius: '8px',
            background: 'var(--primary)', color: '#fff', fontWeight: '600',
            boxShadow: 'var(--primary-glow)', border: 'none', cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.target.style.filter = 'brightness(1.2)'}
          onMouseLeave={e => e.target.style.filter = 'brightness(1)'}
          >Save Settings</button>
        </form>
      </div>
    </div>
  );
}
