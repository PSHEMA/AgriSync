import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

const SelectRelatedField = ({ id, name, value, onChange, endpoint, optionValue = "id", optionLabel = "name", placeholder, required, className }) => {
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOptions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await apiClient.get(endpoint);
                setOptions(response.data.results || response.data); // Handle paginated or non-paginated
            } catch (err) {
                console.error(`Failed to fetch options for ${name} from ${endpoint}:`, err);
                setError(`Could not load ${name} options.`);
                setOptions([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOptions();
    }, [endpoint, name]);

    if (isLoading) return <p className="text-sm text-gray-500 mt-1">Loading {placeholder || name} options...</p>;
    if (error) return <p className="text-sm text-red-500 mt-1">{error}</p>;

    return (
        <select
            id={id}
            name={name}
            value={value || ''} // Ensure value is not undefined for controlled component
            onChange={onChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 bg-white ${className}`}
            required={required}
        >
            <option value="">{placeholder || `Select ${name}`}</option>
            {options.map(opt => (
                <option key={opt[optionValue]} value={opt[optionValue]}>
                    {/* Handle cases where optionLabel might be nested, e.g., user.username */}
                    {optionLabel.includes('.') ? optionLabel.split('.').reduce((o, i) => o?.[i], opt) : opt[optionLabel]}
                </option>
            ))}
        </select>
    );
};

export default SelectRelatedField;