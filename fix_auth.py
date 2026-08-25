import re

with open('src/components/Auth.tsx', 'r') as f:
    content = f.read()

replacement = """    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha o e-mail e a senha.');
      return;
    }
    setLoading(true);"""

content = content.replace("    e.preventDefault();\n    setLoading(true);", replacement)

with open('src/components/Auth.tsx', 'w') as f:
    f.write(content)
