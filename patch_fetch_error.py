import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_fetch = """      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erro na API');
      }"""

new_fetch = """      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na API:", errorText);
        throw new Error("Erro na comunicação com o servidor. Tente novamente.");
      }"""

content = content.replace(old_fetch, new_fetch)

# Need to also send targetAudience in the body so the server can validate
old_body = """body: JSON.stringify({ promptText })"""
new_body = """body: JSON.stringify({ promptText, targetAudience })"""
content = content.replace(old_body, new_body)

# And replace the alert with a toast if there's one, or at least a cleaner string message.
# The user wants "uma mensagem amigável no UI (ex: um Toast ou texto em vermelho) informando que houve uma falha de comunicação"
# We can use the existing `generatedCaption` state to display the error inline, or just an alert for now if no toast exists. Wait, if we use generatedCaption, it shows right in the text area!
old_catch = """    } catch (error: any) {
      console.error('ERRO DETALHADO DA API:', error);
      alert('Erro ao gerar copy: ' + (error.message || JSON.stringify(error)));
    } finally {"""
new_catch = """    } catch (error: any) {
      console.error('ERRO DETALHADO DA API:', error);
      setGeneratedCaption('Falha na comunicação com o servidor. Por favor, tente gerar o texto novamente.');
    } finally {"""

content = content.replace(old_catch, new_catch)

with open('src/App.tsx', 'w') as f:
    f.write(content)
