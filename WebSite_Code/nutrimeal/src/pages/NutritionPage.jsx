import React, { useState } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import { BookOpen, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { calculateDailyNutrition, searchPubMed } from '../services/api';

const MACRO_COLORS = {
  calories: '#4ade80',
  protein: '#38bdf8',
  carbs: '#fb923c',
  fat: '#c084fc',
  fiber: '#fbbf24',
};

export default function NutritionPage() {
  const { state } = useApp();
  const { user } = useAuth();
  const [pubmedQuery, setPubmedQuery] = useState('');
  const [pubmedResults, setPubmedResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const totals = calculateDailyNutrition(state.cart);
  const goals = user?.goals || { calories: 2000, protein: 150, carbs: 200, fat: 65, fiber: 30 };

  const macros = [
    { key: 'calories', label: 'Calories', unit: 'kcal' },
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'carbs', label: 'Carbs', unit: 'g' },
    { key: 'fat', label: 'Fat', unit: 'g' },
    { key: 'fiber', label: 'Fiber', unit: 'g' },
  ];

  const handlePubMed = async () => {
    if (!pubmedQuery.trim()) return;
    setSearching(true);
    const results = await searchPubMed(pubmedQuery);
    setPubmedResults(results);
    setSearching(false);
  };

  return (
    <div>
      <h1 style={{ marginBottom: 8 }}>Nutrition Tracker</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
        Based on items currently in your cart
      </p>

      {/* Macro Grid */}
      <div className="nutrition-grid">
        {macros.map(({ key, label, unit }) => {
          const current = totals[key] || 0;
          const goal = goals[key] || 1;
          const pct = Math.min((current / goal) * 100, 100);
          return (
            <div key={key} className="card macro-card">
              <div className="macro-value" style={{ color: MACRO_COLORS[key] }}>
                {Math.round(current)}
              </div>
              <div className="macro-label">{label}</div>
              <div className="macro-target">of {goal}{unit} goal</div>
              <div className="progress-bar" style={{ marginTop: 12 }}>
                <div className="progress-fill" style={{ width: `${pct}%`, background: MACRO_COLORS[key] }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{Math.round(pct)}%</div>
            </div>
          );
        })}
      </div>

      {/* Status Message */}
      <div className="card" style={{ marginBottom: 24 }}>
        {state.cart.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>
            Add items to your cart to see nutritional breakdown here.
          </p>
        ) : (
          <div>
            <h3 style={{ marginBottom: 8 }}>📊 Daily Summary</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              Your current cart provides {Math.round(totals.calories)} calories — {' '}
              {totals.calories < goals.calories
                ? `${Math.round(goals.calories - totals.calories)} calories under your goal. Consider adding more foods!`
                : totals.calories > goals.calories
                ? `${Math.round(totals.calories - goals.calories)} calories over your daily goal.`
                : 'Right on target! 🎯'}
            </p>
            {totals.protein >= goals.protein * 0.9 && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--accent-dim)', borderRadius: 8, fontSize: 14 }}>
                🏆 Great job meeting your protein goal! Protein supports muscle maintenance and satiety.
              </div>
            )}
          </div>
        )}
      </div>

      {/* PubMed Research */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <BookOpen size={20} color="var(--accent2)" />
          <h2>Nutrition Research (PubMed)</h2>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          Search peer-reviewed research on nutrition, dietary needs, and food science.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            className="input"
            placeholder="e.g. omega-3 benefits, celiac diet, protein absorption"
            value={pubmedQuery}
            onChange={e => setPubmedQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePubMed()}
          />
          <button className="btn btn-primary" onClick={handlePubMed} disabled={searching}>
            <Search size={16} />
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {pubmedResults.length > 0 && (
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pubmedResults.map(article => (
              <div key={article.id} style={{ padding: 14, background: 'var(--bg-hover)', borderRadius: 8 }}>
                <a href={article.url} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--accent2)', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                  {article.title}
                </a>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {article.authors} — {article.journal} ({article.year})
                </div>
              </div>
            ))}
          </div>
        )}
        {searching && (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
            Searching PubMed database...
          </div>
        )}
      </div>
    </div>
  );
}
