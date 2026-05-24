import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container footer-container">
        <p className="footer-text">
          &copy; {currentYear} Holy Faith BCP Church. All rights reserved.
        </p>
        <p className="footer-text" style={{ fontSize: '0.8rem' }}>
          All are welcome at Holy Faith BCP Church &bull; Bacolod City, Philippines &bull; <Link to="/login">Admin Login</Link>
        </p>
      </div>
    </footer>
  );
}
