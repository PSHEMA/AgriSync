import React from 'react';
import { useRouter } from './hooks/useRouter';
import { useAuth } from './hooks/useAuth';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FieldsPage from './pages/FieldsPage';
import CropsPage from './pages/CropsPage';
import TasksPage from './pages/TasksPage';
import FinancePage from './pages/FinancePage';
import InventoryPage from './pages/InventoryPage';
import UsersPage from './pages/UsersPage';

function App() {
  const { route } = useRouter();
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">Loading AgriSync Lite...</div>
        {/* You can add a more sophisticated spinner here */}
      </div>
    );
  }

  let CurrentPage;
  const publicRoutes = ['login', 'register'];

  if (!user) {
    if (route === 'register') {
      CurrentPage = RegisterPage;
    } else {
      CurrentPage = LoginPage; // Default to login if not authenticated and not on register
    }
    return <CurrentPage />; // Render public pages without AppLayout
  }

  // User is authenticated, proceed to protected routes
  switch (route) {
    case 'dashboard': CurrentPage = DashboardPage; break;
    case 'fields': CurrentPage = FieldsPage; break;
    case 'crops': CurrentPage = CropsPage; break;
    case 'tasks': CurrentPage = TasksPage; break;
    case 'finance': CurrentPage = FinancePage; break;
    case 'inventory': CurrentPage = InventoryPage; break;
    case 'users': CurrentPage = UsersPage; break;
    default: CurrentPage = DashboardPage; // Fallback to dashboard
  }
  
  // If somehow an authenticated user lands on a public route, redirect to dashboard
  // This logic is also partially handled in RouterContext, but good to have a fallback.
  if (publicRoutes.includes(route)) {
      CurrentPage = DashboardPage; // Redirect to dashboard
  }


  return (
    <AppLayout>
      <CurrentPage />
    </AppLayout>
  );
}

export default App;