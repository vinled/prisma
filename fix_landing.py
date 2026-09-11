with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

if "import { handleCheckout }" not in content:
    content = content.replace("import React", "import { handleCheckout } from '../utils/checkout';\nimport React")

old_button = """              <a 
                href="https://www.asaas.com/c/j299iil4aqkray3j"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 text-center block"
              >
                Assinar o PostNaMão Pro
              </a>"""

new_button = """              <button 
                onClick={() => handleCheckout(() => {})}
                className="w-full py-4 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 text-center block"
              >
                Assinar o PostNaMão Pro
              </button>"""

content = content.replace(old_button, new_button)

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
