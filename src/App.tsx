import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { HomePage } from './pages/Home/HomePage';
import { PropertiesPage } from './pages/Properties/PropertiesPage';
import { PropertyDetailsPage } from './pages/PropertyDetails/PropertyDetailsPage';
import { FavoritesPage } from './pages/Favorites/FavoritesPage';
import { SubmitPropertyPage } from './pages/SubmitProperty/SubmitPropertyPage';
import { AboutPage } from './pages/About/AboutPage';
import { ContactPage } from './pages/Contact/ContactPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { NotFoundPage } from './pages/NotFound/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <FavoritesProvider>
            <Router>
              <div className="min-h-screen flex flex-col bg-[#f4f7f4] dark:bg-[#2f3e46] text-[#2f3e46] dark:text-slate-100 transition-colors duration-200">
                <Navbar />
                
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/properties" element={<PropertiesPage />} />
                    <Route path="/buy" element={<Navigate to="/properties?purpose=sale" replace />} />
                    <Route path="/rent" element={<Navigate to="/properties?purpose=rent" replace />} />
                    <Route path="/properties/:slug" element={<PropertyDetailsPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/submit-property" element={<SubmitPropertyPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* Admin Dashboard */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 Catch-All */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>

                <Footer />
                <FloatingWhatsApp />
              </div>
            </Router>
          </FavoritesProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
