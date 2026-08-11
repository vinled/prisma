import React from 'react';
import { Edit2, Copy, Trash2, Image as ImageIcon } from 'lucide-react';

const MOCK_PROPERTIES = [
  {
    id: '1',
    type: 'Cobertura Duplex',
    location: 'Vila Nova Conceição, São Paulo',
    price: 'R$ 8.500.000',
    date: '11 Ago 2026',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    type: 'Apartamento Alto Padrão',
    location: 'Ipanema, Rio de Janeiro',
    price: 'R$ 4.200.000',
    date: '09 Ago 2026',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    type: 'Casa em Condomínio',
    location: 'Alphaville, Barueri',
    price: 'R$ 6.800.000',
    date: '05 Ago 2026',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

export function MyProperties() {
  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 w-full">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Imóveis</h1>
          <p className="text-gray-500 dark:text-zinc-400 mt-1">Gerencie os posts e artes criadas para seus imóveis.</p>
        </div>
      </header>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 text-sm text-gray-500 dark:text-zinc-400">
                <th className="p-4 font-medium">Imóvel</th>
                <th className="p-4 font-medium">Preço</th>
                <th className="p-4 font-medium">Data</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {MOCK_PROPERTIES.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center space-x-4">
                      {property.image ? (
                        <img 
                          src={property.image} 
                          alt={property.type} 
                          className="w-14 h-14 rounded-lg object-cover border border-gray-200 dark:border-zinc-700 shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center border border-gray-200 dark:border-zinc-700 shrink-0">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white">{property.type}</span>
                        <span className="text-sm text-[#666] dark:text-zinc-400 mt-0.5">{property.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-700 dark:text-zinc-300">
                    {property.price}
                  </td>
                  <td className="p-4 text-gray-500 dark:text-zinc-400">
                    {property.date}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 rounded-lg transition-colors"
                        title="Editar Arte"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 rounded-lg transition-colors"
                        title="Copiar Legenda"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
