import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import Modal from './Modal';
import SelectRelatedField from './SelectRelatedField';
import { PlusCircleIcon, EditIcon, Trash2Icon, ArchiveIcon } from './icons';

const CrudResourcePage = ({ resourceName, apiEndpoint, columns, formFields, initialFormData, hideAddButton = false, dataTransformer }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState(initialFormData || {});
  const [formErrors, setFormErrors] = useState({}); // For displaying specific field errors

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(apiEndpoint);
      let fetchedItems = response.data.results || response.data;
      if (dataTransformer) {
        fetchedItems = fetchedItems.map(dataTransformer);
      }
      setItems(fetchedItems);
    } catch (err) {
      setError(`Failed to fetch ${resourceName}. ${err.response?.data?.detail || err.message}`);
      console.error(`Fetch ${resourceName} error:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, resourceName, dataTransformer]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (formErrors[name]) { // Clear error for this field on change
        setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    formFields.forEach(field => {
        if (field.required && !formData[field.name_id || field.name]) {
            errors[field.name_id || field.name] = `${field.label} is required.`;
        }
        // Add other validation rules here if needed (e.g., email format, password strength)
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // setIsLoading(true); // Consider a specific form submitting state
    const submittingToastId = 'submitting-toast'; // For a potential toast library
    console.log("Submitting form data:", formData);

    try {
      if (currentItem) { // Editing
        await apiClient.put(`${apiEndpoint}${currentItem.id}/`, formData);
      } else { // Creating
        await apiClient.post(apiEndpoint, formData);
      }
      setIsModalOpen(false);
      setCurrentItem(null);
      setFormData(initialFormData || {});
      setFormErrors({});
      fetchData(); // Refresh data
    } catch (err) {
      console.error(`Save ${resourceName.slice(0,-1)} error:`, err.response || err);
      if (err.response && err.response.data) {
        // Handle backend validation errors
        const backendErrors = err.response.data;
        const newFormErrors = {};
        for (const key in backendErrors) {
          newFormErrors[key] = Array.isArray(backendErrors[key]) ? backendErrors[key].join(' ') : backendErrors[key];
        }
        setFormErrors(newFormErrors);
        setError(`Failed to save ${resourceName.slice(0,-1)}. Please check the form for errors.`);
      } else {
        setError(`Failed to save ${resourceName.slice(0,-1)}. ${err.message}`);
      }
    } finally {
      // setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    const populatedFormData = {};
    formFields.forEach(field => {
        const fieldName = field.name_id || field.name;
        if (field.type === 'select_related' && item[field.name]) { // item[field.name] is the object
            populatedFormData[fieldName] = item[field.name][field.optionValue || 'id'];
        } else {
            populatedFormData[fieldName] = item[fieldName] !== undefined ? item[fieldName] : (initialFormData[fieldName] || '');
        }
    });
    setFormData(populatedFormData);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    // Replace window.confirm with a custom modal for better UX in future
    if (window.confirm(`Are you sure you want to delete this ${resourceName.slice(0,-1)}? This action cannot be undone.`)) {
      try {
        await apiClient.delete(`${apiEndpoint}${id}/`);
        fetchData(); // Refresh data
      } catch (err) {
        setError(`Failed to delete ${resourceName.slice(0,-1)}. ${err.response?.data?.detail || err.message}`);
        console.error(`Delete ${resourceName.slice(0,-1)} error:`, err);
      }
    }
  };

  const openCreateModal = () => {
    setCurrentItem(null);
    setFormData(initialFormData || {});
    setFormErrors({});
    setIsModalOpen(true);
  };

  if (isLoading && items.length === 0) return <div className="text-center py-10 text-gray-600">Loading {resourceName}...</div>;
  

  return (
    <div className="p-1"> {/* Reduced padding for the page container */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">{resourceName}</h1>
        {!hideAddButton && (
            <button
            onClick={openCreateModal}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-lg flex items-center space-x-2 transition-all duration-150 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
            <PlusCircleIcon className="w-5 h-5" />
            <span>Add New</span>
            </button>
        )}
      </div>

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4 shadow" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>}


      {items.length === 0 && !isLoading && (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <ArchiveIcon className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
            <p className="text-gray-500 text-lg">No {resourceName.toLowerCase()} found.</p>
            {!hideAddButton && <p className="text-gray-400 mt-2">Add one to get started!</p>}
        </div>
      )}

      {items.length > 0 && (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    {columns.map((col) => (
                    <th key={col.key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {col.header}
                    </th>
                    ))}
                    <th scope="col" className="relative px-6 py-3 text-right">
                    <span className="sr-only">Actions</span>
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                    {columns.map((col) => (
                        <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] === null || item[col.accessor] === undefined ? 'N/A' : String(item[col.accessor]))}
                        </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-800 transition-colors p-1 rounded hover:bg-indigo-100" title="Edit">
                        <EditIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-100" title="Delete">
                        <Trash2Icon className="w-5 h-5" />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentItem ? `Edit ${resourceName.slice(0,-1)}` : `Add New ${resourceName.slice(0,-1)}`}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formFields.map((field) => (
            <div key={field.name_id || field.name}>
              <label htmlFor={field.name_id || field.name} className="block text-sm font-medium text-gray-700 mb-1">{field.label} {field.required && <span className="text-red-500">*</span>}</label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name_id || field.name}
                  name={field.name_id || field.name}
                  value={formData[field.name_id || field.name] || ''}
                  onChange={handleInputChange}
                  rows="3"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 ${formErrors[field.name_id || field.name] ? 'border-red-500' : ''}`}
                  placeholder={field.placeholder}
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.name_id || field.name}
                  name={field.name_id || field.name}
                  value={formData[field.name_id || field.name] || ''}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 bg-white ${formErrors[field.name_id || field.name] ? 'border-red-500' : ''}`}
                >
                  <option value="">{field.placeholder || `Select ${field.label}`}</option>
                  {field.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === 'select_related' ? (
                <SelectRelatedField
                    id={field.name_id || field.name}
                    name={field.name_id || field.name} // e.g. field_id
                    value={formData[field.name_id || field.name] || ''}
                    onChange={handleInputChange}
                    endpoint={field.endpoint} // e.g. /crops/fields/
                    optionValue={field.optionValue || "id"}
                    optionLabel={field.optionLabel || "name"}
                    placeholder={field.placeholder || `Select ${field.label}`}
                    required={field.required}
                    className={formErrors[field.name_id || field.name] ? 'border-red-500' : ''}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  id={field.name_id || field.name}
                  name={field.name_id || field.name}
                  value={formData[field.name_id || field.name] || ''}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 ${formErrors[field.name_id || field.name] ? 'border-red-500' : ''}`}
                  placeholder={field.placeholder}
                  step={field.type === 'number' ? (field.step || 'any') : undefined}
                />
              )}
              {formErrors[field.name_id || field.name] && <p className="text-xs text-red-500 mt-1">{formErrors[field.name_id || field.name]}</p>}
            </div>
          ))}
          <div className="flex justify-end space-x-3 pt-5 border-t border-gray-200 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition-colors">
              {currentItem ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CrudResourcePage;