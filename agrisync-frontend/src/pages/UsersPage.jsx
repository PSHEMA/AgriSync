import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { useAuth } from '../hooks/useAuth';
import { UsersIcon } from '../components/icons'; // Assuming centralized icons

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            if (currentUser?.role !== 'admin') {
                setError("Access Denied: You don't have permission to view this page.");
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                // Uses the /api/auth/users/ endpoint created earlier
                const response = await apiClient.get('/auth/users/');
                setUsers(response.data.results || response.data);
            } catch (err) {
                setError(`Failed to fetch users. ${err.response?.data?.detail || err.message}.`);
                console.error("Fetch users error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUser) { // Ensure currentUser is loaded before trying to check role
             fetchUsers();
        } else {
            setIsLoading(false); // If no current user, stop loading
        }
       
    }, [currentUser]);

    if (isLoading) return <div className="text-center py-10 text-gray-600">Loading users...</div>;
    
    if (error) return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
        </div>
    );
    
    if (currentUser?.role !== 'admin') { // Double check after loading
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow" role="alert">
                <p className="font-bold">Access Denied</p>
                <p>This page is for administrators only.</p>
            </div>
        );
    }


    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
            {users.length === 0 && !isLoading && (
                 <div className="text-center py-10 bg-white rounded-lg shadow-md">
                    <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                    <p className="text-gray-500 text-lg">No users found.</p>
                    <p className="text-gray-400 mt-2">Ensure the user listing API is working correctly.</p>
                </div>
            )}
            {users.length > 0 && (
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.first_name || ''} {user.last_name || ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;