import React, { useState } from 'react';
import { PropertyDetails, BrandKit } from '../types';
import { AmenitiesSelector } from './AmenitiesSelector';
import { Check } from 'lucide-react';

interface PropertyFormProps {
  details: PropertyDetails;
  brandKit: BrandKit | null;
  onChange: (details: PropertyDetails) => void;
}

const PROPERTY_TYPES = ['Apartamento', 'Casa', 'Comercial', 'Terreno', 'Rural'];
const APARTMENT_SUBTYPES = ['Padrão', 'Cobertura', 'Duplex', 'Triplex', 'Garden', 'Loft', 'Studio', 'Kitnet', 'Flat'];

const LEISURE_AMENITIES = [
  'Piscina', 'Academia', 'Playground', 'Salão de festas', 'Espaço gourmet',
  'Churrasqueira', 'Quadra', 'Sauna', 'Briquedoteca', 'Salão de jogos'
];

const CONDO_AMENITIES = [
  'Portaria 24h', 'Elevador', 'Coworking', 'Pet Place', 'Mini mercado', 'Bicicletário',
  'Lavanderia', 'SPA', 'Espaço beleza'
];

const SERVICE_AMENITIES = [
  'Ar-condicionado', 'Gerador', 'Portão eletrônico', 'Aquecimento solar', 'Gás encanado'
];

const DIFFERENTIALS = [
  'Vista para o mar', 'Vista livre', 'Mobiliado', 'Planejados', 'Reformado',
  'Varanda gourmet', 'Aceita pet', 'Andar alto', 'Sol da manhã', 'Frente mar',
  'Pé na areia', 'Próximo ao metrô', 'Decorado'
];

