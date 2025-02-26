// Process SQL results into component data
export function processComponentResults(componentType: string, componentResults: any[][]) {
  // Add component type to the result
  const componentData: any = { component: componentType };
  
  try {
    // Different components might need different data structures
    if (componentType === 'table' && componentResults.length >= 2) {
      Object.assign(componentData, {
        schema: componentResults[0],
        data: componentResults[1]
      });
    } else if (componentType === 'chart' && componentResults.length >= 2) {
      // First result has chart config
      const config = componentResults[0][0];
      // Second result has data points
      const dataPoints = componentResults[1];
      
      Object.assign(componentData, {
        type: config.type || 'bar',
        title: config.title || '',
        labels: dataPoints.map((p: any) => p.label || ''),
        datasets: [{
          label: config.dataset_label || '',
          data: dataPoints.map((p: any) => p.value || 0)
        }]
      });
    } else if (componentType === 'metrics' && componentResults.length > 0) {
      // Each row is a separate metric
      Object.assign(componentData, {
        items: componentResults[0].map((metric: any) => ({
          label: metric.label || '',
          value: metric.value || 0,
          trend: metric.trend || null,
          prefix: metric.prefix || '',
          suffix: metric.suffix || '',
          icon: metric.icon || ''
        }))
      });
    } else if (componentType === 'list' && componentResults.length > 0) {
      // First result might have list config
      const config = componentResults[0].length === 1 && 
                    (componentResults[0][0].title || componentResults[0][0].list_title) ? 
                    componentResults[0][0] : null;
      
      // Items are in the last result set
      const items = config ? componentResults[1] : componentResults[0];
      
      Object.assign(componentData, {
        title: config?.title || config?.list_title || '',
        items: items.map((item: any) => ({
          title: item.title || '',
          description: item.description || '',
          image: item.image || null,
          link: item.link || null,
          tags: item.tags ? item.tags.split(',').map((t: string) => t.trim()) : []
        }))
      });
    } else if (componentType === 'form' && componentResults.length > 0) {
      // First result has form config
      const config = componentResults[0][0] || {};
      // Second result has field definitions
      const fields = componentResults.length > 1 ? componentResults[1] : [];
      
      // Process fields with explicit null values for options
      const processedFields = fields.map((field: any) => {
        let options = null;
        
        // Only try to parse options if it's a non-null string
        if (field.options && typeof field.options === 'string') {
          try {
            options = JSON.parse(field.options);
          } catch (e) {
            console.error(`Failed to parse options for field ${field.name}:`, e);
            options = null;
          }
        }
        
        return {
          name: field.name || '',
          label: field.label || '',
          type: field.type || 'text',
          placeholder: field.placeholder || '',
          required: field.required === 1,
          options: options,
          defaultValue: field.default_value || null
        };
      });
      
      Object.assign(componentData, {
        title: config.title || '',
        submitLabel: config.submit_label || 'Submit',
        action: config.action || '#',
        method: config.method || 'POST',
        fields: processedFields
      });
    } else if (componentType === 'navbar' && componentResults.length > 0) {
      // First result has navbar config
      const config = componentResults[0][0] || {};
      // Second result has links
      const links = componentResults.length > 1 ? componentResults[1] : [];
      
      Object.assign(componentData, {
        title: config.title || '',
        logo: config.logo || null,
        links: links.map((link: any) => ({
          label: link.label || '',
          href: link.href || '#',
          active: link.active === 1
        }))
      });
    } else if (componentType === 'hero' && componentResults.length > 0) {
      // Hero config is in the first result
      const config = componentResults[0][0] || {};
      
      Object.assign(componentData, {
        headline: config.headline || '',
        subheadline: config.subheadline || '',
        backgroundImage: config.background_image || null,
        ctaText: config.cta_text || null,
        ctaLink: config.cta_link || null
      });
    } else if (componentType === 'card' && componentResults.length > 0) {
      // Card data is in the first result
      const cardData = componentResults[0][0] || {};
      
      Object.assign(componentData, {
        title: cardData.title || '',
        content: cardData.content || cardData.description || ''
      });
    } else if (componentType === 'metric' && componentResults.length > 0) {
      // Metric data is in the first result
      const metricData = componentResults[0][0] || {};
      
      Object.assign(componentData, {
        label: metricData.label || '',
        value: metricData.value || 0,
        trend: metricData.trend || null,
        prefix: metricData.prefix || '',
        suffix: metricData.suffix || '',
        icon: metricData.icon || ''
      });
    } else {
      // For other components, just pass the raw data
      Object.assign(componentData, {
        data: componentResults[0] || []
      });
    }
  } catch (error) {
    console.error(`Error processing ${componentType} component:`, error);
    // Provide a fallback in case of error
    if (componentType === 'form') {
      componentData.fields = [];
    }
  }
  
  return componentData;
}
