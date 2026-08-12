const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Check if we need to add SavedProperty import
if (!content.includes('SavedProperty')) {
  content = content.replace(
    /import \{ PropertyDetails, TemplateId, AspectRatioId, BrandKit, TemplateOptions \} from '\.\/types';/,
    `import { PropertyDetails, TemplateId, AspectRatioId, BrandKit, TemplateOptions, SavedProperty } from './types';`
  );
}

// Ensure savedProperties state exists
if (!content.includes('savedProperties')) {
  content = content.replace(
    /const \[isDarkMode, setIsDarkMode\] = useState/,
    `const [savedProperties, setSavedProperties] = useState<SavedProperty[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('prisma_imoveis');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved properties', e);
        }
      }
    }
    return [];
  });
  
  const [isDarkMode, setIsDarkMode] = useState`
  );
}

// Update handleDownload to save property data
if (!content.includes('savePropertyData()')) {
  const saveLogic = `
    const savePropertyData = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
      
      const newProperty: SavedProperty = {
        id: Date.now().toString(),
        date: dateStr,
        details,
        selectedTemplate,
        aspectRatio,
        templateOptions
      };
      
      const updated = [newProperty, ...savedProperties];
      setSavedProperties(updated);
      localStorage.setItem('prisma_imoveis', JSON.stringify(updated));
    };
    
    savePropertyData();
    `;
    
  content = content.replace(
    /setIsExporting\(true\);\s*const scale = 2;/,
    `setIsExporting(true);
      
${saveLogic}
      const scale = 2;`
  );
}

// Add handleEdit and handleDelete functions
if (!content.includes('const handleEdit = (prop: SavedProperty)')) {
  content = content.replace(
    /return \(\s*<div className="flex h-screen/,
    `const handleEdit = (prop: SavedProperty) => {
    setDetails(prop.details);
    setSelectedTemplate(prop.selectedTemplate);
    setAspectRatio(prop.aspectRatio);
    setTemplateOptions(prop.templateOptions);
    setActiveTab('criacao');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel salvo?')) {
      const updated = savedProperties.filter(p => p.id !== id);
      setSavedProperties(updated);
      localStorage.setItem('prisma_imoveis', JSON.stringify(updated));
    }
  };

  return (
    <div className="flex h-screen`
  );
}

// Update the rendering of MyProperties
content = content.replace(
  /<MyProperties \/>/,
  `<MyProperties properties={savedProperties} onEdit={handleEdit} onDelete={handleDelete} />`
);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx updated for localStorage.');
