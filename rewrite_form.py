import re

with open('src/components/PropertyForm.tsx', 'r') as f:
    content = f.read()

def extract_between(text, start, end):
    return text.split(start)[1].split(end)[0]

top = content.split('<div className="space-y-6">')[0]
bottom = '<div className="pt-4 border-t border-gray-200">' + content.split('<div className="pt-4 border-t border-gray-200">', 1)[1]

middle = """<div className="space-y-6">
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
            value={details.propertyType}
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
              value={details.propertySubtype}
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
          value={details.title}
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
            value={details.neighborhood}
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
            value={details.city}
            onChange={handleChange}
            placeholder="Ex.: Santos"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Estado</label>
          <select
            name="state"
            value={details.state}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Preço</label>
            <input
              type="text"
              name="price"
              inputMode="numeric"
              value={details.price}
              onChange={handlePriceChange}
              placeholder="R$ 850.000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_package"
              name="is_package"
              checked={details.is_package || false}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_package" className="text-sm font-medium text-gray-700 dark:text-zinc-300">
              É Pacote? (Aluguel + Taxas inclusas)
            </label>
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
          value={details.propertyCode}
          onChange={handleChange}
          placeholder="Ex.: AP0123"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

"""

with open('src/components/PropertyForm.tsx', 'w') as f:
    f.write(top + middle + bottom)
