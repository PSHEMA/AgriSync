import { useEffect, useState } from 'react';
import axios from '../api/axios';

function CropList() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await axios.get('/crops/crops/');
        setCrops(res.data);
      } catch (err) {
        setError('Failed to load crops');
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading crops...</div>;
  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Crops Overview</h2>
      {crops.length === 0 ? (
        <p>No crops found.</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Field</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Planted</th>
              <th className="py-2 px-4 border">Expected Harvest</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((crop) => (
              <tr key={crop.id}>
                <td className="py-2 px-4 border">{crop.name}</td>
                <td className="py-2 px-4 border">{crop.field.name}</td>
                <td className="py-2 px-4 border capitalize">{crop.status}</td>
                <td className="py-2 px-4 border">{crop.planting_date}</td>
                <td className="py-2 px-4 border">{crop.expected_harvest_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CropList;
