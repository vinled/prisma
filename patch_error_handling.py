import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# We need to replace the fetch part with the error handling part.
old_block = """      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ promptText })
      });

      const data = await response.json();"""

new_block = """      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ promptText })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na API:", errorText);
        throw new Error("Erro na comunicação com o servidor. Tente novamente.");
      }

      const data = await response.json();"""

if old_block in content:
    content = content.replace(old_block, new_block)
else:
    print("Could not find the exact fetch block to replace.")

# Also update the catch block to be more friendly and display the error
old_catch = """    } catch (error) {
      console.error(error);
      alert('Erro ao gerar a legenda. Tente novamente.');
    } finally {"""

new_catch = """    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Erro ao gerar a legenda. Tente novamente.');
    } finally {"""

if "catch (error)" in content:
    content = content.replace(old_catch, new_catch)
    # just in case it was already typed as any or something else:
    content = re.sub(r'\} catch \(error\) \{[\s\S]*?\} finally \{', 
    """} catch (error: any) {
      console.error(error);
      alert(error.message || 'Erro ao gerar a legenda. Tente novamente.');
    } finally {""", content)


with open('src/App.tsx', 'w') as f:
    f.write(content)

