const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldState = "const [brandKit, setBrandKit] = useState<BrandKit | null>(null);";
const newState = `const [brandKit, setBrandKit] = useState<BrandKit | null>(() => {
    const saved = localStorage.getItem('globalBrandKit');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  
  useEffect(() => {
    if (brandKit) {
      localStorage.setItem('globalBrandKit', JSON.stringify(brandKit));
    } else {
      localStorage.removeItem('globalBrandKit');
    }
  }, [brandKit]);
  
  const [applyBrandKit, setApplyBrandKit] = useState(true);`;

code = code.replace(oldState, newState);

// Also need to fix the template renderer replacements which partially applied or didn't apply
// Wait, looking at the previous grep, the templateRenderers might be updated:
// 551: logo={applyBrandKit ? (brandKit?.logo || null) : null}
// 553: brandKit={applyBrandKit ? brandKit : undefined}
// Looks like those worked!

fs.writeFileSync('src/App.tsx', code);
