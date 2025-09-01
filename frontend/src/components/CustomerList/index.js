import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Loader from '../Loader'
import './index.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({ city: '', state: '', pin_code: '' });
  const navigate = useNavigate();
  const [loading,setLoading]=useState(true)
  const fetchCustomers = useCallback(async () => {
    const query = new URLSearchParams({
      city: filters.city,
      state: filters.state,
      pin_code: filters.pin_code
    }).toString();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/customers?${query}`, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      setLoading(false)
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error.message);
    }
  }, [filters]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ city: '', state: '', pin_code: '' })
  };

  return (
    <>
  <Header />
  <div className="customer-list-container">
    <h2>Customer List</h2>

    <div className="filters">
      <input
        name="city"
        placeholder="City"
        value={filters.city}
        onChange={handleFilterChange}
      />
      <input
        name="state"
        placeholder="State"
        value={filters.state}
        onChange={handleFilterChange}
      />
      <input
        name="pin_code"
        placeholder="Pin Code"
        value={filters.pin_code}
        onChange={handleFilterChange}
      />
      <button onClick={clearFilters}>Clear</button>
    </div>

    <div className="scrollable-list">
     {loading?(<Loader />):(
       <div className="card-list">
        {customers.map(c => (
          <div key={c.id} className="customer-card" onClick={() => navigate(`/customers/${c.id}`)}>
            <h3><strong>Name:</strong> {c.first_name} {c.last_name}</h3>
            <p><strong>Email:</strong> {c.email || 'N/A'}</p>
            <p><strong>Addresses:</strong> {c.address_count || 0}</p>
            <p>Click to see full details</p>
          </div>
        ))}
      </div>
     )}
    </div>
  </div>
    </>

  );
};

export default CustomerList;
