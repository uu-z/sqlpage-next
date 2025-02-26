import { GetServerSideProps } from "next";
import { executeSQL, initializeDb } from "../lib/db";
import { autoRender, normalizeData } from "../lib/renderEngine";

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

    // Convert SQL data to JSON-safe format
    const sanitizeForJSON = (obj: any): any => {
      // Handle undefined
      if (obj === undefined) return null;

      // Handle other basic types
      if (obj === null) return null;
      if (typeof obj !== "object") {
        if (typeof obj === "bigint") return obj.toString();
        return obj;
      }
      if (obj instanceof Date) return obj.toISOString();

      // Handle arrays
      if (Array.isArray(obj)) {
        return obj.map(sanitizeForJSON);
      }

      // Handle objects
      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (!key.startsWith("_")) {
          const sanitized = sanitizeForJSON(value);
          // Only include non-undefined values
          if (sanitized !== undefined) {
            result[key] = sanitized;
          }
        }
      }
      return result;
    };

    const components = Array.isArray(sqlResult)
      ? sanitizeForJSON(sqlResult)
      : sanitizeForJSON(normalizeData(sqlResult));

    return {
      props: {
        components,
        pageName: page,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        components: [],
        pageName: context.params?.page || "error",
        error: (error as Error).message,
      },
    };
  }
};
