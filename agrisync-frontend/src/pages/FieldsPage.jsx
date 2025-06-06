import React from 'react';
import CrudResourcePage from '../components/CrudResourcePage';
import { useAuth } from '../hooks/useAuth';


const FieldsPage = () => {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow" role="alert">
            <p className="font-bold">Access Denied</p>
            <p>You do not have permission to manage fields.</p>
        </div>
    );
  }
  
  return (
    <CrudResourcePage
        resourceName="Fields"
        apiEndpoint="/crops/fields/"
        columns={[
        { key: 'name', header: 'Name', accessor: 'name' },
        { key: 'location_description', header: 'Location/Description', accessor: 'location_description' },
        ]}
        formFields={[
        { name: 'name', label: 'Field Name', placeholder: 'e.g., North Field', required: true },
        { name: 'location_description', label: 'Location/Description', type: 'textarea', placeholder: 'Describe the field location or any notes' },
        ]}
        initialFormData={{ name: '', location_description: '' }}
    />
  );
};

export default FieldsPage;