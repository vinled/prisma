import re

with open('src/components/PropertyForm.tsx', 'r') as f:
    content = f.read()

old = '''        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>'''

new = '''        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Preço Atual</label>
            <input
              type="text"
              name="price"
              inputMode="numeric"
              value={details.price}
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
                checked={details.porteiraFechada || false}
                onChange={(e) => onChange({ porteiraFechada: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Porteira Fechada</span>
            </label>
          </div>
        </div>'''

content = content.replace(old, new)
with open('src/components/PropertyForm.tsx', 'w') as f:
    f.write(content)

