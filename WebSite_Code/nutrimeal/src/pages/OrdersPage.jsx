import React, { useState } from 'react';
import { Package, X, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ORDER_STATUSES } from '../services/api';

function StarRating({ orderId }) {
  const { dispatch, state } = useApp();
  const order = state.orders.find(o => o.id === orderId);
  const [hover, setHover] = useState(0);
  const rating = order?.rating || 0;

  return (
    <div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Rate this order:</div>
      <div className="stars">
        {[1, 2, 3, 4, 5].map(s => (
          <span
            key={s}
            className={`star ${s <= (hover || rating) ? 'filled' : ''}`}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => dispatch({ type: 'RATE_ORDER', payload: { id: orderId, rating: s } })}
          >★</span>
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { state, dispatch } = useApp();
  const orders = state.orders;

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <Package size={64} color="var(--text-muted)" style={{ marginBottom: 16 }} />
        <h2>No orders yet</h2>
        <p style={{ color: 'var(--text-muted)' }}>Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Order History</h1>
      {orders.map(order => {
        const statusIdx = ORDER_STATUSES.indexOf(order.status);
        const isCancelled = order.status === 'Cancelled';
        const isDelivered = order.status === 'Delivered';

        return (
          <div key={order.id} className="card order-card">
            <div className="order-header">
              <div>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>Order #{order.id.slice(-4)}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className={`badge ${isCancelled ? 'badge-red' : isDelivered ? 'badge-green' : 'badge-blue'}`}>
                  {order.status}
                </span>
                {!isCancelled && !isDelivered && (
                  <button className="btn btn-danger btn-sm"
                    onClick={() => {
                      dispatch({ type: 'CANCEL_ORDER', payload: order.id });
                      dispatch({ type: 'ADD_NOTIFICATION', payload: {
                        id: Date.now(), message: `Order #${order.id.slice(-4)} cancelled`, type: 'cancel', time: new Date().toISOString()
                      }});
                    }}>
                    <X size={12} /> Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {order.items.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-hover)', borderRadius: 8, padding: '6px 10px' }}>
                  <img src={item.image} alt={item.name} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
                  <span style={{ fontSize: 13 }}>{item.name} ×{item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Tracking Timeline */}
            {!isCancelled && (
              <div className="order-timeline">
                {ORDER_STATUSES.map((s, i) => (
                  <div key={s} className={`timeline-step${i <= statusIdx ? ' done' : ''}`}>
                    <div className="timeline-dot" />
                    <div>{s}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {order.deliveryType === 'delivery' ? `📦 Delivery to ${order.address}` : '🏪 Pickup'}
                </div>
                <div style={{ fontWeight: 700, color: 'var(--accent)', marginTop: 4 }}>
                  Total: ${order.total.toFixed(2)}
                </div>
              </div>
              {isDelivered && <StarRating orderId={order.id} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
