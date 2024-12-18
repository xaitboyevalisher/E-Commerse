import React from "react";
import {
  FaUserCircle,
  FaBox,
  FaMapMarkerAlt,
  FaCreditCard,
  FaEnvelope,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <div className="profile-header" style={{ paddingTop: "99px" }}>
        <img src="./profile.png" alt="Profile" className="profile-image" />
        <h2 className="profile-email">Katty Berry</h2>
        <p className="profile-email">user@example.com</p>
      </div>
      <div className="profile-menu">
        <div className="profile-menu-item">
          <FaUserCircle className="profile-icon" />
          <Link to="/my-profile" style={{ color: "black" }}>
            My Profile
          </Link>
        </div>
        <div className="profile-menu-item">
          <FaBox className="profile-icon" />
          <Link to="/my-orders" style={{ color: "black" }}>
            My Orders
          </Link>
        </div>
        <div className="profile-menu-item">
          <FaMapMarkerAlt className="profile-icon" />
          <Link to="/location" style={{ color: "black" }}>
            Delivery Address
          </Link>
        </div>
        <div className="profile-menu-item">
          <FaCreditCard className="profile-icon" />
          <Link to="/payment" style={{ color: "black" }}>
            Payments Methods
          </Link>
        </div>
        <div className="profile-menu-item">
          <FaEnvelope className="profile-icon" />
          <Link to="/contact" style={{ color: "black" }}>
            Contact Us
          </Link>
        </div>
        <div className="profile-menu-item">
          <FaCog className="profile-icon" />
          <Link to="/settings" style={{ color: "black" }}>
            Settings
          </Link>
        </div>
        <div className="profile-menu-item" style={{ marginBottom: "64px" }}>
          <FaQuestionCircle className="profile-icon" />
          <Link to="/chat" style={{ color: "black" }}>
            Help & FAQ
          </Link>
        </div>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt /> Log out
      </button>
    </div>
  );
}

export default Profile;
