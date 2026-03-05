import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

export default function Auth() {
  const { login, register } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nom: '', email: '', motDePasse: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.motDePasse);
        // Redirection automatique via AuthContext
      } else {
        await register(formData.nom, formData.email, formData.motDePasse);
        // Redirection automatique via AuthContext
      }
      // Réinitialiser le formulaire après succès
      setFormData({ nom: '', email: '', motDePasse: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erreur';
      setError(errorMsg);
      console.error('Auth error:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f7f6',
      fontFamily: 'Segoe UI'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          {isLogin ? <LogIn size={30} /> : <UserPlus size={30} />}
          {isLogin ? 'Connexion' : 'Inscription'}
        </h1>


        {error && <div style={{ background: '#fee', padding: '10px', color: '#c33', marginBottom: '15px', borderRadius: '5px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="nom"
              placeholder="Nom complet"
              value={formData.nom}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
          />

          <input
            type="password"
            name="motDePasse"
            placeholder="Mot de passe"
            value={formData.motDePasse}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          {isLogin ? "Pas encore inscrit? " : "Déjà inscrit? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: '#27ae60',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '16px'
            }}
          >
            {isLogin ? "S'inscrire" : "Se connecter"}
          </button>
        </p>
      </div>
    </div>
  );
}
