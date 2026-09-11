import re

def update_file(filepath, btn_text):
    with open(filepath, 'r') as f:
        content = f.read()

    # ensure useState and Loader2 are imported
    if "import { Loader2 } from" not in content and "lucide-react" in content:
        content = content.replace("from 'lucide-react'", ", Loader2 } from 'lucide-react'")
    elif "lucide-react" not in content:
        content = "import { Loader2 } from 'lucide-react';\n" + content
    
    if "useState" not in content:
        content = content.replace("import React", "import React, { useState }")
        
    # Find the component signature to inject the state
    if "export function MyAccount" in content:
        content = content.replace("export function MyAccount() {", "export function MyAccount() {\n  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);")
    elif "export function LandingPage" in content:
        content = content.replace("export function LandingPage() {", "export function LandingPage() {\n  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);")
    elif "export function PaywallModal" in content:
        content = content.replace("export function PaywallModal({ isOpen, onClose, onUpgrade }: PaywallModalProps) {", "export function PaywallModal({ isOpen, onClose, onUpgrade }: PaywallModalProps) {\n  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);")

    # Replace the button
    old_btn = f"onClick={{() => handleCheckout(() => {{}})}}"
    new_btn = f"onClick={{() => handleCheckout(setIsCheckoutLoading)}}\n            disabled={{isCheckoutLoading}}"
    content = content.replace(old_btn, new_btn)

    # Add loader to text
    old_text = f">\n            {btn_text}\n          </button>"
    new_text = f""">
            {{isCheckoutLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              "{btn_text}"
            )}}
          </button>"""
    content = content.replace(old_text, new_text)

    with open(filepath, 'w') as f:
        f.write(content)

update_file('src/components/MyAccount.tsx', 'Assinar Plano Pro')
update_file('src/components/LandingPage.tsx', 'Assinar o PostNaMão Pro')
update_file('src/components/PaywallModal.tsx', 'Desbloquear o PostNaMão Pro - R$ 49,90/mês')

