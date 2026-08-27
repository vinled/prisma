with open('src/hooks/useSafeImage.ts', 'r') as f:
    content = f.read()

# Replace `export function useSafeImage(url: string | null | undefined): string | null | undefined {`
# with `export function useSafeImage(url: string | null | undefined, preserveAlpha: boolean = false): string | null | undefined {`

content = content.replace(
    "export function useSafeImage(url: string | null | undefined): string | null | undefined {",
    "export function useSafeImage(url: string | null | undefined, preserveAlpha: boolean = false): string | null | undefined {"
)

# In useEffect dependencies, add preserveAlpha
content = content.replace("}, [url]);", "}, [url, preserveAlpha]);")

# Replace `canvas.toDataURL('image/jpeg', 0.95)` with `preserveAlpha ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.95)`
content = content.replace("canvas.toDataURL('image/jpeg', 0.95)", "preserveAlpha ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.95)")

with open('src/hooks/useSafeImage.ts', 'w') as f:
    f.write(content)
