import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Send, Database, FileText, Upload } from 'lucide-react';

function App() {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [procedures, setProcedures] = useState([]);
  const [titre, setTitre] = useState('');
  const [file, setFile] = useState(null); // État pour le fichier
  const [question, setQuestion] = useState('');
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => { fetchProcedures(); }, []);

  const fetchProcedures = async () => {
    try {
      const res = await axios.get(`${API_BASE}/procedures`);
      setProcedures(res.data);
    } catch (err) { console.error("Erreur de connexion au serveur"); }
  };

  const ajouterProcedure = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('pdf', file);

    await axios.post(`${API_BASE}/procedures`, formData);
    setTitre('');
    setFile(null);
    fetchProcedures();
  };

  const updateStatut = async (id, statut) => {
    await axios.put(`${API_BASE}/procedures/${id}`, { statut });
    fetchProcedures();
  };

  const supprimerProcedure = async (id) => {
    await axios.delete(`${API_BASE}/procedures/${id}`);
    fetchProcedures();
  };

  const poserQuestion = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${API_BASE}/chat`, { message: question });
    setChatLog([...chatLog, { role: 'user', text: question }, { role: 'ia', text: res.data.reply }]);
    setQuestion('');
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Segoe UI', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <h1 style={{ color: '#2c3e50' }}>🚀 SMQ Digital Dashboard</h1>
      
      {/* DASHBOARD AVEC STATISTIQUES */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flex: 1, textAlign: 'center' }}>
          <h2>{procedures.length}</h2>
          <p>Documents totaux</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flex: 1, textAlign: 'center' }}>
          <h2>{procedures.filter(p => p.statut === 'Validé').length}</h2>
          <p>Documents validés</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flex: 1, textAlign: 'center' }}>
          <h2>{procedures.filter(p => p.statut === 'Brouillon').length}</h2>
          <p>Documents en brouillon</p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* SECTION 1 : GESTION DOCUMENTAIRE */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3><Upload size={20} /> Ajouter une Procédure</h3>
          <form onSubmit={ajouterProcedure} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Titre de la procédure" value={titre} onChange={(e) => setTitre(e.target.value)} style={{ padding: '10px' }} required />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ padding: '5px' }} required />
            <button type="submit" style={{ padding: '10px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Enregistrer le document</button>
          </form>

          <h3 style={{ marginTop: '30px' }}><FileText size={20} /> Documents en ligne</h3>
          {procedures.map(p => (
            <div key={p._id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span>{p.titre}</span>
                <br />
                <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Statut: {p.statut}</span>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                {p.statut === 'Brouillon' && (
                  <button onClick={() => updateStatut(p._id, 'Validé')} style={{ padding: '5px 10px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Valider</button>
                )}
                {p.statut === 'Validé' && (
                  <button onClick={() => updateStatut(p._id, 'Archivé')} style={{ padding: '5px 10px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Archiver</button>
                )}
                <button onClick={() => supprimerProcedure(p._id)} style={{ padding: '5px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION 2 : CHATBOT IA */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3><MessageSquare size={20} /> Assistant IA Qualité</h3>
          <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #f0f0f0', padding: '10px', marginBottom: '10px', borderRadius: '10px' }}>
            {chatLog.map((m, i) => (
              <div key={i} style={{ marginBottom: '10px', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                <div style={{ display: 'inline-block', padding: '10px', borderRadius: '10px', backgroundColor: m.role === 'user' ? '#3498db' : '#ecf0f1', color: m.role === 'user' ? 'white' : 'black' }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={poserQuestion} style={{ display: 'flex', gap: '5px' }}>
            <input style={{ flex: 1, padding: '10px' }} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Posez une question..." />
            <button type="submit" style={{ padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px' }}>Envoyer</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default App;