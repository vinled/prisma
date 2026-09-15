import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add a useEffect to lock body scroll when mobile preview is active
effect = """  useEffect(() => {
    if (window.innerWidth < 1024 && mobileViewTab === 'preview') {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100dvh';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
    };
  }, [mobileViewTab]);"""

# insert right before `return (` of the component
content = content.replace("  if (location.pathname === '/reset-password') {", effect + "\n\n  if (location.pathname === '/reset-password') {")

with open('src/App.tsx', 'w') as f:
    f.write(content)

