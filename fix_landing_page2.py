import re

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

# Add hooks
if "useState" not in content:
    content = content.replace("import React from 'react';", "import React, { useState, useEffect, useRef } from 'react';")

hook_code = """
  const depoisRef = useRef<HTMLDivElement>(null);
  const [depoisScale, setDepoisScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (depoisRef.current) {
        const containerWidth = depoisRef.current.clientWidth;
        setDepoisScale(containerWidth / 1080);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);
"""

if "const depoisRef" not in content:
    content = content.replace("const mockImageUrl", hook_code + "\nconst mockImageUrl")
    
# Update the Depois card
content = content.replace(
    """<div className="flex-grow bg-slate-800 rounded-xl mb-6 aspect-square border border-orange-500/30 overflow-hidden relative group">""",
    """<div ref={depoisRef} className="flex-grow bg-slate-800 rounded-xl mb-6 aspect-square border border-orange-500/30 overflow-hidden relative group">"""
)

content = content.replace(
    """<div className="absolute inset-0 origin-top-left" style={{ transform: 'scale(1)', width: '1080px', height: '1080px' }}>""",
    """<div className="absolute inset-0 origin-top-left" style={{ transform: `scale(${depoisScale})`, width: '1080px', height: '1080px' }}>"""
)

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
