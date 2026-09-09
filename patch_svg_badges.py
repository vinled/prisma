import glob
import re

templates = glob.glob('src/templates/*Template.tsx')

for template in templates:
    with open(template, 'r') as f:
        content = f.read()

    if 'LuxuryTemplate' in template:
        pattern = r"\{options\?\.badge && \([\s\S]*?\{options\.badge\}\s*</span>\s*</div>\s*\)\}"
        
        replacement = """{options?.badge && (
            <div className="relative inline-flex items-center justify-center shadow-lg">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <rect 
                  width="100%" 
                  height="100%" 
                  rx="4" 
                  fill={
                    options.badge === 'VENDIDO' ? '#dc2626' : 
                    options.badge === 'EXCLUSIVIDADE' ? '#d97706' : 
                    options.badge === 'BAIXOU O VALOR' ? '#16a34a' : 
                    options.badge === 'OPORTUNIDADE' ? '#2563eb' : '#ea580c'
                  }
                />
              </svg>
              <span className={`relative z-10 ${seloPadding} ${seloText} font-bold text-white uppercase tracking-wider font-sans whitespace-nowrap`}>
                {options.badge}
              </span>
            </div>
          )}"""
        
        content = re.sub(pattern, replacement, content)
        with open(template, 'w') as f:
            f.write(content)

    elif 'ModernTemplate' in template or 'BoldTemplate' in template:
        pattern = r"\{options\?\.badge && \([\s\S]*?\{options\.badge\}\s*</span>\s*</div>\s*</div>\s*\)\}"
        
        replacement = """{options?.badge && (
        <div 
          className="absolute left-0 z-[15] flex items-center justify-center"
          style={{ 
             top: aspectRatio === 'story' ? '280px' : '200px'
          }}
        >
          <div className="relative inline-flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.4)]">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path 
                  d="M0,0 L88,0 Q100,0 100,12 L100,88 Q100,100 88,100 L0,100 Z" 
                  fill={
                    options.badge === 'VENDIDO' ? '#dc2626' : 
                    options.badge === 'EXCLUSIVIDADE' ? '#d97706' : 
                    options.badge === 'BAIXOU O VALOR' ? '#16a34a' : 
                    options.badge === 'OPORTUNIDADE' ? '#2563eb' : '#2563eb'
                  }
                />
              </svg>
              <span 
                className="relative z-10 font-black tracking-widest text-white whitespace-nowrap"
                style={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontSize: aspectRatio === 'story' ? '38px' : '28px',
                  padding: aspectRatio === 'story' ? '16px 24px' : '12px 18px',
                  textTransform: 'uppercase'
                }}
              >
                {options.badge}
              </span>
          </div>
        </div>
      )}"""
        
        content = re.sub(pattern, replacement, content)
        with open(template, 'w') as f:
            f.write(content)

    elif 'ElegantTemplate' in template:
        pattern = r"\{options\?\.badge && \([\s\S]*?\{options\.badge\}\s*</span>\s*</div>\s*\)\}"
        
        replacement = """{options?.badge && (
            <div className="absolute -top-[18px] left-[32px] inline-flex items-center justify-center shadow-md">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <rect 
                  width="100%" 
                  height="100%" 
                  rx="999" 
                  fill={
                    options.badge === 'VENDIDO' ? '#dc2626' : 
                    options.badge === 'EXCLUSIVIDADE' ? '#d97706' : 
                    options.badge === 'BAIXOU O VALOR' ? '#16a34a' : 
                    options.badge === 'OPORTUNIDADE' ? '#2563eb' : '#000000'
                  }
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
              </svg>
              <span className="relative z-10 px-[24px] py-[6px] text-[16px] font-bold tracking-widest uppercase text-white whitespace-nowrap">
                {options.badge}
              </span>
            </div>
          )}"""
        content = re.sub(pattern, replacement, content)
        with open(template, 'w') as f:
            f.write(content)

