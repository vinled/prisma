import re

with open('src/components/PaywallModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("import React from 'react';", "import React, { useState } from 'react';\nimport { handleCheckout } from '../utils/checkout';")

old_button = """          <a
            href="https://www.asaas.com/c/j299iil4aqkray3j"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              onClose();
            }}
            className="w-full flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white py-4 px-4 rounded-xl font-bold text-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-xl shadow-orange-600/25 mb-4"
          >
            Desbloquear o PostNaMão Pro - R$ 49,90/mês
          </a>"""

new_button = """          <button
            onClick={() => handleCheckout(() => {})}
            className="w-full flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white py-4 px-4 rounded-xl font-bold text-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-xl shadow-orange-600/25 mb-4"
          >
            Desbloquear o PostNaMão Pro - R$ 49,90/mês
          </button>"""

content = content.replace(old_button, new_button)

with open('src/components/PaywallModal.tsx', 'w') as f:
    f.write(content)
