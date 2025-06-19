import React, { useEffect, useState } from 'react';
import { submitExampleData } from './__EXAMPLE_DATA__';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = Array.from({ length: 12 }, (_, i) => 9 + i);

function formatHour(hour) {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour > 12 ? hour - 12 : hour;
  return `${display}:00 ${ampm}`;
}

function getColor(count, max) {
  if (!count) return '#eee';
  return `rgb(30, 144, 255, ${0.2 + 0.8 * (count / max)})`;
}

export default function Results() {
  const [summary, setSummary] = useState({});
  const [bestSlots, setBestSlots] = useState([]);
  const [max, setMax] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchData = async () => {
    const [availRes, bestRes] = await Promise.all([
      fetch(process.env.REACT_APP_API_URL + '/api/availability').then(res => res.json()),
      fetch(process.env.REACT_APP_API_URL + '/api/best-time').then(res => res.json())
    ]);
    
    setSummary(availRes.summary || {});
    let maxVal = 0;
    // Sort and log slots by count
    const sortedSlots = Object.entries(availRes.summary || {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    console.log('Top 5 most selected time slots:');
    sortedSlots.forEach(([slot, count]) => {
      const [day, hour] = slot.split('_');
      console.log(`${day} at ${formatHour(parseInt(hour))}: ${count} people`);
    });
    
    for (const k in availRes.summary) {
      if (availRes.summary[k] > maxVal) maxVal = availRes.summary[k];
    }
    setMax(maxVal);
    setBestSlots(bestRes.bestSlots || []);
    setTotal(bestRes.totalUsers || 0);
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
      await fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error clearing data:', error);
    }
    setClearing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Availability Heatmap</h2>
        <div className="space-x-4">
          <button
            onClick={handleGenerateExample}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Generating...' : 'Generate Example Data'}
          </button>
          <button
            onClick={handleClearData}
            disabled={clearing}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
          >
            {clearing ? 'Clearing...' : 'Clear All Data'}
          </button>
        </div>
      </div>
      <p className="mb-2">Total submissions: {total}</p>
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
                  const count = summary[key] || 0;
                  const isBest = bestSlots.includes(key);
                  return (
                    <td
                      key={key}
                      className="border p-1 text-center"
                      style={{ background: getColor(count, max), fontWeight: isBest ? 'bold' : 'normal', border: isBest ? '2px solid #2563eb' : undefined }}
                    >
                      {count > 0 ? count : ''}
                      {isBest && <span title="Best time">⭐</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Top Matched Time(s):</h3>
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