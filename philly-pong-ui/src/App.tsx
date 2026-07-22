import React, { useEffect, useState } from 'react';
import type { Table } from '../../src/models/Table';

export function App() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // New Filter States
  const [envFilter, setEnvFilter] = useState<'All' | 'Indoor' | 'Outdoor'>('All');
  const [priceFilter, setPriceFilter] = useState<'All' | 'Free' | 'Paid'>('All');

  useEffect(() => {
    fetch('http://localhost:3000/api/tables')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch tables');
        return res.json();
      })
      .then((data) => {
        setTables(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter Logic
  const filteredTables = tables.filter((table) => {
    const matchesEnv = envFilter === 'All' || table.environment === envFilter;
    const matchesPrice = 
      priceFilter === 'All' ? true : 
      priceFilter === 'Free' ? table.pricing.isFree : 
      !table.pricing.isFree;

    return matchesEnv && matchesPrice;
  });

  if (loading) return <div style={{ padding: '20px' }}>Loading Philly Pong spots...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🏓 Philly Pong</h1>
      <p>Discover places to play ping pong around Philadelphia.</p>

      {/* Filter Controls Bar */}
      <div style={filterContainerStyle}>
        <div>
          <label style={labelStyle}>Environment: </label>
          <select 
            value={envFilter} 
            onChange={(e) => setEnvFilter(e.target.value as any)}
            style={selectStyle}
          >
            <option value="All">All</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Indoor">Indoor</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Cost: </label>
          <select 
            value={priceFilter} 
            onChange={(e) => setPriceFilter(e.target.value as any)}
            style={selectStyle}
          >
            <option value="All">All</option>
            <option value="Free">Free Only</option>
            <option value="Paid">Paid / Venue</option>
          </select>
        </div>
      </div>

      {/* Table List */}
      {filteredTables.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '30px' }}>No tables match your selected filters.</p>
      ) : (
        filteredTables.map((table) => {
          const isExpanded = expandedId === table.id;

          return (
            <div key={table.id} style={cardStyle}>
              <h3 style={{ margin: '0 0 8px 0' }}>{table.name}</h3>
              <p style={{ margin: '4px 0' }}>📍 {table.location.neighborhood} • 🏢 {table.environment}</p>
              <p style={{ margin: '4px 0' }}>{table.pricing.isFree ? "🟢 Free Public Access" : "💰 Paid / Venue"}</p>

              {isExpanded && (
                <div style={detailsStyle}>
                  <p><strong>Address:</strong> {table.location.address}, {table.location.city}</p>
                  <p><strong>Setup:</strong> {table.tableCount} table(s) ({table.surfaceType})</p>
                  <p><strong>Net Quality:</strong> {table.netQuality}</p>
                  <p><strong>Pricing Info:</strong> {table.pricing.costDetails}</p>
                  <p><strong>Hours:</strong> {table.hours}</p>
                  <p><strong>Amenities:</strong> 
                    Paddles: {table.amenities.paddlesProvided ? "Yes" : "No"} | 
                    Balls: {table.amenities.ballsProvided ? "Yes" : "No"} | 
                    Drinks: {table.amenities.drinksAvailable ? "Yes" : "No"}
                  </p>
                  {table.notes && <p><em>Note: {table.notes}</em></p>}
                </div>
              )}

              <button 
                onClick={() => toggleExpand(table.id)}
                style={buttonStyle}
              >
                {isExpanded ? "Show Less" : "View Details"}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

// Styles
const filterContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '20px',
  backgroundColor: '#f8f9fa',
  padding: '12px 16px',
  borderRadius: '8px',
  marginBottom: '20px',
  border: '1px solid #e9ecef'
};

const labelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  fontSize: '0.9rem',
  marginRight: '6px'
};

const selectStyle: React.CSSProperties = {
  padding: '4px 8px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const cardStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '16px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const detailsStyle: React.CSSProperties = {
  marginTop: '12px',
  paddingTop: '12px',
  borderTop: '1px solid #eee',
  fontSize: '0.95rem',
  color: '#333'
};

const buttonStyle: React.CSSProperties = {
  marginTop: '12px',
  padding: '6px 12px',
  cursor: 'pointer',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px'
};

export default App;