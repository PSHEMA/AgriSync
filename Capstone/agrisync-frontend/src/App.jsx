import React, { useState, useEffect } from 'react';
import { User, LogOut, Home, Wheat, CheckSquare, DollarSign, Plus, Edit, Trash2, Calendar, MapPin, TrendingUp, TrendingDown, Users } from 'lucide-react';

// Mock API functions (replace with actual API calls)
const api = {
  login: async (credentials) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      access: 'mock-token',
      refresh: 'mock-refresh-token',
      user: { id: 1, username: credentials.username, role: 'admin' }
    };
  },
  
  getCrops: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        name: 'Tomatoes',
        field: { id: 1, name: 'North Field', location_description: 'Northern section of the farm' },
        planting_date: '2024-01-15',
        expected_harvest_date: '2024-04-15',
        status: 'growing',
        inputs: [
          { id: 1, name: 'Fertilizer NPK', quantity: '50kg', date_used: '2024-01-20' },
          { id: 2, name: 'Pesticide', quantity: '2L', date_used: '2024-02-01' }
        ]
      },
      {
        id: 2,
        name: 'Maize',
        field: { id: 2, name: 'South Field', location_description: 'Southern section of the farm' },
        planting_date: '2024-02-01',
        expected_harvest_date: '2024-06-01',
        status: 'planted',
        inputs: [
          { id: 3, name: 'Seeds', quantity: '10kg', date_used: '2024-02-01' }
        ]
      }
    ];
  },
  
  getTasks: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        title: 'Water the tomato field',
        description: 'Apply irrigation to north field tomatoes',
        assigned_to: { id: 2, username: 'john_worker', role: 'worker' },
        due_date: '2024-03-01',
        status: 'todo',
        created_at: '2024-02-25T10:00:00Z'
      },
      {
        id: 2,
        title: 'Apply fertilizer to maize',
        description: 'Second round of fertilizer application',
        assigned_to: { id: 3, username: 'mary_worker', role: 'worker' },
        due_date: '2024-03-05',
        status: 'in_progress',
        created_at: '2024-02-26T14:30:00Z'
      }
    ];
  },
  
  getFinances: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      incomes: [
        { id: 1, source: 'Tomato sales', amount: 500000, date_received: '2024-02-20' },
        { id: 2, source: 'Maize sales', amount: 300000, date_received: '2024-02-15' }
      ],
      expenses: [
        { id: 1, category: 'Seeds', amount: 50000, date_spent: '2024-01-10', notes: 'Tomato seeds' },
        { id: 2, category: 'Fertilizer', amount: 75000, date_spent: '2024-01-15', notes: 'NPK fertilizer' },
        { id: 3, category: 'Labor', amount: 100000, date_spent: '2024-02-01', notes: 'Monthly wages' }
      ]
    };
  }
};

