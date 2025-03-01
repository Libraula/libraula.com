import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation for payment confirmation check
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
  const [isPostPayment, setIsPostPayment] = useState(false); // Track if coming from payment
  const navigate = useNavigate();
  const location = useLocation();

  // Check if coming from payment confirmation
  useEffect(() => {
    const fromPayment = location.state?.fromPayment || false;
    setIsPostPayment(fromPayment);
  }, [location]);

  // Region and city options (unchanged)
  const regions = [
    { id: '', label: 'Please select', cities: [] },
    { id: '2', label: 'Eastern Region', cities: [
      { id: '430', label: 'Bugembe' }, { id: '49', label: 'Bugiri' }, { id: '53', label: 'Busia' },
      { id: '434', label: 'Buwenge' }, { id: '56', label: 'Iganga' }, { id: '436', label: 'Irundu' },
      { id: '57', label: 'Jinja' }, { id: '437', label: 'Kagulu' }, { id: '60', label: 'Kamuli' },
      { id: '435', label: 'Kidera' }, { id: '64', label: 'Kumi' }, { id: '69', label: 'Mbale' },
      { id: '429', label: 'Mbikko' }, { id: '438', label: 'Namungalwa' }, { id: '73', label: 'Pallisa' },
      { id: '74', label: 'Serere' }, { id: '75', label: 'Sironko' }, { id: '76', label: 'Soroti' },
      { id: '77', label: 'Tororo' },
    ]},
    { id: '8', label: 'Entebbe Area', cities: [
      { id: '257', label: 'Abayita Ababiri' }, { id: '408', label: 'Akright City - Entebbe' },
      { id: '258', label: 'Banga' }, { id: '259', label: 'Bugonga' }, { id: '260', label: 'Entebbe Market Area' },
      { id: '261', label: 'Entebbe Town' }, { id: '262', label: 'Katabi' }, { id: '362', label: 'Kisubi' },
      { id: '360', label: 'Kitala' }, { id: '402', label: 'Kitende' }, { id: '263', label: 'Kitoro' },
      { id: '264', label: 'Kitubulu' }, { id: '308', label: 'Kiwafu - entebbe' }, { id: '266', label: 'Lunyo' },
      { id: '267', label: 'Manyago' }, { id: '268', label: 'Nakiwogo' }, { id: '361', label: 'Namulanda' },
      { id: '269', label: 'Nkumba' }, { id: '270', label: 'Nsamizi' },
    ]},
    { id: '5', label: 'Kampala Region', cities: [
      { id: '213', label: 'Bakuli' }, { id: '172', label: 'Banda' }, { id: '174', label: 'Bugolobi' },
      { id: '176', label: 'Bukasa' }, { id: '197', label: 'Bukesa' }, { id: '146', label: 'Bukoto' },
      { id: '236', label: 'Bulenga' }, { id: '239', label: 'Bunamwaya' }, { id: '177', label: 'Bunga' },
      { id: '192', label: 'Busega' }, { id: '153', label: 'Butabika' }, { id: '237', label: 'Buwate' },
      { id: '178', label: 'Buziga' }, { id: '218', label: 'Bwaise' }, { id: '156', label: 'Bweyogerere' },
      { id: '231', label: 'Central Business District' }, { id: '310', label: 'Down Town Kampala' },
      { id: '179', label: 'Ggaba' }, { id: '180', label: 'Kabalagala' }, { id: '162', label: 'Kabojja' },
      { id: '214', label: 'Kabowa' }, { id: '191', label: 'Kabuusu' }, { id: '158', label: 'Kagoma' },
      { id: '219', label: 'Kalerwe' }, { id: '142', label: 'Kampala Industrial Area' }, { id: '139', label: 'Kamwokya' },
      { id: '181', label: 'Kansanga' }, { id: '224', label: 'Kanyanya' }, { id: '194', label: 'Kasubi' },
      { id: '182', label: 'Katwe' }, { id: '215', label: 'Kawaala' }, { id: '328', label: 'kawanda / Kagoma' },
      { id: '220', label: 'Kawempe' }, { id: '212', label: 'Kazo' }, { id: '241', label: 'Kibiri' },
      { id: '183', label: 'Kibuli' }, { id: '184', label: 'Kibuye' }, { id: '252', label: 'Kigowa' },
      { id: '225', label: 'Kikaya' }, { id: '254', label: 'Kikoni' }, { id: '253', label: 'Kinawataka' },
      { id: '238', label: 'Kira' }, { id: '155', label: 'Kireka' }, { id: '159', label: 'Kirinya' },
      { id: '152', label: 'Kirombe' }, { id: '221', label: 'Kisaasi' }, { id: '140', label: 'Kisenyi' },
      { id: '244', label: 'Kisugu' }, { id: '251', label: 'Kitante' }, { id: '195', label: 'Kitebi' },
      { id: '144', label: 'Kitintale' }, { id: '154', label: 'Kiwatule' }, { id: '138', label: 'Kololo' },
      { id: '168', label: 'Komamboga' }, { id: '169', label: 'Kulambiro' }, { id: '161', label: 'Kyaliwajjala' },
      { id: '170', label: 'Kyambogo' }, { id: '145', label: 'Kyanja' }, { id: '222', label: 'Kyebando' },
      { id: '235', label: 'Kyengera' }, { id: '163', label: 'Lubowa' }, { id: '216', label: 'Lubya' },
      { id: '164', label: 'Lugala' }, { id: '223', label: 'Lugoba' }, { id: '143', label: 'Lugogo' },
      { id: '200', label: 'Lusaze' }, { id: '242', label: 'Luwafu' }, { id: '151', label: 'Luzira' },
      { id: '165', label: 'Lweza' }, { id: '157', label: 'Maganjo' }, { id: '226', label: 'Makerere' },
      { id: '185', label: 'Makindye' }, { id: '201', label: 'Masanafu' }, { id: '247', label: 'Mbalwa' },
      { id: '147', label: 'Mbuya' }, { id: '229', label: 'Mengo' }, { id: '246', label: 'Mpanga' },
      { id: '227', label: 'Mpererwe' }, { id: '228', label: 'Mulago' }, { id: '186', label: 'Munyonyo' },
      { id: '203', label: 'Mutundwe' }, { id: '148', label: 'Mutungo' }, { id: '187', label: 'Muyenga' },
      { id: '249', label: 'Naalya' }, { id: '173', label: 'Nabisunsa' }, { id: '370', label: 'Nabweru' },
      { id: '171', label: 'Naguru' }, { id: '166', label: 'Najjanankumbi' }, { id: '167', label: 'Najjera' },
      { id: '136', label: 'Nakasero' }, { id: '149', label: 'Nakawa' }, { id: '141', label: 'Nakivubo' },
      { id: '208', label: 'Nalukolongo' }, { id: '314', label: 'Namasuba' }, { id: '196', label: 'Namirembe' },
      { id: '311', label: 'Namugongo' }, { id: '199', label: 'Namungoona' }, { id: '188', label: 'Namuwongo' },
      { id: '209', label: 'Nankulabye' }, { id: '233', label: 'Nansana' }, { id: '205', label: 'Nateete' },
      { id: '206', label: 'Ndeeba' }, { id: '189', label: 'Nsambya' }, { id: '150', label: 'Ntinda' },
      { id: '217', label: 'Nyanama' }, { id: '137', label: 'Old Kampala' }, { id: '204', label: 'Rubaga' },
      { id: '190', label: 'Salaama' }, { id: '248', label: 'Seguku' }, { id: '312', label: 'Sonde' },
      { id: '207', label: 'Wakaliga' }, { id: '211', label: 'Wandegeya' }, { id: '210', label: 'Wankulukuku' },
      { id: '230', label: 'Zana' },
    ]},
    { id: '3', label: 'Northern Region', cities: [
      { id: '80', label: 'Adjumani' }, { id: '87', label: 'Arua' }, { id: '89', label: 'Gulu' },
      { id: '427', label: 'Kalongo' }, { id: '91', label: 'Kitgum' }, { id: '92', label: 'Koboko' },
      { id: '96', label: 'Lira' }, { id: '99', label: 'Moyo' }, { id: '102', label: 'Nebbi' },
      { id: '105', label: 'Oyam' }, { id: '106', label: 'Pader' }, { id: '428', label: 'Patongo' },
    ]},
    { id: '7', label: 'Rest Of Central Region', cities: [
      { id: '431', label: 'Busunju' }, { id: '432', label: 'Bwikwe' }, { id: '294', label: 'Gayaza' },
      { id: '295', label: 'Kajjansi' }, { id: '433', label: 'Kalagi' }, { id: '297', label: 'Kasangati' },
      { id: '277', label: 'Kayunga' }, { id: '278', label: 'Kiboga' }, { id: '299', label: 'Kikajjo' },
      { id: '301', label: 'lugazi' }, { id: '280', label: 'Luweero' }, { id: '283', label: 'Masaka' },
      { id: '302', label: 'Matugga' }, { id: '284', label: 'Mityana' }, { id: '285', label: 'Mpigi' },
      { id: '286', label: 'Mubende' }, { id: '417', label: 'Mukono / Town Area' }, { id: '398', label: 'Namanve' },
      { id: '304', label: 'Nsangi' }, { id: '306', label: 'Nsasa' }, { id: '307', label: 'Seeta' },
      { id: '292', label: 'Wakiso' }, { id: '305', label: 'wampewo' },
    ]},
    { id: '4', label: 'Western Region', cities: [
      { id: '113', label: 'Bushenyi' }, { id: '405', label: 'Bweyale' }, { id: '114', label: 'Hoima' },
      { id: '115', label: 'Ibanda' }, { id: '117', label: 'Kabale' }, { id: '315', label: 'Kabarole (Fort Portal)' },
      { id: '387', label: 'Kagadi' }, { id: '121', label: 'Kasese' }, { id: '125', label: 'Kisoro' },
      { id: '126', label: 'Kyegegwa' }, { id: '127', label: 'Kyenjojo' }, { id: '128', label: 'Masindi' },
      { id: '129', label: 'Mbarara' },
    ]},
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
      navigate('/home'); // Redirect to home after saving details
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
        <h1>{isPostPayment ? "Welcome to the Libraula Family!" : "Customer Address"}</h1>
        <p>
          {isPostPayment
            ? "Thank you for joining us! We’re thrilled to have you on board. To ensure your books arrive right at your doorstep, please take a moment to share your shipping details below. Let’s get started!"
            : "Please provide your shipping details below to ensure seamless delivery of your books."}
        </p>
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
          <button type="submit" className="submit-button">
            {isPostPayment ? "Complete Your Setup" : "Save Details"}
          </button>
        </form>
      </section>
      <footer className="UserDetails-footer">
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default UserDetails;