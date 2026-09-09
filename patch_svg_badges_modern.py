import glob
import re

templates = ['src/templates/ModernTemplate.tsx', 'src/templates/BoldTemplate.tsx']

for template in templates:
    with open(template, 'r') as f:
        content = f.read()

    pattern = r"<svg className=\"absolute inset-0 w-full h-full\" preserveAspectRatio=\"none\" viewBox=\"0 0 100 100\">[\s\S]*?</svg>"
    
    replacement = """<svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <rect 
                  width="100%" 
                  height="100%" 
                  rx="0"
                  fill={
                    options.badge === 'VENDIDO' ? '#dc2626' : 
                    options.badge === 'EXCLUSIVIDADE' ? '#d97706' : 
                    options.badge === 'BAIXOU O VALOR' ? '#16a34a' : 
                    options.badge === 'OPORTUNIDADE' ? '#2563eb' : '#2563eb'
                  }
                />
              </svg>"""
    
    content = re.sub(pattern, replacement, content)
    with open(template, 'w') as f:
        f.write(content)

