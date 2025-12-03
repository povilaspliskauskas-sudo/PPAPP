'use client';

import { useEffect, useMemo, useState } from 'react';

type Child = { id: number; name: string; age: number };
type AgendaItem = { id: number; childId: number; date: string; title: string; done: boolean };
type EmotionEntry = { id: number; childId: number; date: string; emotion: string; notes?: string | null };

export default function Home() {
  const [tab, setTab] = useState<'agenda' | 'emotions'>('agenda');
  const [children, setChildren] = useState<Child[]>([]);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [emotions, setEmotions] = useState<EmotionEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const emotionsList = useMemo(() => ['happy','calm','excited','tired','sad','angry'], []);

  async function refreshAll() {
    setLoading(true);
    try {
      const [c, a, e] = await Promise.all([
        fetch('/api/children').then(r => r.json()),
        fetch('/api/agenda').then(r => r.json()),
        fetch('/api/emotions').then(r => r.json()),
      ]);
      setChildren(c);
      setAgenda(a);
      setEmotions(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refreshAll(); }, []);

  async function addAgenda(childId: number) {
    const title = prompt('Agenda title (e.g., Brush teeth, Breakfast):') || '';
    if (!title) return;
    await fetch('/api/agenda', {
      method: 'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify({ childId, date: new Date().toISOString(), title }),
    });
    refreshAll();
  }

  async function addEmotion(childId: number, emotion: string) {
    await fetch('/api/emotions', {
      method: 'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify({ childId, date: new Date().toISOString(), emotion }),
    });
    refreshAll();
  }

  return (
    <>
      <div className="tabs">
        <button className={`tab ${tab==='agenda'?'active':''}`} onClick={() => setTab('agenda')}>Agenda</button>
        <button className={`tab ${tab==='emotions'?'active':''}`} onClick={() => setTab('emotions')}>Emotions</button>
        <button className="tab" onClick={refreshAll} disabled={loading}>{loading?'Loading…':'Refresh'}</button>
        <a className="tab" href="/api/diag" target="_blank" rel="noreferrer">/api/diag</a>
      </div>

      {tab === 'agenda' && (
        <section>
          <h3>Today’s Agenda</h3>
          {children.map(ch => (
            <div className="card" key={ch.id}>
              <div className="row" style={{justifyContent:'space-between'}}>
                <strong>{ch.name} • {ch.age}y</strong>
                <button onClick={() => addAgenda(ch.id)}>+ Add item</button>
              </div>
              <div style={{marginTop:8}}>
                {agenda.filter(a => a.childId === ch.id).map(a => (
                  <div key={a.id} className="row" style={{justifyContent:'space-between'}}>
                    <span>{new Date(a.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} – {a.title}</span>
                    <span style={{opacity:0.6}}>{a.done ? '✅' : '⬜️'}</span>
                  </div>
                ))}
                {agenda.filter(a => a.childId === ch.id).length === 0 && (
                  <div style={{opacity:0.6}}>No items yet.</div>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {tab === 'emotions' && (
        <section>
          <h3>Quick Emotions</h3>
          {children.map(ch => (
            <div className="card" key={ch.id}>
              <div className="row" style={{justifyContent:'space-between'}}>
                <strong>{ch.name} • {ch.age}y</strong>
                <div className="row">
                  {emotionsList.map(e => (
                    <button key={e} onClick={() => addEmotion(ch.id, e)}>{e}</button>
                  ))}
                </div>
              </div>
              <div style={{marginTop:8}}>
                {emotions.filter(x => x.childId === ch.id).slice(0,5).map(e => (
                  <div key={e.id} className="row" style={{justifyContent:'space-between'}}>
                    <span>{new Date(e.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    <strong>{e.emotion}</strong>
                  </div>
                ))}
                {emotions.filter(x => x.childId === ch.id).length === 0 && (
                  <div style={{opacity:0.6}}>No entries yet.</div>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
