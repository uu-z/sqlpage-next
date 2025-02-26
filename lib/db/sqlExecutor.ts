import path from 'path';
import fs from 'fs';
import { dbAll } from './connection';
import { processComponentResults } from './resultProcessor';

// Execute SQL from file
export async function executeSQL(sqlFilePath: string) {
  const fullPath = path.join(process.cwd(), 'lib/sql/pages', `${sqlFilePath}.sql`);
  
  try {
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      throw new Error(`SQL file not found: ${fullPath}`);
    }
    
    const sqlContent = fs.readFileSync(fullPath, 'utf8');
    
    // Split SQL by component markers
    const componentSections = sqlContent.split(/--\s*@component\s+/i);
    
    // If no component markers, treat as a single query
    if (componentSections.length === 1) {
      return await executeSingleQuery(sqlContent);
    } 
    // Process multiple components
    else {
      return await executeMultipleComponents(componentSections);
    }
  } catch (error) {
    console.error('SQL execution error:', error);
    return { error: (error as Error).message };
  }
}

async function executeSingleQuery(sqlContent: string) {
  const sqlStatements = sqlContent.split(';').filter(stmt => stmt.trim());
  
  const results = [];
  
  // Execute each SQL statement
  for (const stmt of sqlStatements) {
    if (stmt.trim()) {
      const result = await dbAll(stmt);
      if (result.length > 0) {
        results.push(result);
      }
    }
  }
  
  // Return schema and data
  if (results.length >= 2) {
    return {
      schema: results[0],
      data: results[1]
    };
  }
  
  return { data: results[0] || [] };
}

async function executeMultipleComponents(componentSections: string[]) {
  const results = [];
  
  // First section is empty (before first @component)
  for (let i = 1; i < componentSections.length; i++) {
    const section = componentSections[i];
    const firstLineBreak = section.indexOf('\n');
    
    // Extract component type from first line
    const componentType = section.substring(0, firstLineBreak).trim();
    const componentSQL = section.substring(firstLineBreak).trim();
    
    // Split into statements
    const statements = componentSQL.split(';').filter(stmt => stmt.trim());
    
    // Execute statements for this component
    const componentResults = [];
    for (const stmt of statements) {
      if (stmt.trim()) {
        try {
          const result = await dbAll(stmt);
          if (result.length > 0) {
            componentResults.push(result);
          }
        } catch (error) {
          console.error(`Error executing SQL for ${componentType}:`, error);
        }
      }
    }
    
    // Process results based on component type
    if (componentResults.length > 0) {
      const componentData = processComponentResults(componentType, componentResults);
      results.push(componentData);
    }
  }
  
  return results;
}
