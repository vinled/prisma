import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Remove localStorage initialization
old_brandkit_init = """  const [brandKit, setBrandKit] = useState<BrandKit | null>(() => {
    const saved = localStorage.getItem('globalBrandKit');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });"""
new_brandkit_init = "  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);"
content = content.replace(old_brandkit_init, new_brandkit_init)

old_brandkit_effect = """  useEffect(() => {
    if (brandKit) {
      localStorage.setItem('globalBrandKit', JSON.stringify(brandKit));
    } else {
      localStorage.removeItem('globalBrandKit');
    }
  }, [brandKit]);"""
new_brandkit_effect = """  useEffect(() => {
    // BrandKit will be saved to Supabase explicitly, not via effect
  }, []);"""
content = content.replace(old_brandkit_effect, new_brandkit_effect)

old_properties_init = """  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>(() => {
    const saved = localStorage.getItem('postnamao_imoveis');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });"""
new_properties_init = "  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);"
content = content.replace(old_properties_init, new_properties_init)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Updated App.tsx storage inits")