export function PropertyForm({ details, brandKit, onChange }: PropertyFormProps) {
  const [showCustomContact, setShowCustomContact] = useState(false);
  const useBrandKitWhatsapp = brandKit?.whatsapp && !showCustomContact;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...details, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onChange({ ...details, [name]: checked });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    let value = e.target.value.replace(/\D/g, '');
    if (!value) {
      onChange({ ...details, [name]: '' });
      return;
    }
    const numericValue = parseInt(value, 10);
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);
    onChange({ ...details, [name]: formattedValue });
  };

  const handleNumberFormatChange = (e: React.ChangeEvent<HTMLInputElement>, suffix: string) => {
    let value = e.target.value.replace(/\D/g, '');
    if (!value) {
      onChange({ ...details, [e.target.name]: '' });
      return;
    }
    onChange({ ...details, [e.target.name]: value });
  };

  const handleAmenitiesChange = (categorySelected: string[]) => {
    onChange({ ...details, amenities: categorySelected });
  };

  const handleDifferentialsChange = (selected: string[]) => {
    onChange({ ...details, differentials: selected });
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg w-fit mb-4">
        <button
          type="button"
          onClick={() => onChange({ ...details, purpose: 'venda' })}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            (!details.purpose || details.purpose === 'venda')
              ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'
          }`}
        >
          Venda
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...details, purpose: 'locacao' })}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            details.purpose === 'locacao'
              ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'
          }`}
        >
          Locação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Tipo do imóvel</label>
          <select
            name="propertyType"
            value={details.propertyType || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione...</option>
            {PROPERTY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {details.propertyType === 'Apartamento' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Tipo de apartamento</label>
            <select
              name="propertySubtype"
              value={details.propertySubtype || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Padrão</option>
              {APARTMENT_SUBTYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Chamada (opcional)</label>
        <input
          type="text"
          name="title"
          value={details.title || ''}
          onChange={handleChange}
          placeholder="Ex.: Oportunidade, Exclusividade, Pronto para morar..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Bairro</label>
          <input
            type="text"
            name="neighborhood"
            value={details.neighborhood || ''}
            onChange={handleChange}
            placeholder="Ex.: Boqueirão"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Cidade</label>
          <input
            type="text"
            name="city"
            value={details.city || ''}
            onChange={handleChange}
            placeholder="Ex.: Santos"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Estado</label>
          <select
            name="state"
            value={details.state || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">UF</option>
            {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>
      </div>

      {(!details.purpose || details.purpose === 'venda') ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Preço Atual</label>
            <input
              type="text"
              name="price"
              inputMode="numeric"
              value={details.price || ''}
              onChange={handlePriceChange}
              placeholder="R$ 1.000.000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Preço Anterior (Opcional)</label>
            <input
              type="text"
              name="previousPrice"
              inputMode="numeric"
              value={details.previousPrice || ''}
              onChange={handlePriceChange}
              placeholder="R$ 1.150.000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="porteiraFechada"
                checked={details.porteiraFechada || false}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Porteira Fechada</span>
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_package"
                name="is_package"
                checked={details.is_package || false}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_package" className="text-sm font-medium text-gray-700 dark:text-zinc-300 cursor-pointer">
                É Pacote? (Aluguel + Taxas inclusas)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="porteiraFechada_locacao"
                name="porteiraFechada"
                checked={details.porteiraFechada || false}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="porteiraFechada_locacao" className="text-sm font-medium text-gray-700 dark:text-zinc-300 cursor-pointer">
                Porteira Fechada
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Valor do Aluguel</label>
              <input
                type="text"
                name="rent_price"
                inputMode="numeric"
                value={details.rent_price || ''}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (!value) {
                    onChange({ ...details, rent_price: '' });
                    return;
                  }
                  const formattedValue = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(parseInt(value, 10));
                  onChange({ ...details, rent_price: formattedValue });
                }}
                placeholder={details.is_package ? "R$ 4.500 (Pacote)" : "R$ 3.000"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {!details.is_package && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Condomínio</label>
                  <input
                    type="text"
                    name="condo_price"
                    inputMode="numeric"
                    value={details.condo_price || ''}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (!value) {
                        onChange({ ...details, condo_price: '' });
                        return;
                      }
                      const formattedValue = new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(parseInt(value, 10));
                      onChange({ ...details, condo_price: formattedValue });
                    }}
                    placeholder="R$ 500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">IPTU</label>
                  <input
                    type="text"
                    name="iptu_price"
                    inputMode="numeric"
                    value={details.iptu_price || ''}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (!value) {
                        onChange({ ...details, iptu_price: '' });
                        return;
                      }
                      const formattedValue = new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(parseInt(value, 10));
                      onChange({ ...details, iptu_price: formattedValue });
                    }}
                    placeholder="R$ 150"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Metragem (m²)</label>
          <input
            type="text"
            name="area"
            inputMode="numeric"
            value={details.area ? `${details.area.replace(/\D/g, '')}` : ''}
            onChange={(e) => handleNumberFormatChange(e, 'm²')}
            placeholder="120"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Dormitórios</label>
          <input
            type="text"
            name="bedrooms"
            inputMode="numeric"
            value={details.bedrooms ? `${details.bedrooms.replace(/\D/g, '')}` : ''}
            onChange={(e) => handleNumberFormatChange(e, 'dormitórios')}
            placeholder="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Suítes</label>
          <input
            type="text"
            name="suites"
            inputMode="numeric"
            value={details.suites ? `${details.suites.replace(/\D/g, '')}` : ''}
            onChange={(e) => handleNumberFormatChange(e, 'suítes')}
            placeholder="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Banheiros</label>
          <input
            type="text"
            name="bathrooms"
            inputMode="numeric"
            value={details.bathrooms ? `${details.bathrooms.replace(/\D/g, '')}` : ''}
            onChange={(e) => handleNumberFormatChange(e, 'banheiros')}
            placeholder="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Vagas</label>
          <input
            type="text"
            name="parking"
            inputMode="numeric"
            value={details.parking ? `${details.parking.replace(/\D/g, '')}` : ''}
            onChange={(e) => handleNumberFormatChange(e, 'vagas')}
            placeholder="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Código do imóvel (opcional)</label>
        <input
          type="text"
          name="propertyCode"
          inputMode="numeric"
          value={details.propertyCode || ''}
          onChange={handleChange}
          placeholder="Ex.: AP0123"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

<div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">Área de lazer</label>
        <div className="flex space-x-4 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="leisureArea"
              checked={details.leisureArea === false || details.leisureArea === null}
              onChange={() => onChange({ ...details, leisureArea: false })}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-zinc-300">Não informado</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="leisureArea"
              checked={details.leisureArea === true}
              onChange={() => onChange({ ...details, leisureArea: true })}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-zinc-300">Possui área de lazer</span>
          </label>
        </div>
        
        {details.leisureArea && (
          <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <AmenitiesSelector
              label="Opções de Lazer"
              options={LEISURE_AMENITIES}
              selected={(details.amenities || []).filter(a => LEISURE_AMENITIES.includes(a))}
              onChange={(newSelection) => {
                const others = (details.amenities || []).filter(a => !LEISURE_AMENITIES.includes(a));
                handleAmenitiesChange([...others, ...newSelection]);
              }}
            />
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-zinc-300">Destaques do Imóvel</h3>
          <p className="text-xs text-gray-500 mt-1">
            Selecione comodidades e diferenciais. Para não poluir o design, <strong>apenas até 5 opções no total</strong> serão exibidas na arte final.
          </p>
        </div>
        
        <AmenitiesSelector
          label="Comodidades do Condomínio / Serviços"
          options={[...CONDO_AMENITIES, ...SERVICE_AMENITIES]}
          selected={(details.amenities || []).filter(a => [...CONDO_AMENITIES, ...SERVICE_AMENITIES].includes(a))}
          onChange={(newSelection) => {
            const others = (details.amenities || []).filter(a => !([...CONDO_AMENITIES, ...SERVICE_AMENITIES].includes(a)));
            handleAmenitiesChange([...others, ...newSelection]);
          }}
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <AmenitiesSelector
          label="Diferenciais"
          options={DIFFERENTIALS}
          selected={details.differentials || []}
          onChange={handleDifferentialsChange}
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Contato</label>
        
        {brandKit?.whatsapp ? (
          <div>
            {!showCustomContact ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-800">
                    <Check className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Usar WhatsApp do Brand Kit</span>
                  </div>
                  <span className="text-sm text-green-700">{brandKit.whatsapp}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCustomContact(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 text-left"
                >
                  Alterar contato para este post
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="tel"
                  name="whatsapp"
                  inputMode="numeric"
                  value={details.whatsapp || ''}
                  onChange={handleChange}
                  placeholder="Ex.: (11) 99999-9999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCustomContact(false)}
                  className="text-xs text-blue-600 hover:text-blue-800 text-left"
                >
                  Voltar a usar o contato do Brand Kit
                </button>
              </div>
            )}
          </div>
        ) : (
          <input
            type="tel"
            name="whatsapp"
            inputMode="numeric"
            value={details.whatsapp || ''}
            onChange={handleChange}
            placeholder="Ex.: (11) 99999-9999"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}
      </div>
    </div>
  );
}
