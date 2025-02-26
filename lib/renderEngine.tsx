import React from 'react';
import TableComponent from './components/data/TableComponent';
import CardComponent from './components/data/CardComponent';
import ChartComponent from './components/data/ChartComponent';
import FormComponent from './components/input/FormComponent';
import MetricComponent from './components/data/MetricComponent';
import ListComponent from './components/data/ListComponent';
import NavbarComponent from './components/layout/NavbarComponent';
import HeroComponent from './components/layout/HeroComponent';

// Component mapping system
interface ComponentMatcher {
  match: (data: any) => boolean;
  component: React.ComponentType<any>;
}

interface ComponentMap {
  [key: string]: ComponentMatcher;
}

const componentMap: ComponentMap = {
  // Data display components
  table: {
    match: (data) => 
      data.component === 'table' || 
      (data.schema && data.data && Array.isArray(data.data)),
    component: TableComponent
  },
  card: {
    match: (data) => 
      data.component === 'card' || 
      (data.title && (data.content || data.description)),
    component: CardComponent
  },
  chart: {
    match: (data) => 
      data.component === 'chart' || 
      (data.type && data.labels && data.datasets),
    component: ChartComponent
  },
  metric: {
    match: (data) => 
      data.component === 'metric' || 
      (data.value !== undefined && data.label),
    component: MetricComponent
  },
  list: {
    match: (data) => 
      data.component === 'list' || 
      (data.items && Array.isArray(data.items)),
    component: ListComponent
  },
  
  // Input components
  form: {
    match: (data) => 
      data.component === 'form' || 
      (data.fields && Array.isArray(data.fields)),
    component: FormComponent
  },
  
  // Layout components
  navbar: {
    match: (data) => 
      data.component === 'navbar' || 
      (data.links && Array.isArray(data.links)),
    component: NavbarComponent
  },
  hero: {
    match: (data) => 
      data.component === 'hero' || 
      (data.headline && data.subheadline),
    component: HeroComponent
  },
  
  // Fallback component
  fallback: {
    match: () => true,
    component: ({ data }: { data: any }) => (
      <div className="fallback">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    )
  }
};

export function autoRender(data: any, index: number) {
  // If component type is explicitly specified
  if (data.component && componentMap[data.component]) {
    const { component } = componentMap[data.component];
    return React.createElement(component, { ...data, key: index });
  }
  
  // Otherwise try to infer component type from data structure
  const matchedEntry = Object.entries(componentMap)
    .find(([_, { match }]) => match(data));
  
  const [type, { component }] = matchedEntry || ['fallback', componentMap.fallback];
  
  return React.createElement(component, { ...data, key: index });
}

export function normalizeData(sqlResult: any) {
  if (sqlResult.error) {
    return [{ error: sqlResult.error }];
  }
  
  // If we have multiple result sets
  if (Array.isArray(sqlResult)) {
    return sqlResult;
  }
  
  // If we have schema and data, format as table data
  if (sqlResult.schema && sqlResult.data) {
    return [{
      component: 'table',
      schema: sqlResult.schema,
      data: sqlResult.data
    }];
  }
  
  // Return as is if it's already an array
  if (Array.isArray(sqlResult)) {
    return sqlResult;
  }
  
  // Wrap in array if it's a single object
  return [sqlResult];
}
