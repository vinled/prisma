import React, { useState } from 'react';
import { PropertyDetails, BrandKit } from '../types';
import { AmenitiesSelector } from './AmenitiesSelector';
import { Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

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
  const [showMoreDetails, setShowMoreDetails] = useState(() => {
    // If the property already has optional fields filled (e.g. editing an existing property), keep expanded by default
    return Boolean(
      details.title ||
      details.propertySubtype ||
      details.suites ||
      details.bathrooms ||
      details.propertyCode ||
      details.previousPrice ||
      details.porteiraFechada ||
      details.state ||
      details.leisureArea ||
      (details.amenities && details.amenities.length > 0) ||
      (details.differentials && details.differentials.length > 0) ||
      (details.purpose === 'locacao' && (details.is_package || details.condo_price || details.iptu_price))
    );
  });

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

  const handleNumberFormatChange = (e: React.ChangeEvent<HTMLInputElement>, _suffix: string) => {
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

  // Count active optional fields for feedback badge
  const optionalCount = [
    Boolean(details.title),
    Boolean(details.propertySubtype),
    Boolean(details.state),
    Boolean(details.suites),
    Boolean(details.bathrooms),
    Boolean(details.propertyCode),
    Boolean(details.previousPrice),
    Boolean(details.porteiraFechada),
    Boolean(details.leisureArea),
    Boolean(details.amenities && details.amenities.length > 0),
    Boolean(details.differentials && details.differentials.length > 0),
    Boolean(details.purpose === 'locacao' && (details.is_package || details.condo_price || details.iptu_price)),
    Boolean(details.whatsapp && details.whatsapp !== brandKit?.whatsapp)
  ].filter(Boolean).length;

  const isLocacao = details.purpose === 'locacao';

  const inputClass = "w-full px-3.5 py-2.5 text-sm sm:text-base border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-zinc-800/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 transition-all outline-none";
  const labelClass = "block text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-200 mb-1.5";

  return (
    <div className="space-y-6">
      {/* Purpose Selector: Venda / Locação */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-zinc-800/80 p-1.5 rounded-xl w-full sm:w-fit">
        <button
          type="button"
          onClick={() => onChange({ ...details, purpose: 'venda' })}
          className={`flex-1 sm:flex-initial px-6 py-2 text-sm font-bold rounded-lg transition-all ${
            !isLocacao
              ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Venda
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...details, purpose: 'locacao' })}
          className={`flex-1 sm:flex-initial px-6 py-2 text-sm font-bold rounded-lg transition-all ${
            isLocacao
              ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Locação
        </button>
      </div>

      {/* NÍVEL 1: INFORMAÇÕES ESSENCIAIS */}
      <div className="space-y-4">
        {/* Tipo do Imóvel & Preço */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Tipo do imóvel</label>
            <select
              name="propertyType"
              value={details.propertyType || ''}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Selecione o tipo...</option>
              {PROPERTY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              {isLocacao ? 'Valor do Aluguel' : 'Preço de Venda'}
            </label>
            <input
              type="text"
              name={isLocacao ? 'rent_price' : 'price'}
              inputMode="numeric"
              value={isLocacao ? (details.rent_price || '') : (details.price || '')}
              onChange={isLocacao ? (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (!value) {
                  onChange({ ...details, rent_price: '' });
                  return;
                }
                const formatted = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(parseInt(value, 10));
                onChange({ ...details, rent_price: formatted });
              } : handlePriceChange}
              placeholder={isLocacao ? "Ex.: R$ 3.500" : "Ex.: R$ 850.000"}
              className={inputClass}
            />
          </div>
        </div>

        {/* Localização Básica: Bairro e Cidade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Bairro</label>
            <input
              type="text"
              name="neighborhood"
              value={details.neighborhood || ''}
              onChange={handleChange}
              placeholder="Ex.: Jardins, Ponta da Praia..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Cidade</label>
            <input
              type="text"
              name="city"
              value={details.city || ''}
              onChange={handleChange}
              placeholder="Ex.: São Paulo, Santos..."
              className={inputClass}
            />
          </div>
        </div>

        {/* Características Principais: Área, Quartos, Vagas */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Área (m²)</label>
            <input
              type="text"
              name="area"
              inputMode="numeric"
              value={details.area ? `${details.area.replace(/\D/g, '')}` : ''}
              onChange={(e) => handleNumberFormatChange(e, 'm²')}
              placeholder="120"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Quartos</label>
            <input
              type="text"
              name="bedrooms"
              inputMode="numeric"
              value={details.bedrooms ? `${details.bedrooms.replace(/\D/g, '')}` : ''}
              onChange={(e) => handleNumberFormatChange(e, 'dormitórios')}
              placeholder="3"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Vagas</label>
            <input
              type="text"
              name="parking"
              inputMode="numeric"
              value={details.parking ? `${details.parking.replace(/\D/g, '')}` : ''}
              onChange={(e) => handleNumberFormatChange(e, 'vagas')}
              placeholder="2"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* BOTÃO EXPANSÍVEL: + MAIS INFORMAÇÕES (OPCIONAL) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowMoreDetails(!showMoreDetails)}
          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-200 dark:border-zinc-700/80 bg-gray-50/70 dark:bg-zinc-800/40 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left group"
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              {showMoreDetails ? 'Ocultar detalhes adicionais' : '+ Mais informações (opcional)'}
            </span>
            {optionalCount > 0 && !showMoreDetails && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                {optionalCount} {optionalCount === 1 ? 'preenchido' : 'preenchidos'}
              </span>
            )}
          </div>
          <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-zinc-300">
            {showMoreDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {/* NÍVEL 2 & 3: CAMPOS ADICIONAIS EXPANSÍVEIS */}
        {showMoreDetails && (
          <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/60 border border-gray-200/80 dark:border-zinc-800 space-y-5 animate-in fade-in duration-200">
            {/* Chamada Personalizada */}
            <div>
              <label className={labelClass}>Chamada de destaque na arte</label>
              <input
                type="text"
                name="title"
                value={details.title || ''}
                onChange={handleChange}
                placeholder="Ex.: Oportunidade Única, Vista Mar, Pronto para Morar..."
                className={inputClass}
              />
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1">
                Texto em destaque que aparece no cabeçalho ou título do post.
              </p>
            </div>

            {/* Subtipo de Apartamento & Estado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {details.propertyType === 'Apartamento' && (
                <div>
                  <label className={labelClass}>Tipo de apartamento</label>
                  <select
                    name="propertySubtype"
                    value={details.propertySubtype || ''}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Padrão</option>
                    {APARTMENT_SUBTYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className={labelClass}>Estado (UF)</label>
                <select
                  name="state"
                  value={details.state || ''}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Selecione...</option>
                  {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Suítes, Banheiros e Código */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Suítes</label>
                <input
                  type="text"
                  name="suites"
                  inputMode="numeric"
                  value={details.suites ? `${details.suites.replace(/\D/g, '')}` : ''}
                  onChange={(e) => handleNumberFormatChange(e, 'suítes')}
                  placeholder="1"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Banheiros</label>
                <input
                  type="text"
                  name="bathrooms"
                  inputMode="numeric"
                  value={details.bathrooms ? `${details.bathrooms.replace(/\D/g, '')}` : ''}
                  onChange={(e) => handleNumberFormatChange(e, 'banheiros')}
                  placeholder="2"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Código do imóvel</label>
                <input
                  type="text"
                  name="propertyCode"
                  value={details.propertyCode || ''}
                  onChange={handleChange}
                  placeholder="Ex.: AP0123"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Campos Específicos de Venda ou Locação */}
            {!isLocacao ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2 border-t border-gray-200/60 dark:border-zinc-800">
                <div>
                  <label className={labelClass}>Preço anterior (para mostrar desconto)</label>
                  <input
                    type="text"
                    name="previousPrice"
                    inputMode="numeric"
                    value={details.previousPrice || ''}
                    onChange={handlePriceChange}
                    placeholder="Ex.: R$ 950.000"
                    className={inputClass}
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name="porteiraFechada"
                      checked={details.porteiraFechada || false}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500 dark:bg-zinc-800 dark:border-zinc-700"
                    />
                    <span className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                      Porteira Fechada (Mobiliado)
                    </span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2 border-t border-gray-200/60 dark:border-zinc-800">
                <div className="flex flex-wrap gap-6 items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="is_package"
                      name="is_package"
                      checked={details.is_package || false}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                      Pacote Completo (Taxas inclusas)
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="porteiraFechada_locacao"
                      name="porteiraFechada"
                      checked={details.porteiraFechada || false}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                      Porteira Fechada
                    </span>
                  </label>
                </div>
                {!details.is_package && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Condomínio</label>
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
                        placeholder="R$ 600"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>IPTU</label>
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
                        placeholder="R$ 180"
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Área de Lazer */}
            <div className="pt-4 border-t border-gray-200/60 dark:border-zinc-800">
              <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                Área de lazer
              </label>
              <div className="flex space-x-4 mb-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="leisureArea"
                    checked={details.leisureArea === false || details.leisureArea === null}
                    onChange={() => onChange({ ...details, leisureArea: false })}
                    className="mr-2 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-zinc-300">Não informado</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="leisureArea"
                    checked={details.leisureArea === true}
                    onChange={() => onChange({ ...details, leisureArea: true })}
                    className="mr-2 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-zinc-300">Possui área de lazer</span>
                </label>
              </div>
              
              {details.leisureArea && (
                <div className="bg-orange-50/60 dark:bg-zinc-800/80 border border-orange-100 dark:border-zinc-700/60 p-4 rounded-xl space-y-4">
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

            {/* Comodidades e Diferenciais */}
            <div className="pt-4 border-t border-gray-200/60 dark:border-zinc-800 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Comodidades do Imóvel</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  Para não poluir a arte, até 5 destaques no total serão exibidos.
                </p>
              </div>

              <AmenitiesSelector
                label="Comodidades / Serviços"
                options={[...CONDO_AMENITIES, ...SERVICE_AMENITIES]}
                selected={(details.amenities || []).filter(a => [...CONDO_AMENITIES, ...SERVICE_AMENITIES].includes(a))}
                onChange={(newSelection) => {
                  const others = (details.amenities || []).filter(a => !([...CONDO_AMENITIES, ...SERVICE_AMENITIES].includes(a)));
                  handleAmenitiesChange([...others, ...newSelection]);
                }}
              />

              <AmenitiesSelector
                label="Diferenciais"
                options={DIFFERENTIALS}
                selected={details.differentials || []}
                onChange={handleDifferentialsChange}
              />
            </div>

            {/* Contato Personalizado */}
            <div className="pt-4 border-t border-gray-200/60 dark:border-zinc-800">
              <label className={labelClass}>Contato para este post</label>
              
              {brandKit?.whatsapp ? (
                <div>
                  {!showCustomContact ? (
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl">
                        <div className="flex items-center text-emerald-800 dark:text-emerald-300">
                          <Check className="w-4 h-4 mr-2" />
                          <span className="text-sm font-semibold">Usando WhatsApp de 'Minha Marca'</span>
                        </div>
                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{brandKit.whatsapp}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCustomContact(true)}
                        className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline text-left py-1"
                      >
                        Alterar contato apenas para este imóvel
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
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCustomContact(false)}
                        className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline text-left py-1"
                      >
                        Voltar a usar o WhatsApp de 'Minha Marca'
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
                  className={inputClass}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
