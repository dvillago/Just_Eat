import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import NutritionPage from './pages/NutritionPage';
import ProfilePage from './pages/ProfilePage';
import ChatbotPage from './pages/ChatbotPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/shop" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/nutrition" element={<NutritionPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/chat" element={<ChatbotPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;