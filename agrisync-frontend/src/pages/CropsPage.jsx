import React from 'react';
import CrudResourcePage from '../components/CrudResourcePage';
import { useAuth } from '../hooks/useAuth';

const CropsPage = () => {
    const { user } = useAuth();

    if (user?.role !== 'admin') {
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow" role="alert">
                <p className="font-bold">Access Denied</p>
                <p>You do not have permission to manage crops.</p>
            </div>
        );
    }

    // Note: CropSerializer has read_only `field` and write_only `field_id`.
    // Inputs are also read_only for now in the CropSerializer.
    // Managing inputs would typically be a separate section or a nested form within the crop.
    return (
        <CrudResourcePage
            resourceName="Crops"
            apiEndpoint="/crops/crops/"
            columns={[
                { key: 'name', header: 'Crop Name', accessor: 'name' },
                { key: 'field', header: 'Field', accessor: (item) => item.field?.name || 'N/A' },
                { key: 'planting_date', header: 'Planting Date', accessor: 'planting_date' },
                { key: 'expected_harvest_date', header: 'Expected Harvest', accessor: 'expected_harvest_date' },
                { key: 'status', header: 'Status', accessor: 'status' },
            ]}
            formFields={[
                { name: 'name', label: 'Crop Name', placeholder: 'e.g., Maize, Beans', required: true },
                { name: 'field_id', label: 'Field', type: 'select_related', endpoint: '/crops/fields/', placeholder: 'Select Field', required: true, optionValue: 'id', optionLabel: 'name' },
                { name: 'planting_date', label: 'Planting Date', type: 'date', required: true },
                { name: 'expected_harvest_date', label: 'Expected Harvest Date', type: 'date', required: true },
                { 
                    name: 'status', 
                    label: 'Status', 
                    type: 'select', 
                    required: true,
                    options: [
                        { value: 'planted', label: 'Planted' },
                        { value: 'growing', label: 'Growing' },
                        { value: 'harvested', label: 'Harvested' },
                    ],
                    placeholder: 'Select Status'
                },
            ]}
            initialFormData={{ name: '', field_id: '', planting_date: '', expected_harvest_date: '', status: 'planted' }}
        />
    );
    // TODO: Add UI for managing InputsUsed for a crop
};

export default CropsPage;