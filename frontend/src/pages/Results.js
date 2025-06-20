import React, { useEffect, useState } from 'react';
import { submitExampleData } from './__EXAMPLE_DATA__';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = Array.from({ length: 12 }, (_, i) => 9 + i);

function formatHour(hour) {
  if (hour === 12) return '12:00 PM';
  const ampm = hour > 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${ampm}`;
}

function getColor(count, max) {
  if (!count || max === 0) return '#eff6ff'; // blue-50
  return `rgb(59, 130, 246, ${0.15 + 0.85 * (count / max)})`; // shades of blue-500
}

export default function Results() {
  const [summary, setSummary] = useState({});
  const [bestSlots, setBestSlots] = useState([]);
  const [max, setMax] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchData = async () => {
    try {
      const [availRes, bestRes] = await Promise.all([
        fetch(process.env.REACT_APP_API_URL + '/api/availability').then(res => res.json()),
        fetch(process.env.REACT_APP_API_URL + '/api/best-time').then(res => res.json())
      ]);
      
      setSummary(availRes.summary || {});
      let maxVal = 0;
      for (const k in availRes.summary) {
        if (availRes.summary[k] > maxVal) maxVal = availRes.summary[k];
      }
      setMax(maxVal);
      setBestSlots(bestRes.bestSlots || []);
      setTotal(bestRes.totalUsers || 0);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateExample = async () => {
    setLoading(true);
    try {
      await submitExampleData();
      await fetchData();
    } catch (error) {
      console.error('Error generating example data:', error);
    }
    setLoading(false);
  };

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to delete all availability data? This cannot be undone.')) {
      return;
    }
    setClearing(true);
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/availability`, {
        method: 'DELETE'
      });
      await fetchData();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
    setClearing(false);
  };

  return (
    <div className="form-container">
      <div className="results-header">
        <h2 className="form-title" style={{ margin: 0 }}>Availability Heatmap</h2>
        <div className="button-group">
          <button onClick={handleGenerateExample} disabled={loading} className="form-button">
            {loading ? 'Generating...' : 'Generate Data'}
          </button>
          <button onClick={handleClearData} disabled={clearing} className="form-button button-danger">
            {clearing ? 'Clearing...' : 'Clear Data'}
          </button>
        </div>
      </div>
      <p style={{ margin: '0 0 1.5rem 0', color: '#64748b' }}>Total submissions: {total}</p>
      
      <div className="availability-grid-container">
        <table className="availability-table">
          <thead>
            <tr>
              <th></th>
              {hours.map(hour => <th key={hour}>{formatHour(hour)}</th>)}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td>{day}</td>
                {hours.map(hour => {
                  const key = `${day}_${hour.toString().padStart(2, '0')}`;
                  const count = summary[key] || 0;
                  const isBest = bestSlots.includes(key);
                  return (
                    <td
                      key={key}
                      style={{ 
                        background: getColor(count, max),
                        border: isBest ? '2px solid #3b82f6' : undefined,
                        color: isBest ? '#1e3a8a' : undefined,
                        fontWeight: isBest ? '700' : 'normal'
                      }}
                    >
                      {count > 0 ? count : ''}
                      {isBest && <span title="Best time!" style={{marginLeft: '4px'}}>⭐</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 style={{fontWeight: 600, fontSize: '1.125rem', marginTop: '2rem'}}>Top Matched Time(s):</h3>
        {bestSlots.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <ul>
            {bestSlots.map(slot => {
              const [day, hour] = slot.split('_');
              return <li key={slot}>{day} at {formatHour(Number(hour))}</li>;
            })}
          </ul>
        )}
      </div>
    </div>
  );
} 