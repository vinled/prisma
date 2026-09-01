import re

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

# Replace the Unsplash URL with another one representing a living room.
# The previous one was photo-1600596542815-ffad4c1539a9, which is a modern living room anyway, but maybe I can use another one, or just confirm.
# Wait, maybe the one I used IS a living room? 1600596542815-ffad4c1539a9 is a modern house exterior maybe? Let me change it to a known living room image just in case, or keep it.
# Let's use a clear living room URL from Unsplash.
new_url = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1080&q=80" # Living room interior

content = re.sub(r'const mockImageUrl = "https://images.unsplash.com/photo-[^"]+";', f'const mockImageUrl = "{new_url}";', content)

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
