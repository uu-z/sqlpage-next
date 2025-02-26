import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <h1>SQL-Driven UI Demo</h1>
        <p className="subtitle">Inspired by SQLPage</p>
      </header>
      
      <section className="intro">
        <h2>What is SQL-Driven UI?</h2>
        <p>
          SQL-Driven UI is a paradigm where your database queries directly determine 
          what UI components are rendered and how they behave. This approach eliminates 
          the need to write UI code for each new page or feature.
        </p>
      </section>
      
      <section className="features">
        <h2>Key Features</h2>
        <ul>
          <li>Zero UI coding - just write SQL</li>
          <li>Automatic component selection based on data structure</li>
          <li>Server-side rendering for optimal performance</li>
          <li>Type mapping from SQL to UI components</li>
        </ul>
      </section>
      
      <section className="demo-pages">
        <h2>Demo Pages</h2>
        <div className="card-grid">
          <Link href="/dashboard">
            <div className="card">
              <h3>Dashboard</h3>
              <p>View metrics, charts, and tables</p>
            </div>
          </Link>
          <Link href="/users">
            <div className="card">
              <h3>Users</h3>
              <p>User management with tables and forms</p>
            </div>
          </Link>
          <Link href="/products">
            <div className="card">
              <h3>Products</h3>
              <p>Product catalog with lists and charts</p>
            </div>
          </Link>
        </div>
      </section>
      
      <style jsx>{`
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .subtitle {
          color: #666;
          font-size: 1.2rem;
        }
        .intro, .features {
          margin-bottom: 40px;
        }
        h2 {
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        .card {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .card h3 {
          margin-top: 0;
          color: #0070f3;
        }
        .card p {
          margin-bottom: 0;
          color: #666;
        }
      `}</style>
    </div>
  );
}
