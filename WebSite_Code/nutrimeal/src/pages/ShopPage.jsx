import React, { useState } from 'react';
import { ShoppingCart, Star, Search, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FOOD_ITEMS, CATEGORIES } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ShopPage() {
  const { dispatch } = useApp();
  const { user } = useAuth();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [added, setAdded] = useState({});

  const filtered = FOOD_ITEMS.filter(item => {
    const matchCat = category === 'All' || item.category === category;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchDiet = !user?.dietary?.glutenFree || item.tags.includes('gluten-free');
    return matchCat && matchSearch && matchDiet;
  });

  const handleAdd = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
    setAdded(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [item.id]: false })), 1200);
  };

  return (
    <div>
      <div className="shop-header">
        <div>
          <h1>🌿 Meal Shop</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
            Fresh, nutritionist-approved meals delivered to your door
          </p>
        </div>
        <div style={{ position: 'relative', marginLeft: 'auto' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input"
            style={{ paddingLeft: 36, width: 240 }}
            placeholder="Search meals..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="category-tabs" style={{ marginBottom: 24 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`category-tab${category === cat ? ' active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {user?.dietary?.glutenFree && (
        <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
          <Zap size={16} color="var(--accent3)" />
          <span style={{ fontSize: 13 }}>Showing gluten-free meals based on your dietary preferences</span>
        </div>
      )}

      <div className="food-grid">
        {filtered.map(item => (
          <div key={item.id} className="food-card">
            <div style={{ position: 'relative' }}>
              <img src={item.image} alt={item.name} className="food-card-img" />
              {!item.inStock && (
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '12px 12px 0 0'
                }}>
                  <span className="badge badge-red">Out of Stock</span>
                </div>
              )}
            </div>
            <div className="food-card-body">
              <div className="food-tags">
                {item.tags.map(tag => (
                  <span key={tag} className="badge badge-green">{tag}</span>
                ))}
              </div>
              <div className="food-card-title">{item.name}</div>
              <div className="food-card-desc">{item.description}</div>
              <div className="food-macros">
                <span>{item.nutrition.calories} cal</span>
                <span>P: {item.nutrition.protein}g</span>
                <span>C: {item.nutrition.carbs}g</span>
                <span>F: {item.nutrition.fat}g</span>
              </div>
              <div className="food-card-meta">
                <div>
                  <div className="food-price">${item.price.toFixed(2)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    <Star size={12} fill="var(--accent3)" color="var(--accent3)" />
                    {item.rating} ({item.reviews})
                  </div>
                </div>
                <button
                  className={`btn btn-sm ${added[item.id] ? 'btn-ghost' : 'btn-primary'}`}
                  onClick={() => handleAdd(item)}
                  disabled={!item.inStock}
                >
                  <ShoppingCart size={14} />
                  {added[item.id] ? '✓ Added' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
          <p>No meals match your filters.</p>
        </div>
      )}
    </div>
  );
}
