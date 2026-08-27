with open('src/components/TemplateRenderer.tsx', 'r') as f:
    content = f.read()

content = content.replace("const safeLogo = useSafeImage(logo);", "const safeLogo = useSafeImage(logo, true);")

with open('src/components/TemplateRenderer.tsx', 'w') as f:
    f.write(content)
