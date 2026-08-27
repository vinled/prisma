import re

with open('src/templates/ElegantTemplate.tsx', 'r') as f:
    content = f.read()

# Property Code and Watermark replacement
old_prop_code_regex = r"\{\/\* Property Code \*\/\}.*"

new_prop_code = """{/* Footer: Property Code and Watermark */}
          <div className="flex justify-between items-center w-full mt-[12px] pt-[12px] border-t border-white/10">
            <span className="text-[16px] text-white/80 font-medium tracking-wider">
              {details.propertyCode?.trim() ? `Cód. ${details.propertyCode}` : ''}
            </span>
            <span className="text-[16px] text-white/80 font-medium tracking-wider">
              Criado com PostNaMão
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}"""

content = re.sub(old_prop_code_regex, new_prop_code, content, flags=re.DOTALL)

with open('src/templates/ElegantTemplate.tsx', 'w') as f:
    f.write(content)

print("Updates applied to ElegantTemplate footer")
