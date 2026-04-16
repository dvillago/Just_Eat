import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Truck, Store, CreditCard, Smartphone, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { simulateOrderProgress } from '../services/api';

export default function CheckoutPage() {
  const { state, dispatch, cartTotal } = useApp();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState('delivery');
  const [payment, setPayment] = useState('card');
  const [address, setAddress] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  const taxes = cartTotal * 0.08;
  const deliveryFee = delivery === 'delivery' ? 4.99 : 0;
  const total = cartTotal + deliveryFee + taxes;

  const handlePlaceOrder = () => {
    if (delivery === 'delivery' && !address.trim()) {
      alert('Please enter a delivery address');
      return;
    }
    const id = `ORD-${Date.now().toString().slice(-8)}`;
    const order = {
      id,
      items: state.cart,
      total,
      deliveryType: delivery,
      address,
      paymentMethod: payment,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      rating: null,
    };
    dispatch({ type: 'ADD_ORDER', payload: order });
    dispatch({ type: 'ADD_NOTIFICATION', payload: {
      id: Date.now(), message: `Order #${id.slice(-4)} confirmed!`, type: 'order', time: new Date().toISOString()
    }});
    dispatch({ type: 'CLEAR_CART' });
    simulateOrderProgress(id, dispatch);
    setOrderId(id);
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-icon">🎉</div>
          <h2>Order Confirmed!</h2>
          <p>Your order <strong>#{orderId.slice(-4)}</strong> is being prepared. You'll receive updates as it progresses.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/orders')}>Track Order</button>
            <button className="btn btn-secondary" onClick={() => navigate('/shop')}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Checkout</h1>
      <div className="checkout-layout">
        <div>
          {/* Delivery Method */}
          <div className="checkout-section">
            <h3>Delivery Method</h3>
            <div className="delivery-options">
              <div className={`delivery-option${delivery === 'delivery' ? ' selected' : ''}`} onClick={() => setDelivery('delivery')}>
                <Truck size={24} color={delivery === 'delivery' ? 'var(--accent)' : 'var(--text-muted)'} style={{ marginBottom: 8 }} />
                <div style={{ fontWeight: 600 }}>Delivery</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>$4.99 · 30-45 min</div>
              </div>
              <div className={`delivery-option${delivery === 'pickup' ? ' selected' : ''}`} onClick={() => setDelivery('pickup')}>
                <Store size={24} color={delivery === 'pickup' ? 'var(--accent)' : 'var(--text-muted)'} style={{ marginBottom: 8 }} />
                <div style={{ fontWeight: 600 }}>Pickup</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Free · 15-20 min</div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {delivery === 'delivery' && (
            <div className="checkout-section">
              <h3>Delivery Address</h3>
              <div className="form-group">
                <label>Street Address</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    className="input"
                    style={{ paddingLeft: 36 }}
                    placeholder="123 Main St, Roswell, GA 30075"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                🚗 Powered by DoorDash/Kroger delivery network
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="checkout-section">
            <h3>Payment Method</h3>
            <div className="payment-methods">
              <div className={`payment-method${payment === 'card' ? ' selected' : ''}`} onClick={() => setPayment('card')}>
                <CreditCard size={20} color={payment === 'card' ? 'var(--accent2)' : 'var(--text-muted)'} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Credit Card</div>
                </div>
              </div>
              <div className={`payment-method${payment === 'apple' ? ' selected' : ''}`} onClick={() => setPayment('apple')}>
                <Smartphone size={20} color={payment === 'apple' ? 'var(--accent2)' : 'var(--text-muted)'} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Apple Pay</div>
                </div>
              </div>
            </div>

            {payment === 'card' && (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="form-group">
                  <label>Card Number</label>
                  <input className="input" placeholder="•••• •••• •••• ••••" value={cardNum}
                    onChange={e => setCardNum(e.target.value)} maxLength={19} />
                </div>
                <div className="form-group">
                  <label>Name on Card</label>
                  <input className="input" placeholder="John Smith" value={cardName}
                    onChange={e => setCardName(e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Expiry</label>
                    <input className="input" placeholder="MM/YY" value={cardExp}
                      onChange={e => setCardExp(e.target.value)} maxLength={5} />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input className="input" placeholder="•••" value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)} maxLength={4} type="password" />
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  🔒 Your payment information is encrypted and secure
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card" style={{ position: 'sticky', top: 80 }}>
            <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
            {state.cart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>×{item.quantity}</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="divider" />
            {[
              ['Subtotal', cartTotal.toFixed(2)],
              ['Delivery', deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`],
              ['Tax (8%)', taxes.toFixed(2)],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span>{typeof val === 'string' && !val.startsWith('$') ? val : (val.startsWith('$') ? val : `$${val}`)}</span>
              </div>
            ))}
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent)' }}>${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
              onClick={handlePlaceOrder}>
              <CheckCircle size={16} />
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
