import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const RouterContext = createContext({ route: 'login', navigate: () => {} });

export const RouterProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth(); // Use authLoading to avoid premature navigation
  const [currentRoute, setCurrentRoute] = useState(window.location.hash.replace('#/', '') || 'login');

  const navigate = (newRoute) => {
    if (newRoute !== currentRoute) {
      window.location.hash = `#/${newRoute}`;
      // setCurrentRoute(newRoute); // Let hashchange handle this to keep it centralized
      
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hashRoute = window.location.hash.replace('#/', '') || (user ? 'dashboard' : 'login');
      setCurrentRoute(hashRoute);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial route setup based on hash or auth state
    if (!authLoading) { // Only set initial route after auth status is known
        const initialHashRoute = window.location.hash.replace('#/', '');
        if (initialHashRoute) {
            setCurrentRoute(initialHashRoute);
        } else {
            setCurrentRoute(user ? 'dashboard' : 'login');
        }
    }
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user, authLoading]); // Rerun on auth state change for default routing

  // Effect to redirect if auth state changes and current route is inappropriate
  useEffect(() => {
    if (!authLoading) {
      const publicRoutes = ['login', 'register'];
      if (user && publicRoutes.includes(currentRoute)) {
        navigate('dashboard');
      } else if (!user && !publicRoutes.includes(currentRoute)) {
        navigate('login');
      }
    }
  }, [user, currentRoute, authLoading, navigate]);


  return (
    <RouterContext.Provider value={{ route: currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export default RouterContext;