import React, { useState } from 'react';
import { User, Target, Leaf, Heart, Trash2, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'goals', label: 'Nutrition Goals', icon: Target },
  { id: 'dietary', label: 'Dietary Restrictions', icon: Leaf },
  { id: 'preferences', label: 'Food Preferences', icon: Heart },
  { id: 'support', label: 'Support', icon: MessageSquare },
  { id: 'danger', label: 'Account', icon: Trash2 },
];

export default function ProfilePage() {
  const { user, updateUser, updateGoals, updateDietary, deleteAccount } = useAuth();
  const [section, setSection] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [localGoals, setLocalGoals] = useState(user?.goals || {});
  const [localName, setLocalName] = useState(user?.name || '');
  const [localEmail, setLocalEmail] = useState(user?.email || '');
  const [localPhone, setLocalPhone] = useState(user?.phone || '');

  const save = () => {
    updateUser({ name: localName, email: localEmail, phone: localPhone });
    updateGoals(localGoals);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Account Settings</h1>
      <div className="profile-layout">
        <div className="card" style={{ alignSelf: 'start' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
              <User size={28} color="var(--accent)" />
            </div>
            <div style={{ fontWeight: 700 }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>
          <div className="profile-nav">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <div key={id} className={`profile-nav-item${section === id ? ' active' : ''}`}
                onClick={() => setSection(id)}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={16} />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          {section === 'profile' && (
            <div>
              <h2 style={{ marginBottom: 20 }}>Personal Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="input" value={localName} onChange={e => setLocalName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="input" type="email" value={localEmail} onChange={e => setLocalEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input className="input" type="tel" value={localPhone} placeholder="+1 (555) 000-0000" onChange={e => setLocalPhone(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={save} style={{ alignSelf: 'flex-start' }}>
                  {saved ? '✓ Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {section === 'goals' && (
            <div>
              <h2 style={{ marginBottom: 8 }}>Nutrition Goals</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                Set your daily macronutrient targets. These are used to track your progress in the Nutrition tab.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { key: 'calories', label: 'Daily Calories', unit: 'kcal', min: 1200, max: 4000 },
                  { key: 'protein', label: 'Protein', unit: 'g', min: 30, max: 300 },
                  { key: 'carbs', label: 'Carbohydrates', unit: 'g', min: 50, max: 500 },
                  { key: 'fat', label: 'Fat', unit: 'g', min: 20, max: 200 },
                  { key: 'fiber', label: 'Fiber', unit: 'g', min: 10, max: 60 },
                ].map(({ key, label, unit, min, max }) => (
                  <div key={key} className="form-group">
                    <label>{label} ({unit})</label>
                    <input type="number" className="input" min={min} max={max}
                      value={localGoals[key] || ''} onChange={e => setLocalGoals(g => ({ ...g, [key]: Number(e.target.value) }))} />
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={save}>
                {saved ? '✓ Saved!' : 'Save Goals'}
              </button>
            </div>
          )}

          {section === 'dietary' && (
            <div>
              <h2 style={{ marginBottom: 8 }}>Dietary Restrictions</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                Your preferences filter the Shop and Meal Planner to show suitable options.
              </p>
              {[
                { key: 'vegetarian', label: 'Vegetarian', desc: 'No meat or fish' },
                { key: 'vegan', label: 'Vegan', desc: 'No animal products' },
                { key: 'glutenFree', label: 'Gluten-Free', desc: 'For celiac disease or gluten sensitivity' },
                { key: 'dairyFree', label: 'Dairy-Free', desc: 'No dairy products' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="toggle-row">
                  <div>
                    <div style={{ fontWeight: 500 }}>{label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={user?.dietary?.[key] || false}
                      onChange={e => updateDietary({ [key]: e.target.checked })} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
              <div className="form-group" style={{ marginTop: 20 }}>
                <label>Allergies (comma-separated)</label>
                <input className="input" placeholder="e.g. peanuts, shellfish, tree nuts"
                  value={(user?.dietary?.allergies || []).join(', ')}
                  onChange={e => updateDietary({ allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              </div>
            </div>
          )}

          {section === 'preferences' && (
            <div>
              <h2 style={{ marginBottom: 20 }}>Food Preferences</h2>
              <div className="form-group">
                <label>Favorite Cuisines</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {['Mediterranean', 'Asian', 'Mexican', 'Italian', 'American', 'Indian', 'Middle Eastern'].map(cuisine => {
                    const selected = (user?.preferences?.cuisine || []).includes(cuisine);
                    return (
                      <button key={cuisine}
                        className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => {
                          const curr = user?.preferences?.cuisine || [];
                          updateUser({ preferences: { ...user?.preferences, cuisine: selected ? curr.filter(c => c !== cuisine) : [...curr, cuisine] } });
                        }}>
                        {cuisine}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {section === 'support' && (
            <div>
              <h2 style={{ marginBottom: 20 }}>Contact Support</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label>Subject</label>
                  <select className="select">
                    <option>Order Issue</option>
                    <option>Payment Problem</option>
                    <option>Account Help</option>
                    <option>Nutrition Question</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea className="textarea" rows={5} placeholder="Describe your issue..." style={{ resize: 'vertical' }} />
                </div>
                <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Send Message</button>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Or email us: <a href="mailto:support@nutrimeal.app" style={{ color: 'var(--accent2)' }}>support@nutrimeal.app</a>
                </div>
              </div>
            </div>
          )}

          {section === 'danger' && (
            <div>
              <h2 style={{ marginBottom: 8 }}>Account Management</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
                Danger zone — these actions cannot be undone.
              </p>
              <div style={{ padding: 20, border: '1px solid rgba(248,113,113,0.3)', borderRadius: 10, background: 'rgba(248,113,113,0.05)' }}>
                <h3 style={{ color: 'var(--danger)', marginBottom: 8 }}>Delete Account</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>
                  This will permanently delete your account, order history, and all personal data.
                </p>
                {!confirmDelete ? (
                  <button className="btn btn-danger" onClick={() => setConfirmDelete(true)}>
                    <Trash2 size={14} /> Delete My Account
                  </button>
                ) : (
                  <div>
                    <p style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: 12 }}>
                      Are you absolutely sure? This cannot be undone.
                    </p>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button className="btn btn-danger" onClick={deleteAccount}>Yes, Delete Everything</button>
                      <button className="btn btn-secondary" onClick={() => setConfirmDelete(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
