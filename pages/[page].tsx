import { GetServerSideProps } from 'next';
import { executeSQL, initializeDb } from '../lib/db';
import { autoRender, normalizeData } from '../lib/renderEngine';

interface PageProps {
  components: any[];
  pageName: string;
}

export default function DynamicPage({ components, pageName }: PageProps) {
  return (
    <div className="page-container">
      {components.map((component, index) => autoRender(component, index))}
      <style jsx>{`
        .page-container {
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Initialize database
    await initializeDb();
    
    const { page } = context.params as { page: string };
    
    // Execute SQL for the page
    const sqlResult = await executeSQL(page);
    
    // Ensure all data is serializable
    const sanitizeForJSON = (obj: any): any => {
      if (obj === undefined) return null;
      if (obj === null) return null;
      
      if (Array.isArray(obj)) {
        return obj.map(sanitizeForJSON);
      }
      
      if (typeof obj === 'object' && obj !== null) {
        const sanitized: Record<string, any> = {};
        for (const [key, value] of Object.entries(obj)) {
          sanitized[key] = sanitizeForJSON(value);
        }
        return sanitized;
      }
      
      return obj;
    };
    
    const components = Array.isArray(sqlResult) 
      ? sanitizeForJSON(sqlResult) 
      : sanitizeForJSON(normalizeData(sqlResult));
    
    return {
      props: {
        components,
        pageName: page
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        components: [],
        pageName: context.params?.page || 'error',
        error: (error as Error).message
      }
    };
  }
}
