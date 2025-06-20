import React, { useState } from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = Array.from({ length: 12 }, (_, i) => 9 + i); // 9AM to 8PM is 12 hours

function formatHour(hour) {
  if (hour === 12) return '12:00 PM';
  const ampm = hour > 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${ampm}`;
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
      
      onSubmitted();
    } catch (error) {
      console.error('Error:', error);
      setError('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <h2 className="form-title">Submit Your Availability</h2>
          
          <div className="form-field">
            <label className="form-label" htmlFor="name">Full Name *</label>
            <input id="name" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          
          <div className="form-field">
            <label className="form-label" htmlFor="email">Email (optional)</label>
            <input id="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} type="email" />
          </div>

          <label className="form-label">Select your available times:</label>
          <div className="table-container">
            <table className="availability-table">
              <thead>
                <tr>
                  <th></th>
                  {hours.map(hour => (
                    <th key={hour}>{formatHour(hour)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map(day => (
                  <tr key={day}>
                    <td>{day}</td>
                    {hours.map(hour => {
                      const key = `${day}_${hour.toString().padStart(2, '0')}`;
                      return (
                        <td key={key}>
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
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="form-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Availability'}
          </button>
        </form>
      </div>
    </div>
  );
} 