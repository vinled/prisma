with open('src/components/MyAccount.tsx', 'r') as f:
    content = f.read()
    
content = content.replace("} , Loader2 } from 'lucide-react'", ", Loader2 } from 'lucide-react'")

with open('src/components/MyAccount.tsx', 'w') as f:
    f.write(content)

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()
    
content = content.replace("} , Loader2 } from 'lucide-react'", ", Loader2 } from 'lucide-react'")

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
    
with open('src/components/PaywallModal.tsx', 'r') as f:
    content = f.read()
    
content = content.replace("} , Loader2 } from 'lucide-react'", ", Loader2 } from 'lucide-react'")

with open('src/components/PaywallModal.tsx', 'w') as f:
    f.write(content)
