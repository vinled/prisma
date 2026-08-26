import re

with open('src/components/Auth.tsx', 'r') as f:
    content = f.read()

# Fix handleResetPassword
old_reset = """  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha o e-mail e a senha.');
      return;
    }"""
new_reset = """  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, preencha o e-mail.');
      return;
    }"""

content = content.replace(old_reset, new_reset)

with open('src/components/Auth.tsx', 'w') as f:
    f.write(content)
