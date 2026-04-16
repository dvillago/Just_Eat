import React, { useState } from 'react';
import { RefreshCw, ShoppingCart, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { generateMealPlan } from '../services/api';

export default function AdminPage() {
  const { user } = useAuth();
  const { dispatch } = useApp();
  const [days, setDays] = useState(7);
  const [plan, setPlan] = useState(null);
  const [calorieBias, setCalorieBias] = useState(0);
  const [proteinFocus, setProteinFocus] = useState(false);

  const generate = () => {
    const goals = { ...user.goals, calories: user.goals.calories + calorieBias };
    const dietary = user.dietary;
    const result = generateMealPlan(goals, dietary, days);
    setPlan(result);
  };

  const addAllToCart = () => {
    if (!plan) return;
    plan.forEach(day => {
      [day.breakfast, day.lunch, day.dinner].filter(Boolean).forEach(meal => {
        dispatch({ type: 'ADD_TO_CART', payload: meal });
      });
    });
  };

  return (
    <div>
      <h1 style={{ marginBottom: 8 }}>Meal Plan Generator</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
        Admin-designed algorithm generates personalized meal plans based on your goals and restrictions
      </p>

      {/* Algorithm Controls */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 16 }}>Algorithm Settings</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          <div className="form-group">
            <label>Plan Duration (days)</label>
            <select className="select" value={days} onChange={e => setDays(Number(e.target.value))}>
              {[3, 5, 7, 14].map(d => <option key={d} value={d}>{d} days</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Calorie Adjustment</label>
            <select className="select" value={calorieBias} onChange={e => setCalorieBias(Number(e.target.value))}>
              <option value={-300}>-300 (Weight Loss)</option>
              <option value={0}>±0 (Maintenance)</option>
              <option value={300}>+300 (Muscle Gain)</option>
              <option value={500}>+500 (Bulk)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Protein Focus</label>
            <div className="toggle-row" style={{ padding: '10px 0' }}>
              <span style={{ fontSize: 14 }}>Prioritize high-protein meals</span>
              <label className="toggle">
                <input type="checkbox" checked={proteinFocus} onChange={e => setProteinFocus(e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 16px', background: 'var(--bg-hover)', borderRadius: 8, marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text)' }}>Algorithm Logic:</strong> Meals are filtered by your dietary restrictions,
          then selected to meet your calorie target (±100 kcal). Macros are balanced across breakfast, lunch, and dinner.
          Variety is maximized to avoid repetition.
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button className="btn btn-primary" onClick={generate}>
            <RefreshCw size={16} /> Generate Plan
          </button>
          {plan && (
            <button className="btn btn-secondary" onClick={addAllToCart}>
              <ShoppingCart size={16} /> Add All to Cart
            </button>
          )}
        </div>
      </div>

      {/* Meal Plan Display */}
      {plan && (
        <div>
          <h2 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={20} color="var(--accent)" /> Your {days}-Day Meal Plan
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {plan.map(day => (
              <div key={day.day} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3>Day {day.day}</h3>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{day.totalCalories}</span>
                    <span style={{ color: 'var(--text-muted)' }}> / {day.targetCalories} kcal</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {['breakfast', 'lunch', 'dinner'].map(meal => (
                    <div key={meal} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize', marginBottom: 8 }}>
                        {meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'} {meal}
                      </div>
                      {day[meal] ? (
                        <div style={{ background: 'var(--bg-hover)', borderRadius: 8, overflow: 'hidden' }}>
                          <img src={day[meal].image} alt={day[meal].name} style={{ width: '100%', height: 80, objectFit: 'cover' }} />
                          <div style={{ padding: 8 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{day[meal].name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
                              {day[meal].nutrition.calories} kcal
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: 20, background: 'var(--bg-hover)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 13 }}>
                          No suitable option
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!plan && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <p>Configure your settings above and click Generate Plan</p>
        </div>
      )}
    </div>
  );
}
