import re

with open('src/components/LogoUploader.tsx', 'r') as f:
    content = f.read()

# Add import if not exists
if "import imageCompression" not in content:
    content = "import imageCompression from 'browser-image-compression';\n" + content

# Replace handleFileChange
old_handle = r"const handleFileChange = useCallback\(\s*async \(e: React.ChangeEvent<HTMLInputElement>\) => \{.*?(?=\s*const handleRemove)/s"

# Note: We need a less greedy regex or just replace the specific try block
