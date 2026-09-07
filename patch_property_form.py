import re

with open('src/components/PropertyForm.tsx', 'r') as f:
    content = f.read()

purpose_toggle = """      {/* Finalidade Toggle */}
      <div className="flex bg-gray-100 p-1 rounded-lg w-fit mb-4">
        <button
          type="button"
          onClick={() => onChange({ ...details, purpose: 'venda' })}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            (!details.purpose || details.purpose === 'venda')
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Venda
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...details, purpose: 'locacao' })}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            details.purpose === 'locacao'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Locação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">"""

content = content.replace('<div className="grid grid-cols-1 md:grid-cols-2 gap-4">', purpose_toggle, 1)

price_section_old = """      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Metragem (m²)</label>"""

price_section_new = """      {/* Dynamic Price Section */}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Metragem (m²)</label>
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

      {/* Grid for Area, Bedrooms, etc... */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Metragem (m²)</label>"""

content = content.replace(price_section_old, price_section_new)

with open('src/components/PropertyForm.tsx', 'w') as f:
    f.write(content)
