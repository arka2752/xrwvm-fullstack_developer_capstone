import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dealers.css';

const US_STATES = [
  'All', 'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI',
  'MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
  'OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA',
  'WA','WV','WI','WY',
];

export default function Dealers({ user }) {
  const [dealers, setDealers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const url = selectedState === 'All'
      ? '/djangoapp/get_dealerships'
      : `/djangoapp/get_dealerships/${selectedState}`;

    setLoading(true);
    fetch(url, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        setDealers(data.dealers || []);
        setError('');
      })
      .catch(() => setError('Could not load dealerships. Please try again.'))
      .finally(() => setLoading(false));
  }, [selectedState]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(dealers); return; }
    const q = search.toLowerCase();
    setFiltered(dealers.filter((d) =>
      d.full_name?.toLowerCase().includes(q) ||
      d.city?.toLowerCase().includes(q) ||
      d.state?.toLowerCase().includes(q)
    ));
  }, [search, dealers]);

  return (
    <div className="dealers-page page-section">
      <div className="container">
        {/* Header */}
        <div className="dealers-hero">
          <p className="section-tag">🗺️ Nationwide Network</p>
          <h1 className="section-title">Find a <span className="text-gradient">Dealership</span></h1>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>
            Browse all Best Cars dealerships across the United States.
          </p>
        </div>

        {/* Filters */}
        <div className="dealers-filters card">
          <div className="filter-group">
            <label className="form-label" htmlFor="search-input">🔍 Search</label>
            <input
              id="search-input"
              type="text"
              className="form-control"
              placeholder="Search by name, city, or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="form-label" htmlFor="state-select">🏛️ Filter by State</label>
            <select
              id="state-select"
              className="form-control"
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setSearch(''); }}
            >
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All States' : s}</option>
              ))}
            </select>
          </div>
          <div className="filter-count">
            <span>{filtered.length} {filtered.length === 1 ? 'dealer' : 'dealers'} found</span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="dealers-empty">
            <span>🏪</span>
            <p>No dealerships found. Try a different state or search term.</p>
          </div>
        ) : (
          <div className="grid-3 dealers-grid">
            {filtered.map((dealer) => (
              <div key={dealer.id} className="dealer-card card">
                <div className="dealer-card-header">
                  <span className="dealer-state-badge">{dealer.st}</span>
                </div>
                <h3 className="dealer-name">{dealer.full_name} (ID: {dealer.id})</h3>
                <p className="dealer-city">📍 {dealer.city}, {dealer.state}</p>
                <p className="dealer-address text-muted">{dealer.address} • ZIP: {dealer.zip}</p>
                <Link to={`/dealer/${dealer.id}`} className="dealer-cta">View Reviews →</Link>
                {user && (
                  <Link
                    to={`/postreview/${dealer.id}`}
                    className="dealer-cta"
                    style={{ marginTop: '8px', display: 'block', color: '#a78bfa' }}
                  >
                    Review Dealer
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}