import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FileText, Send, Upload, LogOut, Menu, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [procedures, setProcedures] = useState([]);
  const [stats, setStats] = useState(null);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [commentaires, setCommentaires] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    fetchProcedures();
    fetchStats();
  }, []);

  const fetchProcedures = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/procedures/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProcedures(res.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des procédures');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/procedures/statistics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des stats');
    }
  };

  const handleAjouter = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('description', description);
    if (file) formData.append('pdf', file);

    try {
      await axios.post(`${API_BASE}/api/procedures/`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTitre('');
      setDescription('');
      setFile(null);
      setShowForm(false);
      fetchProcedures();
      fetchStats();
    } catch (err) {
      alert('Erreur lors de l\'ajout');
    }
  };

  const handleRequestValidation = async (id) => {
    try {
      await axios.post(`${API_BASE}/api/procedures/${id}/request-validation`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchProcedures();
    } catch (err) {
      alert('Erreur');
    }
  };

  const handleValidate = async (id, approuver) => {
    try {
      await axios.post(`${API_BASE}/api/procedures/${id}/validate`, 
        { approuver, commentaires }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchProcedures();
      setShowDetails(false);
    } catch (err) {
      alert('Erreur');
    }
  };

  const handleArchive = async (id) => {
    try {
      await axios.post(`${API_BASE}/api/procedures/${id}/archive`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchProcedures();
    } catch (err) {
      alert('Erreur');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression?')) return;
    try {
      await axios.delete(`${API_BASE}/api/procedures/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchProcedures();
      fetchStats();
    } catch (err) {
      alert('Erreur');
    }
  };

  const selectedProcedure = procedures.find(p => p._id === selectedId);

  return (
    <div style={{ fontFamily: 'Segoe UI', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: '#2c3e50', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🚀 SMQ Digital Dashboard</h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span>{user?.nom}</span>
          <span style={{ background: '#27ae60', padding: '5px 10px', borderRadius: '5px', fontSize: '12px' }}>{user?.role}</span>
          <button onClick={logout} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div style={{ padding: '30px' }}>
        {/* Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <h2 style={{ color: '#27ae60' }}>{stats.totalProcedures}</h2>
              <p>Documents totaux</p>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <h2 style={{ color: '#27ae60' }}>{stats.validees}</h2>
              <p>Validées</p>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <h2 style={{ color: '#f39c12' }}>{stats.enValidation}</h2>
              <p>En validation</p>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <h2 style={{ color: '#95a5a6' }}>{stats.brouillons + stats.archivees}</h2>
              <p>Autres</p>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: showDetails ? '1fr 1fr' : '1fr', gap: '20px' }}>
          {/* Section Procédures */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={20} /> Procédures
              </h3>
              <button onClick={() => setShowForm(!showForm)} style={{ background: '#27ae60', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                <Upload size={18} />
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleAjouter} style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '10px' }}>
                <input type="text" placeholder="Titre" value={titre} onChange={(e) => setTitre(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }} />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box', minHeight: '80px' }} />
                <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ marginBottom: '10px' }} />
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Enregistrer
                </button>
              </form>
            )}

            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {procedures.map(p => (
                <div key={p._id} onClick={() => { setSelectedId(p._id); setShowDetails(true); }} style={{
                  padding: '12px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  background: selectedId === p._id ? '#f0f8ff' : 'white',
                  borderRadius: '5px',
                  marginBottom: '5px',
                  transition: 'background 0.2s'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{p.titre}</strong>
                      <br />
                      <span style={{ fontSize: '12px', color: '#7f8c8d' }}>v{p.version} • {p.statut}</span>
                    </div>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      background: p.statut === 'Validé' ? '#d4edda' : p.statut === 'En validation' ? '#fff3cd' : '#e2e3e5',
                      color: p.statut === 'Validé' ? '#155724' : p.statut === 'En validation' ? '#856404' : '#383d41'
                    }}>
                      {p.statut}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Détails */}
          {showDetails && selectedProcedure && (
            <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <h3>{selectedProcedure.titre}</h3>
              <p style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '10px' }}>
                Version: {selectedProcedure.version} | Statut: {selectedProcedure.statut}
              </p>
              <p>{selectedProcedure.description}</p>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {selectedProcedure.statut === 'Brouillon' && selectedProcedure.auteur._id === user?.id && (
                  <>
                    <button onClick={() => handleRequestValidation(selectedProcedure._id)} style={{ padding: '8px 15px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                      Demander validation
                    </button>
                    <button onClick={() => handleDelete(selectedProcedure._id)} style={{ padding: '8px 15px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                      Supprimer
                    </button>
                  </>
                )}

                {selectedProcedure.statut === 'En validation' && (user?.role === 'admin' || user?.role === 'validateur') && (
                  <>
                    <input
                      type="text"
                      placeholder="Commentaires"
                      value={commentaires}
                      onChange={(e) => setCommentaires(e.target.value)}
                      style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                    <button onClick={() => handleValidate(selectedProcedure._id, true)} style={{ padding: '8px 15px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                      ✓ Valider
                    </button>
                    <button onClick={() => handleValidate(selectedProcedure._id, false)} style={{ padding: '8px 15px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                      ✗ Rejeter
                    </button>
                  </>
                )}

                {selectedProcedure.statut === 'Validé' && (user?.role === 'admin' || user?.role === 'validateur') && (
                  <button onClick={() => handleArchive(selectedProcedure._id)} style={{ padding: '8px 15px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Archiver
                  </button>
                )}
              </div>

              {selectedProcedure.commentairesValidation && (
                <div style={{ marginTop: '15px', padding: '10px', background: '#fffbea', borderLeft: '4px solid #f39c12' }}>
                  <strong>Commentaires:</strong> {selectedProcedure.commentairesValidation}
                </div>
              )}

              <button onClick={() => setShowDetails(false)} style={{ marginTop: '15px', width: '100%', padding: '10px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
