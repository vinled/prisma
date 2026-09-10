import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add useLocation to react-router-dom imports if not present, otherwise add it.
if 'react-router-dom' not in content:
    content = "import { useLocation } from 'react-router-dom';\n" + content

# Replace window.location.pathname with location.pathname
if 'useLocation()' not in content:
    content = content.replace('export default function App() {', 'export default function App() {\n  const location = useLocation();')
    
content = content.replace('window.location.pathname', 'location.pathname')

with open('src/App.tsx', 'w') as f:
    f.write(content)
