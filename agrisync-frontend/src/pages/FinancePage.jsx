import React, { useState } from 'react';
import CrudResourcePage from '../components/CrudResourcePage';
import { useAuth } from '../hooks/useAuth';

const FinancePage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('incomes');

    if (user?.role !== 'admin') {
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow" role="alert">
                <p className="font-bold">Access Denied</p>
                <p>You do not have permission to manage finances.</p>
            </div>
        );
    }

    const dataTransformer = (item) => ({
        ...item,
        amount_display: `$${parseFloat(item.amount).toFixed(2)}`
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">Finance Management</h1>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {['incomes', 'expenses'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${
                                activeTab === tab
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none capitalize`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {activeTab === 'incomes' && (
                <CrudResourcePage
                    resourceName="Incomes"
                    apiEndpoint="/finance/incomes/"
                    columns={[
                        { key: 'source', header: 'Source', accessor: 'source' },
                        { key: 'amount_display', header: 'Amount', accessor: 'amount_display' },
                        { key: 'date_received', header: 'Date Received', accessor: 'date_received' },
                    ]}
                    formFields={[
                        { name: 'source', label: 'Source of Income', placeholder: 'e.g., Crop Sale - Maize', required: true },
                        { name: 'amount', label: 'Amount', type: 'number', step: '0.01', placeholder: '0.00', required: true },
                        { name: 'date_received', label: 'Date Received', type: 'date', required: true },
                    ]}
                    initialFormData={{ source: '', amount: '', date_received: '' }}
                    dataTransformer={dataTransformer}
                />
            )}
            {activeTab === 'expenses' && (
                 <CrudResourcePage
                    resourceName="Expenses"
                    apiEndpoint="/finance/expenses/"
                    columns={[
                        { key: 'category', header: 'Category', accessor: 'category' },
                        { key: 'amount_display', header: 'Amount', accessor: 'amount_display' },
                        { key: 'date_spent', header: 'Date Spent', accessor: 'date_spent' },
                        { key: 'notes', header: 'Notes', accessor: 'notes' },
                    ]}
                    formFields={[
                        { name: 'category', label: 'Expense Category', placeholder: 'e.g., Seeds, Fertilizer, Labor', required: true },
                        { name: 'amount', label: 'Amount', type: 'number', step: '0.01', placeholder: '0.00', required: true },
                        { name: 'date_spent', label: 'Date Spent', type: 'date', required: true },
                        { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Any additional details about the expense' },
                    ]}
                    initialFormData={{ category: '', amount: '', date_spent: '', notes: '' }}
                    dataTransformer={dataTransformer}
                />
            )}
        </div>
    );
};

export default FinancePage;