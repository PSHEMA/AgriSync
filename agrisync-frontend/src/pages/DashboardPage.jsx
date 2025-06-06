import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/apiClient';
import { ClipboardListIcon, LeafIcon, MapPinIcon, DollarSignIcon, UsersIcon, ArchiveIcon } from '../components/icons'; // Assuming icons are centralized

const DashboardPage = () => {
    const { user } = useAuth();

    console.log("DashboardPage - user object:", user);
    console.log("DashboardPage - user.role:", user?.role);
    const [stats, setStats] = useState({
        activeTasks: 0,
        totalCrops: 0,
        totalFields: 0,
        totalIncome: 0,
        totalExpenses: 0,
        // Add more stats as needed
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                
                let activeTasks = 0, totalCrops = 0, totalFields = 0, totalIncome = 0, totalExpenses = 0;

                if (user?.role === 'admin' || user?.role === 'worker') { // Tasks for both
                    const tasksResponse = await apiClient.get('/tasks/tasks/');
                    activeTasks = (tasksResponse.data.results || tasksResponse.data).filter(task => task.status !== 'done').length;
                }

                if (user?.role === 'admin') { // Admin specific stats
                    const cropsResponse = await apiClient.get('/crops/crops/');
                    totalCrops = (cropsResponse.data.results || cropsResponse.data).length;

                    const fieldsResponse = await apiClient.get('/crops/fields/');
                    totalFields = (fieldsResponse.data.results || fieldsResponse.data).length;
                    
                    const incomesResponse = await apiClient.get('/finance/incomes/');
                    totalIncome = (incomesResponse.data.results || incomesResponse.data).reduce((sum, income) => sum + parseFloat(income.amount), 0);

                    const expensesResponse = await apiClient.get('/finance/expenses/');
                    totalExpenses = (expensesResponse.data.results || expensesResponse.data).reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
                } else if (user?.role === 'worker') {
                    // For worker, tasks are already fetched.
                    // You want to fetch tasks specifically assigned to this worker.
                    // Example: /api/tasks/tasks/?assigned_to_id=${user.id}
                    const workerTasksResponse = await apiClient.get(`/tasks/tasks/?assigned_to=${user.id}`); // Adjust if your backend filters by assigned_to (user ID)
                    activeTasks = (workerTasksResponse.data.results || workerTasksResponse.data).filter(task => task.status !== 'done').length;

                }


                setStats({ activeTasks, totalCrops, totalFields, totalIncome, totalExpenses });

            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Could not load dashboard data. " + (err.response?.data?.detail || err.message) );
            } finally {
                setIsLoading(false);
            }
        };

        if (user) { // Fetch data only if user is loaded
            fetchDashboardData();
        } else {
            setIsLoading(false); // No user, no data to load
        }
    }, [user]);

    const StatCard = ({ title, value, icon, color = "green", unit = "" }) => {
        const IconComponent = icon;
        const colorClasses = {
            green: "bg-green-500",
            blue: "bg-blue-500",
            yellow: "bg-yellow-500",
            red: "bg-red-500",
            purple: "bg-purple-500",
            sky: "bg-sky-500"
        };
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                        {isLoading ? (
                             <div className="mt-2 h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                        ) : (
                            <p className="text-3xl font-bold text-gray-800">{unit}{typeof value === 'number' ? value.toLocaleString() : value}</p>
                        )}
                    </div>
                    <div className={`p-3 rounded-full ${colorClasses[color]} text-white shadow-md`}>
                        <IconComponent className="w-6 h-6" />
                    </div>
                </div>
            </div>
        );
    };
    
    if (isLoading && !user) { // Still waiting for user auth check
        return <div className="text-center py-10 text-gray-600">Initializing dashboard...</div>;
    }
    if (error) return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow" role="alert"><p className="font-bold">Error</p><p>{error}</p></div>;


    return (
        <div className="space-y-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-semibold text-gray-800">Welcome, {user?.username}!</h1>
                <p className="text-gray-600 mt-1">Here's an overview of your farm operations.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <StatCard title="Active Tasks" value={stats.activeTasks} icon={ClipboardListIcon} color="sky" />
                
                {user?.role === 'admin' && (
                    <>
                        <StatCard title="Total Crops" value={stats.totalCrops} icon={LeafIcon} color="green" />
                        <StatCard title="Managed Fields" value={stats.totalFields} icon={MapPinIcon} color="yellow" />
                        <StatCard title="Total Income" value={stats.totalIncome} icon={DollarSignIcon} color="purple" unit="$" />
                        <StatCard title="Total Expenses" value={stats.totalExpenses} icon={DollarSignIcon} color="red" unit="$" />
                        {/* Add more admin-specific cards here, e.g., total users */}
                    </>
                )}
            </div>

            {/* Placeholder for recent activity or charts */}
            {user?.role === 'admin' && (
                <div className="mt-10 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Farm Activity Overview</h2>
                    <p className="text-gray-600">Charts and recent activity logs will be displayed here.</p>
                    {/* Example: <BarChart data={...} /> or <RecentActivityList items={...} /> */}
                </div>
            )}
             {user?.role === 'worker' && (
                <div className="mt-10 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Tasks</h2>
                    <p className="text-gray-600">A summary of your upcoming and overdue tasks will be displayed here.</p>
                    {/* You could list a few upcoming tasks here */}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;