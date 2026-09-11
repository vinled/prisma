with open('src/components/MyAccount.tsx', 'r') as f:
    content = f.read()

if "import { handleCheckout }" not in content:
    content = content.replace("import React", "import { handleCheckout } from '../utils/checkout';\nimport React")

old_button = """          <a 
            href="https://www.asaas.com/c/j299iil4aqkray3j" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl font-medium bg-orange-600 hover:bg-orange-700 text-white text-center transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40"
          >
            Assinar Plano Pro
          </a>"""

new_button = """          <button 
            onClick={() => handleCheckout(() => {})}
            className="w-full py-3 px-4 rounded-xl font-medium bg-orange-600 hover:bg-orange-700 text-white text-center transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40"
          >
            Assinar Plano Pro
          </button>"""

content = content.replace(old_button, new_button)

with open('src/components/MyAccount.tsx', 'w') as f:
    f.write(content)
