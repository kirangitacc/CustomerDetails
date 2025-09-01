import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import Loader from '../Loader';
import './index.css';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
};

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`https://customerdetails-ctv2.onrender.com/user/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setUserDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <>
      <Header />
      {
        (() => {
          switch (true) {
            case loading:
              return <div className="loadingu"><Loader /></div>;
            case !!error:
              return <div className="erroru">{error}</div>;
            default:
            return (
              <div className="profile-cardu">
                <div className="profile-avataru">
                  {userDetails.username?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-detailsu">
                  <div className="profile-rowu">
                    <label>Username:</label>
                    <span>{userDetails.username}</span>
                  </div>
                  <div className="profile-rowu">
                    <label>Email:</label>
                    <span>{userDetails.email}</span>
                  </div>
                  <div className="profile-rowu">
                    <label>Gender:</label>
                    <span>{userDetails.gender}</span>
                  </div>
                  <div className="profile-rowu">
                    <label>Phone:</label>
                    <span>{userDetails.phone}</span>
                  </div>
                  <div className="profile-rowu">
                    <label>Address:</label>
                    <span>{userDetails.address}</span>
                  </div>
                </div>
                <div className="button-containeru">
                  <Link to="/" onClick={handleLogout}>
                    <button className="logout-btnu">Logout</button>
                  </Link>
                  <Link to="/customers">
                    <button className="home-btnu">Home</button>
                  </Link>
                </div>
              </div>
            );
         }
        })()
      }
    </>
  );
};

export default Profile;
