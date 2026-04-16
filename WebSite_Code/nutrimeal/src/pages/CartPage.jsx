import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CartPage() {
  const { state, dispatch, cartTotal } = useApp();
  const { cart } = state;

  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: qty } });
  const removeItem = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <ShoppingBag size={64} color="var(--text-muted)" style={{ marginBottom: 16 }} />
        <h2>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
          Add some delicious meals to get started
        </p>
        <Link to="/shop" className="btn btn-primary">Browse Meals</Link>
      </div>
    );
  }

  const taxes = cartTotal * 0.08;
  const delivery = 4.99;

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Your Cart</h1>
      <div className="cart-layout">
        <div className="card">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                  {item.nutrition.calories} cal · P:{item.nutrition.protein}g
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                    <span className="qty-num">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button className="btn btn-ghost btn-sm" onClick={() => removeItem(item.id)}>
                      <Trash2 size={14} color="var(--danger)" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.name} ×{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                <span>${delivery.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>Tax (8%)</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <div className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16 }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent)' }}>${(cartTotal + delivery + taxes).toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: 20, justifyContent: 'center' }}>
              Checkout <ArrowRight size={16} />
            </Link>
            <Link to="/shop" className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
