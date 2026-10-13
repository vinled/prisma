# PostNaMão — como abrir no seu computador

1. Dê dois cliques em **Iniciar PostNaMao.bat** nesta pasta.
2. Aguarde a mensagem **Pronto!**. O navegador será aberto automaticamente.
3. Mantenha a janela do servidor aberta enquanto usar a ferramenta.
4. Para encerrar, feche essa janela ou pressione **Ctrl+C**.

O endereço padrão é **http://127.0.0.1:3000/demo**. Se o navegador não abrir automaticamente, copie esse endereço para a barra de endereços. A página de apresentação fica em **http://127.0.0.1:3000/**.

O iniciador precisa de **Node.js 22 ou superior**. Esse programa já estava disponível neste computador durante a revisão. Se você copiar o projeto para outra máquina, instale o Node.js pelo site oficial https://nodejs.org/. Na primeira execução, o iniciador instala os componentes necessários pela internet.

## O que a demonstração permite

Adicionar fotos, preencher os dados do imóvel, escolher entre seis estilos, alternar Feed e Story, ajustar a foto, aplicar selos, cadastrar a marca localmente, salvar imóveis neste navegador e gerar PNGs. O Feed usa **1080 × 1350**; o Story usa **1080 × 1920**.

A demonstração usa o plano gratuito, incluindo sua marca d'água. É disponibilizada apenas no servidor de desenvolvimento, acessado pelo próprio computador. Ela não cria uma conta nem modifica assinaturas.

Os arquivos PNG vão para os downloads do navegador. Se o download automático não ocorrer, use o link **PNG pronto · Baixar novamente** que aparece após a geração.

O editor salva o rascunho automaticamente enquanto você trabalha, incluindo fotos, informações, selo, estilo, formato e ajustes. Ao reabrir a página, ele recupera a edição e mostra **Rascunho recuperado**. O status informa se está salvando, salvo neste dispositivo ou sincronizado na nuvem. Quando a internet volta, a ferramenta tenta sincronizar novamente. O botão de salvar continua disponível.

Rascunhos e imóveis locais usam IndexedDB, que suporta melhor o volume das fotos do que o antigo localStorage. Cada conta tem seu próprio espaço. Uma edição feita em outro aparelho não é sobrescrita silenciosamente: o editor preserva o rascunho local e informa o conflito. A recuperação entre aparelhos depende de a edição ter sido sincronizada na nuvem.

As artes da demonstração ficam no navegador e no endereço usado. `localhost` e `127.0.0.1` têm armazenamentos diferentes: use sempre o mesmo endereço. Limpar os dados do navegador apaga as artes locais. Se faltar espaço, a ferramenta informa que não conseguiu salvar; reduza as fotos ou remova artes antigas.

## Login, nuvem, IA e pagamentos

Esses recursos dependem de serviços externos. A pasta recebida não tinha credenciais locais configuradas. Para ativá-los:

1. Copie **.env.example** para **.env.local**.
2. Preencha as chaves do Supabase e, quando necessário, Gemini e Asaas.
3. Reinicie o servidor e abra a página de apresentação, sem `/demo`, para fazer login.

Nunca coloque chaves privadas em variáveis que começam com `VITE_`: essas variáveis são públicas no navegador. Use `GEMINI_API_KEY`, `ASAAS_API_KEY`, `ASAAS_WEBHOOK_TOKEN` e `SUPABASE_SERVICE_ROLE_KEY` somente no servidor.

O banco precisa das tabelas `profiles` e `properties`, das políticas de acesso por usuário e dos buckets `logos` e `fotos_imoveis`. A configuração desse banco e dos provedores não está incluída nesta pasta e não foi validada com uma conta real.

## Por que existem várias pastas?

| Pasta ou arquivo | Para que serve |
| --- | --- |
| `src` | Código da interface e dos modelos de arte. |
| `public` | Imagens e ícones usados pelo aplicativo. |
| `api` | Login nas integrações, legendas e pagamentos. As rotas locais usam os mesmos arquivos da publicação. |
| `scripts` | Inicialização local e limpeza dos arquivos compilados. |
| `tests` | Verificações das correções nas APIs. |
| `node_modules` | Componentes instalados automaticamente. É normal ter muitos arquivos aqui; não edite essa pasta. |
| `dist` | Versão compilada, recriada pelo comando de compilação. |
| `historico` | Scripts antigos preservados como backup. Não são necessários para usar a ferramenta. |
| `package.json` e `package-lock.json` | Lista de componentes e suas versões. Precisam permanecer juntos. |
| `server.ts` | Servidor local e de produção. |
| `PostNaMao.md` | Documentação original, com uma nota sobre a revisão atual. |
| `ANALISE_DO_PROJETO.md` | Correções, validações e pendências da revisão. |

**Não é necessário mexer nessas pastas para abrir o aplicativo. Use o arquivo .bat.**

## Comandos para manutenção

```text
npm run local     — inicia e abre a demonstração
npm run dev       — inicia o servidor sem abrir o navegador
npm run lint      — verifica o TypeScript
npm test          — verifica os cenários das APIs sem acessar serviços reais
npm run build     — compila a interface e o servidor
npm start         — inicia a versão compilada em produção
npm run clean     — remove somente dist e server.js, funciona no Windows
```

Se a porta 3000 estiver ocupada por outro programa, feche o programa ou configure `PORT=3001` no `.env.local`. O iniciador abre automaticamente o endereço correspondente. Se o PostNaMão já estiver rodando, o iniciador aproveita o servidor existente.
