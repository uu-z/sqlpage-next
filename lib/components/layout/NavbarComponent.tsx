import React from 'react';
import Link from 'next/link';

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

interface NavbarProps {
  title: string;
  links: NavLink[];
  logo?: string;
}

const NavbarComponent: React.FC<NavbarProps> = ({ title, links, logo }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          {logo && <img src={logo} alt={title} className="navbar-logo" />}
          <span className="navbar-title">{title}</span>
        </div>
        <ul className="navbar-links">
          {links.map((link, index) => (
            <li key={index} className={`navbar-item ${link.active ? 'active' : ''}`}>
              <Link href={link.href}>
                <span className="navbar-link">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        .navbar {
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          height: 64px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
        }
        .navbar-logo {
          height: 32px;
          margin-right: 12px;
        }
        .navbar-title {
          font-size: 18px;
          font-weight: 600;
        }
        .navbar-links {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .navbar-item {
          margin-left: 24px;
        }
        .navbar-link {
          color: #333;
          text-decoration: none;
          font-size: 16px;
          cursor: pointer;
        }
        .navbar-item.active .navbar-link {
          color: #0070f3;
          font-weight: 500;
        }
        .navbar-link:hover {
          color: #0070f3;
        }
      `}</style>
    </nav>
  );
};

export default NavbarComponent;
