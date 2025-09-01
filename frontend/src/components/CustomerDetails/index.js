import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Header';
import Loader from '../Loader'
import './index.css';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading,setLoading]=useState(true)
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/customers/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomer(data);
      }
      setLoading(false)
    };
    fetchCustomer();
  }, [id]);

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this customer?');
    if (confirm) {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/customers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/customers');
    }
  };

  const handleEdit = () => {
    localStorage.setItem('edit_customer', JSON.stringify(customer));
    navigate('/customers/new');
  };

  return (
    <>
      <Header />
      <div className="customer-details-container">
        {loading?(<Loader />):(
          <div className="customer-card">
          <h2>{customer.first_name} {customer.last_name}</h2>
          <p>Phone: {customer.phone}</p>
          <p>Email: {customer.email}</p>
          <p>Only One Address: {customer.only_one_address ? 'Yes' : 'No'}</p>

          <h3>Addresses</h3>
          <ul>
            {customer.addresses.map(addr => (
              <li key={addr.id}>
                {addr.address_line}, {addr.city}, {addr.state} - {addr.pin_code}
              </li>
            ))}
          </ul>

          <div className="actions">
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>
        )}
      </div>
    </>
  );
};

export default CustomerDetails;
