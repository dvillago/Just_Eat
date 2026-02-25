import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, Leaf, Bot, User, ClipboardList, BarChart2, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { cartCount, state } = useApp();
  const hasNotifications = state.notifications.some(n => !n.read);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/shop" className="navbar-logo">
          Nutri<span>Meal</span>
        </NavLink>
        <div className="nav-links">
          <NavLink to="/shop" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span>Shop</span>
          </NavLink>
          <NavLink to="/nutrition" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <BarChart2 size={16} /><span>Nutrition</span>
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <ClipboardList size={16} /><span>Orders</span>
          </NavLink>
          <NavLink to="/chat" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Bot size={16} /><span>AI Chat</span>
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Settings size={16} /><span>Admin</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <User size={16} /><span>Profile</span>
          </NavLink>
        </div>
        <NavLink to="/cart" className={({ isActive }) => `btn btn-secondary btn-sm nav-cart${isActive ? ' active' : ''}`}>
          <ShoppingCart size={16} />
          <span>{cartCount > 0 ? `$${(cartCount).toString()}` : 'Cart'}</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </NavLink>
      </div>
    </nav>
  );
}