
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useNavigate, useParams } from 'react-router-dom';
import { INITIAL_CLIENTS, INITIAL_LETTERS, DISPUTE_TEMPLATES } from './constants';
import { Client, DisputeLetter, Template } from './types';

// Pages
import Landing from './pages/Landing';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Resources from './pages/Resources';
import Login from './pages/Login';
import ClientPortal from './pages/ClientPortal';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminClients from './pages/AdminClients';
import AdminClientDetail from './pages/AdminClientDetail';
import AdminLetters from './pages/AdminLetters';
import AdminTemplates from './pages/AdminTemplates';
import AdminCreditBuilding from './pages/AdminCreditBuilding';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';

// Define AdminRouteProps to ensure children are correctly typed for TS
interface AdminRouteProps {
  isAdmin: boolean;
  children: React.ReactNode;
}

// Moved AdminRoute outside App component to fix JSX children inference issues and ensure component stability
const AdminRoute: React.FC<AdminRouteProps> = ({ children, isAdmin }) => {
  return isAdmin ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('tlc_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [letters, setLetters] = useState<DisputeLetter[]>(() => {
    const saved = localStorage.getItem('tlc_letters');
    return saved ? JSON.parse(saved) : INITIAL_LETTERS;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('tlc_isAdmin') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('tlc_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('tlc_letters', JSON.stringify(letters));
  }, [letters]);

  const handleLogin = (status: boolean) => {
    setIsAdmin(status);
    localStorage.setItem('tlc_isAdmin', String(status));
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('tlc_isAdmin');
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {!isAdmin && <Navbar />}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            
            {/* Client Portal */}
            <Route path="/client/:token" element={<ClientPortal clients={clients} setClients={setClients} />} />

            {/* Admin Routes with isAdmin prop passed explicitly to satisfy component signature */}
            <Route path="/dashboard" element={
              <AdminRoute isAdmin={isAdmin}>
                <div className="flex h-screen bg-slate-100 overflow-hidden">
                  <AdminSidebar onLogout={handleLogout} />
                  <div className="flex-1 overflow-auto p-4 md:p-8">
                    <AdminDashboard clients={clients} letters={letters} />
                  </div>
                </div>
              </AdminRoute>
            } />
            <Route path="/dashboard/clients" element={
              <AdminRoute isAdmin={isAdmin}>
                <div className="flex h-screen bg-slate-100 overflow-hidden">
                  <AdminSidebar onLogout={handleLogout} />
                  <div className="flex-1 overflow-auto p-4 md:p-8">
                    <AdminClients clients={clients} setClients={setClients} />
                  </div>
                </div>
              </AdminRoute>
            } />
            <Route path="/dashboard/clients/:id" element={
              <AdminRoute isAdmin={isAdmin}>
                <div className="flex h-screen bg-slate-100 overflow-hidden">
                  <AdminSidebar onLogout={handleLogout} />
                  <div className="flex-1 overflow-auto p-4 md:p-8">
                    <AdminClientDetail 
                      clients={clients} 
                      setClients={setClients} 
                      letters={letters} 
                      setLetters={setLetters} 
                    />
                  </div>
                </div>
              </AdminRoute>
            } />
            <Route path="/dashboard/letters" element={
              <AdminRoute isAdmin={isAdmin}>
                <div className="flex h-screen bg-slate-100 overflow-hidden">
                  <AdminSidebar onLogout={handleLogout} />
                  <div className="flex-1 overflow-auto p-4 md:p-8">
                    <AdminLetters letters={letters} />
                  </div>
                </div>
              </AdminRoute>
            } />
            <Route path="/dashboard/templates" element={
              <AdminRoute isAdmin={isAdmin}>
                <div className="flex h-screen bg-slate-100 overflow-hidden">
                  <AdminSidebar onLogout={handleLogout} />
                  <div className="flex-1 overflow-auto p-4 md:p-8">
                    <AdminTemplates />
                  </div>
                </div>
              </AdminRoute>
            } />
            <Route path="/dashboard/credit-building" element={
              <AdminRoute isAdmin={isAdmin}>
                <div className="flex h-screen bg-slate-100 overflow-hidden">
                  <AdminSidebar onLogout={handleLogout} />
                  <div className="flex-1 overflow-auto p-4 md:p-8">
                    <AdminCreditBuilding />
                  </div>
                </div>
              </AdminRoute>
            } />
          </Routes>
        </main>
        {!isAdmin && <Footer />}
      </div>
    </Router>
  );
};

export default App;