// Authentication Context
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials);
      setUser(response.user);
      setToken(response.access);
      localStorage.setItem('token', response.access);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    if (token) {
      setUser({ id: 1, username: 'admin', role: 'admin' });
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

// Login Component
const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = React.useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(credentials);
    if (success) {
      onLogin();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <Wheat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AgriSync</h1>
          <p className="text-gray-600">Farm Management System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Navigation Sidebar
const Sidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'crops', label: 'Crops', icon: Wheat },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'finance', label: 'Finance', icon: DollarSign },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="flex items-center mb-8">
        <Wheat className="w-8 h-8 text-green-400 mr-3" />
        <h1 className="text-xl font-bold">AgriSync</h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="border-t border-gray-700 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="w-8 h-8 text-gray-400 mr-3" />
              <div>
                <p className="font-medium">{user?.username}</p>
                <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-white"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCrops: 0,
    activeTasks: 0,
    totalIncome: 0,
    totalExpenses: 0,
    crops: [],
    tasks: [],
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [crops, tasks, finances] = await Promise.all([
          api.getCrops(),
          api.getTasks(),
          api.getFinances()
        ]);

        const totalIncome = finances.incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
        const totalExpenses = finances.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

        setStats({
          totalCrops: crops.length,
          activeTasks: tasks.filter(task => task.status !== 'done').length,
          totalIncome,
          totalExpenses,
          crops: crops.slice(0, 3),
          tasks: tasks.slice(0, 3),
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Farm Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Wheat className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Crops</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCrops}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <CheckSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalIncome)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalExpenses)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Crops</h2>
          <div className="space-y-4">
            {stats.crops.map((crop) => (
              <div key={crop.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{crop.name}</p>
                  <p className="text-sm text-gray-600">{crop.field.name}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  crop.status === 'growing' ? 'bg-green-100 text-green-800' :
                  crop.status === 'planted' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {crop.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pending Tasks</h2>
          <div className="space-y-4">
            {stats.tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-600">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === 'todo' ? 'bg-red-100 text-red-800' :
                  task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Crops Management Component
const CropsManager = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCrops = async () => {
      try {
        const data = await api.getCrops();
        setCrops(data);
      } catch (error) {
        console.error('Error loading crops:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCrops();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading crops...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Crops Management</h1>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Crop
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <div key={crop.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{crop.name}</h3>
              <div className="flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {crop.field.name}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Planted: {new Date(crop.planting_date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Harvest: {new Date(crop.expected_harvest_date).toLocaleDateString()}
              </div>
            </div>
            
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                crop.status === 'growing' ? 'bg-green-100 text-green-800' :
                crop.status === 'planted' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {crop.status}
              </span>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Inputs Used ({crop.inputs.length})</h4>
              <div className="space-y-1">
                {crop.inputs.slice(0, 2).map((input) => (
                  <div key={input.id} className="text-sm text-gray-600">
                    {input.name} - {input.quantity}
                  </div>
                ))}
                {crop.inputs.length > 2 && (
                  <div className="text-sm text-blue-500">
                    +{crop.inputs.length - 2} more
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Tasks Management Component
const TasksManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await api.getTasks();
        setTasks(data);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Task
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold mr-4">{task.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === 'todo' ? 'bg-red-100 text-red-800' :
                    task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">{task.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  {task.assigned_to && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {task.assigned_to.username}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Created: {new Date(task.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button className="text-blue-500 hover:text-blue-700">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Finance Management Component
const FinanceManager = () => {
  const [finances, setFinances] = useState({ incomes: [], expenses: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFinances = async () => {
      try {
        const data = await api.getFinances();
        setFinances(data);
      } catch (error) {
        console.error('Error loading finances:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFinances();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount);
  };

  const totalIncome = finances.incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
  const totalExpenses = finances.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const netProfit = totalIncome - totalExpenses;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading finances...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Financial Management</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <DollarSign className={`w-6 h-6 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netProfit)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Income</h2>
            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center text-sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Income
            </button>
          </div>
          
          <div className="space-y-3">
            {finances.incomes.map((income) => (
              <div key={income.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{income.source}</p>
                  <p className="text-sm text-gray-600">{new Date(income.date_received).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 font-semibold mr-2">
                    {formatCurrency(income.amount)}
                  </span>
                  <button className="text-blue-500 hover:text-blue-700 mr-1">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Expenses</h2>
            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center text-sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Expense
            </button>
          </div>
          
          <div className="space-y-3">
            {finances.expenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{expense.category}</p>
                  <p className="text-sm text-gray-600">{new Date(expense.date_spent).toLocaleDateString()}</p>
                  {expense.notes && (
                    <p className="text-xs text-gray-500">{expense.notes}</p>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-red-600 font-semibold mr-2">
                    {formatCurrency(expense.amount)}
                  </span>
                  <button className="text-blue-500 hover:text-blue-700 mr-1">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const AgriSyncApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, logout, isAuthenticated } = React.useContext(AuthContext);

  const handleLogout = () => {
    logout();
    setActiveTab('dashboard');
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setActiveTab('dashboard')} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'crops':
        return <CropsManager />;
      case 'tasks':
        return <TasksManager />;
      case 'finance':
        return <FinanceManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
      />
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

// App with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AgriSyncApp />
    </AuthProvider>
  );
}