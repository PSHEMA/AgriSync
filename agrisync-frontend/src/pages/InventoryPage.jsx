// import React from 'react';
// import { ArchiveIcon } from '../components/icons'; // Assuming centralized icons
// import { useAuth } from '../hooks/useAuth';


// const InventoryPage = () => {
//     const { user } = useAuth();
//     // Placeholder: Inventory models and endpoints are not defined in the provided backend.
//     // This would be similar to other CrudResourcePage implementations once backend is ready.
    
//     if (user?.role !== 'admin') {
//         return (
//             <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow" role="alert">
//                 <p className="font-bold">Access Denied</p>
//                 <p>You do not have permission to manage inventory.</p>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <h1 className="text-2xl font-semibold text-gray-800 mb-6">Inventory Management</h1>
//             <div className="bg-white p-8 rounded-xl shadow-lg text-center">
//                 <ArchiveIcon className="w-20 h-20 text-gray-300 mx-auto mb-6"/>
//                 <p className="text-xl text-gray-700 mb-2">Inventory Feature Coming Soon!</p>
//                 <p className="text-gray-500">This section is under development. Backend models and API endpoints for inventory need to be implemented first.</p>
//             </div>
//         </div>
//     );
// };

// export default InventoryPage;

import React from 'react';
import CrudResourcePage from '../components/CrudResourcePage';
import { useAuth } from '../hooks/useAuth';

const InventoryPage = () => {
    const { user } = useAuth();

    // Only administrators should be able to manage inventory
    if (user?.role !== 'admin') {
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow" role="alert">
                <p className="font-bold">Access Denied</p>
                <p>You do not have permission to manage inventory.</p>
            </div>
        );
    }

    // This function will format the data received from the API for better display
    const dataTransformer = (item) => ({
        ...item,
        quantity_display: `${item.quantity} ${item.unit}`,
        last_updated_display: new Date(item.last_updated).toLocaleString(),
    });

    return (
        <CrudResourcePage
            resourceName="Inventory Items"
            apiEndpoint="/inventory/items/"
            dataTransformer={dataTransformer}
            columns={[
                { key: 'name', header: 'Item Name', accessor: 'name' },
                { key: 'category', header: 'Category', accessor: 'category' },
                { key: 'quantity_display', header: 'Quantity', accessor: 'quantity_display' },
                { key: 'last_updated_display', header: 'Last Updated', accessor: 'last_updated_display' },
            ]}
            formFields={[
                { name: 'name', label: 'Item Name', placeholder: 'e.g., Urea Fertilizer', required: true },
                {
                    name: 'category',
                    label: 'Category',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'seeds', label: 'Seeds' },
                        { value: 'fertilizer', label: 'Fertilizer' },
                        { value: 'pesticide', label: 'Pesticide' },
                        { value: 'equipment', label: 'Equipment' },
                        { value: 'fuel', label: 'Fuel' },
                        { value: 'other', label: 'Other' },
                    ],
                    placeholder: 'Select a category'
                },
                { name: 'quantity', label: 'Quantity', type: 'number', step: '0.01', placeholder: '0.00', required: true },
                {
                    name: 'unit',
                    label: 'Unit',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'kg', label: 'Kilograms (kg)' },
                        { value: 'g', label: 'Grams (g)' },
                        { value: 'liters', label: 'Liters' },
                        { value: 'ml', label: 'Milliliters (ml)' },
                        { value: 'units', label: 'Units' },
                        { value: 'sacks', label: 'Sacks' },
                    ],
                    placeholder: 'Select a unit'
                },
            ]}
            initialFormData={{
                name: '',
                category: 'other',
                quantity: '',
                unit: 'units',
            }}
        />
    );
};

export default InventoryPage;