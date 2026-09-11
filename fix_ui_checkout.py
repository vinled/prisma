import re

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Add CheckoutModal import
    if "CheckoutModal" not in content:
        content = content.replace("import { handleCheckout } from", "import { CheckoutModal } from '../components/CheckoutModal';\nimport { handleCheckout } from")

    if "CheckoutModal" not in content and filepath == "src/components/MyAccount.tsx":
        content = content.replace("import { handleCheckout } from", "import { CheckoutModal } from './CheckoutModal';\nimport { handleCheckout } from")
    
    if filepath == "src/components/LandingPage.tsx":
        content = content.replace("import { CheckoutModal } from '../components/CheckoutModal'", "import { CheckoutModal } from './CheckoutModal'")
    if filepath == "src/components/PaywallModal.tsx":
        content = content.replace("import { CheckoutModal } from '../components/CheckoutModal'", "import { CheckoutModal } from './CheckoutModal'")

    # Add modal state
    if "const [isCheckoutModalOpen" not in content:
        content = content.replace("const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);", "const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);\n  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);")
    
    # Change button onClick
    old_btn = "onClick={() => handleCheckout(setIsCheckoutLoading)}"
    new_btn = "onClick={() => setIsCheckoutModalOpen(true)}"
    content = content.replace(old_btn, new_btn)

    # Insert CheckoutModal JSX at the end of the return statement
    if "<CheckoutModal" not in content:
        modal_jsx = """
      <CheckoutModal 
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        isLoading={isCheckoutLoading}
        onConfirm={(cpf) => handleCheckout(cpf, setIsCheckoutLoading)}
      />
"""
        # Find the last closing tag usually </div> or something similar
        # For simplicity, we can insert it right before the last closing tag
        idx = content.rfind("</")
        content = content[:idx] + modal_jsx + content[idx:]
        
    with open(filepath, 'w') as f:
        f.write(content)

update_file('src/components/MyAccount.tsx')
update_file('src/components/LandingPage.tsx')
update_file('src/components/PaywallModal.tsx')

