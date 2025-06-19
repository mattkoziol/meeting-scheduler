import React, { useState } from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = Array.from({ length: 12 }, (_, i) => 9 + i); // 9AM to 9PM

function formatHour(hour) {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour > 12 ? hour - 12 : hour;
  return `${display}:00 ${ampm}`;
}

export default function AvailabilityForm({ onSubmitted }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selected, setSelected] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheck = (day, hour) => {
    const key = `${day}_${hour.toString().padStart(2, '0')}`;
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    const availability = Object.keys(selected).filter(k => selected[k]);
    if (availability.length === 0) {
      setError('Please select at least one time slot.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, availability })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Success:', data);
      onSubmitted();
    } catch (error) {
      console.error('Error:', error);
      setError('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="max-w-xl mx-auto p-4" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Submit Your Availability</h2>
      <div className="mb-2">
        <label className="block mb-1">Full Name *</label>
        <input className="border p-2 w-full" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Email (optional)</label>
        <input className="border p-2 w-full" value={email} onChange={e => setEmail(e.target.value)} type="email" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border mb-4">
          <thead>
            <tr>
              <th className="border p-1"></th>
              {hours.map(hour => (
                <th key={hour} className="border p-1 text-xs">{formatHour(hour)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td className="border p-1 font-semibold">{day}</td>
                {hours.map(hour => {
                  const key = `${day}_${hour.toString().padStart(2, '0')}`;
                  return (
                    <td key={key} className="border p-1 text-center">
                      <input
                        type="checkbox"
                        checked={!!selected[key]}
                        onChange={() => handleCheck(day, hour)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
} 