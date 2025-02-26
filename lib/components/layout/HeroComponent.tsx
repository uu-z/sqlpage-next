import React from 'react';

interface HeroProps {
  headline: string;
  subheadline: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

const HeroComponent: React.FC<HeroProps> = ({
  headline,
  subheadline,
  backgroundImage,
  ctaText,
  ctaLink
}) => {
  return (
    <div 
      className="hero" 
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <div className="hero-content">
        <h1 className="hero-headline">{headline}</h1>
        <p className="hero-subheadline">{subheadline}</p>
        {ctaText && ctaLink && (
          <a href={ctaLink} className="hero-cta">
            {ctaText}
          </a>
        )}
      </div>
      <style jsx>{`
        .hero {
          background-color: #f5f5f5;
          background-size: cover;
          background-position: center;
          padding: 80px 24px;
          text-align: center;
          position: relative;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          display: ${backgroundImage ? 'block' : 'none'};
        }
        .hero-content {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
          color: ${backgroundImage ? 'white' : 'inherit'};
        }
        .hero-headline {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .hero-subheadline {
          font-size: 18px;
          margin-bottom: 32px;
        }
        .hero-cta {
          display: inline-block;
          background-color: #0070f3;
          color: white;
          padding: 12px 24px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .hero-cta:hover {
          background-color: #0060df;
        }
      `}</style>
    </div>
  );
};

export default HeroComponent;
