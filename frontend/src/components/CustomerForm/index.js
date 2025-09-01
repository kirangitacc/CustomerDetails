import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Loader from '../Loader';
import './index.css';

const CustomerForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    id: null,
    first_name: '', last_name: '', phone: '', email: '',
    addresses: [{ address_line: '', city: '', state: '', pin_code: '' }]
  });

  useEffect(() => {
    const editData = localStorage.getItem('edit_customer');
    if (editData) {
      const parsed = JSON.parse(editData);
      setForm({
        id: parsed.id,
        first_name: parsed.first_name,
        last_name: parsed.last_name,
        phone: parsed.phone,
        email: parsed.email,
        addresses: parsed.addresses
      });
      localStorage.removeItem('edit_customer');
    }
    setLoading(false);
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (index, field, value) => {
    const updated = [...form.addresses];
    updated[index][field] = value;
    setForm({ ...form, addresses: updated });
  };

  const addAddress = () => {
    setForm({
      ...form,
      addresses: [...form.addresses, { address_line: '', city: '', state: '', pin_code: '' }]
    });
  };

  const removeAddress = (index) => {
    const updated = form.addresses.filter((_, i) => i !== index);
    setForm({ ...form, addresses: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const isEdit = !!form.id;
    const url = isEdit
      ? `https://customerdetails-ctv2.onrender.com/customers/${form.id}`
      : 'https://customerdetails-ctv2.onrender.com/customers';

    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      setForm({
        id: null,
        first_name: '', last_name: '', phone: '', email: '',
        addresses: [{ address_line: '', city: '', state: '', pin_code: '' }]
      });
      alert('Customer added');
      navigate('/customers');
    } else {
      alert('Error submitting form');
    }
  };

  return (
    <>
      <Header />
      <div className="customer-form">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="form-container">
              <div className="left-form">
                <h2>Customer Details</h2>
                <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
                <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required />
                <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
              </div>

              <div className="right-form">
               <div className='add-con'>
                 <h3>Addresses</h3>
                 <button className="address" type="button" onClick={addAddress}>Add Address</button>
               </div>
                <div className="address-scroll">
                  {form.addresses.map((addr, i) => (
                    <div key={i} className="address-block">
                      <input placeholder="Address Line" value={addr.address_line} onChange={e => handleAddressChange(i, 'address_line', e.target.value)} required />
                      <input placeholder="City" value={addr.city} onChange={e => handleAddressChange(i, 'city', e.target.value)} required />
                      <input placeholder="State" value={addr.state} onChange={e => handleAddressChange(i, 'state', e.target.value)} required />
                      <input placeholder="Pin Code" value={addr.pin_code} onChange={e => handleAddressChange(i, 'pin_code', e.target.value)} required />
                      <button type="button" onClick={() => removeAddress(i)}>Cancel</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
         <button className='submit-btn' type="submit" onClick={handleSubmit}>Submit</button>
      </div>
    </>
  );
};

export default CustomerForm;
