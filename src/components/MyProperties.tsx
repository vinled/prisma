import React, { useState } from 'react';
import { Edit2, Copy, Trash2, Image as ImageIcon, Home, Search } from 'lucide-react';
import { SavedProperty } from '../types';

interface Props {
  properties: SavedProperty[];
  onEdit: (property: SavedProperty) => void;
  onDelete: (id: string) => void;
}

export function MyProperties({ properties, onEdit, onDelete }: Props) {
  const [termoBusca, setTermoBusca] = useState('');

  const filteredProperties = properties.filter((prop) => {
    const searchLower = termoBusca.toLowerCase();
    const details = prop.details;
    const matchCode = (details.propertyCode || '').toLowerCase().includes(searchLower);
    const matchNeighborhood = (details.neighborhood || '').toLowerCase().includes(searchLower);
    const matchCity = (details.city || '').toLowerCase().includes(searchLower);
    const matchType = (details.propertyType || '').toLowerCase().includes(searchLower);
    return matchCode || matchNeighborhood || matchCity || matchType;
  });

  const handleCopyCaption = (prop: SavedProperty) => {
    const type = prop.details.propertyType || 'Imóvel';
    const location = [prop.details.neighborhood, prop.details.city].filter(Boolean).join(', ');
    const price = prop.details.price ? ` - ${prop.details.price}` : '';
    const caption = `Confira: ${type}${location ? ` em ${location}` : ''}${price}.\n\nPara mais informações, entre em contato!`;
    
    navigator.clipboard.writeText(caption)
      .then(() => alert('Legenda copiada para a área de transferência!'))
      .catch(() => alert('Erro ao copiar legenda.'));
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 w-full">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Imóveis</h1>
          <p className="text-gray-500 dark:text-zinc-400 mt-1">Gerencie os posts e artes criadas para seus imóveis.</p>
        </div>
      </header>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 text-center transition-colors duration-200">
          <Home className="w-16 h-16 text-gray-300 dark:text-zinc-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Nenhum imóvel criado ainda</h3>
          <p className="text-gray-500 dark:text-zinc-400 max-w-md">
            Os dados dos seus imóveis criados aparecerão aqui. Vá até a aba "Criação Rápida" e baixe sua primeira imagem para salvar.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl leading-5 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
              placeholder="Buscar por código, bairro ou tipo..."
            />
          </div>

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
                {filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-zinc-400">
                      Nenhum imóvel encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredProperties.map((property) => {
                    const title = property.details.propertyType || 'Imóvel sem tipo';
                    const location = [property.details.neighborhood, property.details.city].filter(Boolean).join(', ') || 'Localização não informada';
                    
                    return (
                    <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center space-x-4">
                          {property.thumbnail ? (
                            <img 
                              src={property.thumbnail} 
                              alt={title}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-zinc-700 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center border border-gray-200 dark:border-zinc-700 shrink-0">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 dark:text-white">{title}</span>
                            <span className="text-sm text-[#666] dark:text-zinc-400 mt-0.5">{location}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-700 dark:text-zinc-300">
                        {property.details.price || '-'}
                      </td>
                      <td className="p-4 text-gray-500 dark:text-zinc-400">
                        {property.date}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => onEdit(property)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 rounded-lg transition-colors"
                            title="Editar Arte"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleCopyCaption(property)}
                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 rounded-lg transition-colors"
                            title="Copiar Legenda"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onDelete(property.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
