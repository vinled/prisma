const fs = require('fs');
let code = fs.readFileSync('src/components/MyProperties.tsx', 'utf8');

// 1. Ensure Search bar has w-full on mobile
// The search bar is inside `<div className="relative max-w-md">`
code = code.replace(
  '<div className="relative max-w-md">',
  '<div className="relative w-full md:max-w-md mb-6">'
);

// 2. Hide Table on mobile
code = code.replace(
  '<table className="w-full text-left border-collapse">',
  '<table className="w-full text-left border-collapse hidden md:table">'
);

// 3. Inject Mobile Grid
const tableWrapperClosingTag = '            </table>';
const mobileGrid = `
            {/* Mobile Grid Layout */}
            <div className="grid grid-cols-1 gap-4 md:hidden p-4 bg-gray-50 dark:bg-zinc-950">
              {filteredProperties.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-zinc-400 py-8">
                  Nenhum imóvel encontrado.
                </div>
              ) : (
                filteredProperties.map((property) => {
                  const title = property.details.propertyType || 'Imóvel sem tipo';
                  const location = [property.details.neighborhood, property.details.city].filter(Boolean).join(', ') || 'Localização não informada';
                  
                  return (
                    <div key={property.id} className="bg-white dark:bg-[#1a1c23] rounded-lg border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex flex-col">
                      <div className="flex gap-4 items-start">
                        {property.thumbnail ? (
                          <img
                             src={property.thumbnail}
                             alt={title}
                            className="w-16 h-16 rounded-md object-cover border border-gray-200 dark:border-zinc-700 shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-md bg-gray-100 dark:bg-zinc-800 flex items-center justify-center border border-gray-200 dark:border-zinc-700 shrink-0">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex flex-col flex-1 min-w-0 pt-1">
                          <span className="font-bold text-gray-900 dark:text-white truncate">{title}</span>
                          <span className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5 truncate">{location}</span>
                          <span className="font-medium text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                            {property.details.price || '-'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                        <span className="text-xs text-gray-400 dark:text-zinc-500">
                          Atualizado em {property.date.split(' ')[0]}
                        </span>
                        <div className="flex gap-3 text-gray-500">
                          <button 
                            onClick={() => onEdit(property)}
                            className="p-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleCopyCaption(property)}
                            className="p-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onDelete(property.id)}
                            className="p-1.5 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
`;
code = code.replace(tableWrapperClosingTag, tableWrapperClosingTag + '\n' + mobileGrid);

fs.writeFileSync('src/components/MyProperties.tsx', code);
