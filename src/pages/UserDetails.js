import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import '../styles/userdetails.css';

function UserDetails() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phonePrefix: '+256',
    phoneNumber: '',
    additionalPhonePrefix: '+256',
    additionalPhoneNumber: '',
    address: '',
    additionalInfo: '',
    region: '',
    city: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Region and city options (unchanged)
  const regions = [
    { id: '', label: 'Select your region', cities: [] },
    { id: '2', label: 'Eastern Region', cities: [
      { id: '430', label: 'Bugembe' }, { id: '49', label: 'Bugiri' }, { id: '53', label: 'Busia' },
      { id: '434', label: 'Buwenge' }, { id: '56', label: 'Iganga' }, { id: '436', label: 'Irundu' },
      { id: '57', label: 'Jinja' }, { id: '437', label: 'Kagulu' }, { id: '60', label: 'Kamuli' },
      { id: '435', label: 'Kidera' }, { id: '64', label: 'Kumi' }, { id: '69', label: 'Mbale' },
      { id: '429', label: 'Mbikko' }, { id: '438', label: 'Namungalwa' }, { id: '73', label: 'Pallisa' },
      { id: '74', label: 'Serere' }, { id: '75', label: 'Sironko' }, { id: '76', label: 'Soroti' },
      { id: '77', label: 'Tororo' },
    ]},
    // ... (rest of regions unchanged)
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('You must be logged in to save details.');
      navigate('/login');
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, 'users', userId);
      const selectedPlan = localStorage.getItem('selectedPlan') || 'Basic';

      const userDetails = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: `${formData.phonePrefix}${formData.phoneNumber}`,
        additionalPhoneNumber: formData.additionalPhoneNumber ? `${formData.additionalPhonePrefix}${formData.additionalPhoneNumber}` : '',
        shippingAddress: {
          address: formData.address,
          additionalInfo: formData.additionalInfo,
          region: regions.find(r => r.id === formData.region)?.label || '',
          city: regions.find(r => r.id === formData.region)?.cities.find(c => c.id === formData.city)?.label || '',
        },
        plan: selectedPlan,
        startDate: new Date().toISOString().split('T')[0],
        nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        status: 'Active',
      };

      await setDoc(userDocRef, userDetails, { merge: true });
      console.log(`User details for ${userId} saved to Firestore`);
      navigate('/subscription');
    } catch (err) {
      setError('Failed to save your details: ' + err.message);
      console.error('Error saving user details:', err);
    }
  };

  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    setFormData({ ...formData, region: regionId, city: '' });
  };

  return (
    <div className="UserDetails">
      <Navbar />
      <section className="user-details-form">
        <h1>Customer Address</h1>
        <p>Please provide your shipping details below</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name</label>
            <input
              type="text"
              placeholder="e.g., John"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              placeholder="e.g., Doe"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Phone Number</label>
            <div className="phone-container">
              <select
                className="phone-prefix-select"
                value={formData.phonePrefix}
                onChange={(e) => setFormData({ ...formData, phonePrefix: e.target.value })}
              >
                <option value="+256">+256</option>
              </select>
              <input
                type="text"
                placeholder="e.g., 712345678 (9 digits)"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label>Additional Phone Number (Optional)</label>
            <div className="phone-container">
              <select
                className="phone-prefix-select"
                value={formData.additionalPhonePrefix}
                onChange={(e) => setFormData({ ...formData, additionalPhonePrefix: e.target.value })}
              >
                <option value="+256">+256</option>
              </select>
              <input
                type="text"
                placeholder="e.g., 798765432 (9 digits)"
                value={formData.additionalPhoneNumber}
                onChange={(e) => setFormData({ ...formData, additionalPhoneNumber: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              placeholder="e.g., Plot 12, Main Street"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Additional Information (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Near Kisaasi Market, Yellow Gate"
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
            />
          </div>
          <div>
            <label>Region</label>
            <select
              className="sel"
              id="fi-regionId"
              name="regionId"
              value={formData.region}
              onChange={handleRegionChange}
              required
            >
              {regions.map((region) => (
                <option key={region.id} value={region.id} disabled={region.id === ''}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>City</label>
            <select
              className="sel"
              id="fi-cityId"
              name="cityId"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            >
              <option value="" disabled>Select your city</option>
              {formData.region && regions.find(r => r.id === formData.region)?.cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.label}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="submit-button">Save Details</button>
        </form>
      </section>
      <footer className="UserDetails-footer">
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default UserDetails;