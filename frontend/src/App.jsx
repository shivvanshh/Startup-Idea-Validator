import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import InteractiveBackground from './components/InteractiveBackground';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import IdeaForm from './pages/IdeaForm';
import MyIdeas from './pages/MyIdeas';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col transition-colors duration-200 relative">
            <InteractiveBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/submit" 
                  element={
                    <PrivateRoute>
                      <IdeaForm />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/edit/:id" 
                  element={
                    <PrivateRoute>
                      <IdeaForm />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/my-ideas" 
                  element={
                    <PrivateRoute>
                      <MyIdeas />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </main>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
