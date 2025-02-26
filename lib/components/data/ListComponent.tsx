import React from 'react';

interface ListItem {
  title: string;
  description?: string;
  image?: string;
  link?: string;
  tags?: string[];
}

interface ListProps {
  items: ListItem[];
  title?: string;
}

const ListComponent: React.FC<ListProps> = ({ items, title }) => {
  return (
    <div className="list-container">
      {title && <h3 className="list-title">{title}</h3>}
      <ul className="list">
        {items.map((item, index) => (
          <li key={index} className="list-item">
            {item.image && (
              <div className="item-image">
                <img src={item.image} alt={item.title} />
              </div>
            )}
            <div className="item-content">
              <h4 className="item-title">
                {item.link ? (
                  <a href={item.link}>{item.title}</a>
                ) : (
                  item.title
                )}
              </h4>
              {item.description && (
                <p className="item-description">{item.description}</p>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className="item-tags">
                  {item.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .list-container {
          margin: 20px 0;
        }
        .list-title {
          margin-bottom: 16px;
        }
        .list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .list-item {
          display: flex;
          padding: 16px;
          border-bottom: 1px solid #eee;
        }
        .item-image {
          flex-shrink: 0;
          width: 60px;
          height: 60px;
          margin-right: 16px;
        }
        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
        }
        .item-content {
          flex-grow: 1;
        }
        .item-title {
          margin: 0 0 8px 0;
        }
        .item-title a {
          color: #0070f3;
          text-decoration: none;
        }
        .item-title a:hover {
          text-decoration: underline;
        }
        .item-description {
          margin: 0 0 8px 0;
          color: #666;
        }
        .item-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tag {
          background-color: #f0f0f0;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default ListComponent;
