// Usage: Run in browser console or import and call submitExampleData()
const API = process.env.REACT_APP_API_URL + '/api/availability';
const names = [
  'Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Heidi',
  'Ivan', 'Judy', 'Mallory', 'Niaj', 'Olivia', 'Peggy', 'Sybil', 'Trent'
];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = Array.from({ length: 12 }, (_, i) => 9 + i);

function randomSlots() {
  const slots = [];
  days.forEach(day => {
    hours.forEach(hour => {
      if (Math.random() < 0.25) slots.push(`${day}_${hour.toString().padStart(2, '0')}`);
    });
  });
  return slots;
}

export async function submitExampleData() {
  for (const name of names) {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, availability: randomSlots() })
    });
  }
  alert('Example data submitted!');
} 