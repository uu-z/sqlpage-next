import React, { useState } from 'react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[] | null;
  defaultValue?: string | number | boolean | null;
}

interface FormProps {
  title?: string;
  fields: FormField[];
  submitLabel?: string;
  action?: string;
  method?: 'GET' | 'POST';
}

const FormComponent: React.FC<FormProps> = ({
  title = '',
  fields = [],
  submitLabel = 'Submit',
  action = '#',
  method = 'POST'
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    // In a real app, you would handle the form submission here
    alert('Form submitted! Check console for data.');
  };

  // Ensure fields is an array
  const safeFields = Array.isArray(fields) ? fields : [];

  return (
    <div className="form-container">
      {title && <h3 className="form-title">{title}</h3>}
      <form onSubmit={handleSubmit} action={action} method={method}>
        {safeFields.map((field, index) => (
          <div key={index} className="form-field">
            <label htmlFor={field.name}>{field.label}</label>
            
            {field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                required={field.required}
                onChange={handleChange}
                defaultValue={field.defaultValue as string || ''}
              >
                {Array.isArray(field.options) && field.options.map((option, optIndex) => (
                  <option key={optIndex} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                placeholder={field.placeholder || ''}
                required={field.required}
                onChange={handleChange}
                defaultValue={field.defaultValue as string || ''}
              />
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                id={field.name}
                name={field.name}
                required={field.required}
                onChange={handleChange}
                defaultChecked={!!field.defaultValue}
              />
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder || ''}
                required={field.required}
                onChange={handleChange}
                defaultValue={field.defaultValue as string || ''}
              />
            )}
          </div>
        ))}
        <button type="submit" className="submit-button">
          {submitLabel}
        </button>
      </form>
      <style jsx>{`
        .form-container {
          background-color: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin: 20px 0;
        }
        .form-title {
          margin-top: 0;
          margin-bottom: 24px;
        }
        .form-field {
          margin-bottom: 16px;
        }
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }
        input[type="text"],
        input[type="email"],
        input[type="password"],
        input[type="number"],
        select,
        textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        input[type="checkbox"] {
          margin-right: 8px;
        }
        textarea {
          min-height: 100px;
          resize: vertical;
        }
        .submit-button {
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 16px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .submit-button:hover {
          background-color: #0060df;
        }
      `}</style>
    </div>
  );
};

export default FormComponent;
