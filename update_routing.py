import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "if (!session && path !== '/' && path !== '/reset-password') {",
    "if (!session && path !== '/' && path !== '/reset-password' && path !== '/termos' && path !== '/privacidade') {"
)

content = content.replace(
    "if (window.location.pathname === '/reset-password') {\n    return <ResetPassword />;\n  }",
    "if (window.location.pathname === '/reset-password') {\n    return <ResetPassword />;\n  }\n\n  if (window.location.pathname === '/termos') {\n    return <TermosDeUso />;\n  }\n\n  if (window.location.pathname === '/privacidade') {\n    return <PoliticaPrivacidade />;\n  }"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
