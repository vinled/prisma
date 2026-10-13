# 🏢 POST NA MÃO — Documentação Completa & Arquitetura Técnica

> **Revisão local — 12/10/2026:** para abrir a versão atual, dê dois cliques em **Iniciar PostNaMao.bat**. Consulte **README.md** e **ANALISE_DO_PROJETO.md** para as instruções e o estado validado. O restante deste documento registra o planejamento original e contém descrições que não correspondem integralmente ao código recebido.
>
> Na versão revisada, o Feed usa **1080 × 1350 (4:5)** e o Story usa **1080 × 1920 (9:16)**. A exportação atual é em PNG por foto: o ZIP descrito abaixo não estava implementado. As artes autenticadas também tentam sincronizar com a tabela `properties` e o bucket `fotos_imoveis`, além do armazenamento local. O servidor carrega `.env` e `.env.local`; as chaves privadas não são enviadas ao navegador. Os 282 arquivos históricos foram preservados em `historico/scripts-antigos` e as APIs duplicadas do servidor foram substituídas pelo reaproveitamento dos arquivos em `api`.

> **Post Na Mão** é uma plataforma SaaS B2B/B2C projetada especificamente para corretores de imóveis e imobiliárias criarem artes publicitárias de alto padrão para redes sociais (Feed 1:1 e Stories 9:16) em segundos, sem a necessidade de habilidades de design gráfico ou softwares complexos como Canva, Figma ou Photoshop.

---

## 📑 Sumário

1. [Visão Geral & Proposta de Valor](#1-visão-geral--proposta-de-valor)
2. [Como Funciona (Fluxo de Usuário & UX)](#2-como-funciona-fluxo-de-usuário--ux)
   - [Princípio de Progressive Disclosure](#princípio-de-progressive-disclosure)
   - [O Fluxo em 4 Etapas](#o-fluxo-em-4-etapas)
   - [Automação de Marca ("Minha Marca")](#automação-de-marca-minha-marca)
3. [Catálogo de Estilos Visuais (Templates)](#3-catálogo-de-estilos-visuais-templates)
4. [Por Debaixo do Capô (Arquitetura Técnica)](#4-por-debaixo-do-capô-arquitetura-técnica)
   - [Stack Tecnológica](#stack-tecnológica)
   - [Estrutura de Pastas e Componentes](#estrutura-de-pastas-e-componentes)
   - [Motor de Processamento e Exportação de Imagem](#motor-de-processamento-e-exportação-de-imagem)
   - [Backend & APIs RESTful (`server.ts`)](#backend--apis-restful-serverts)
   - [Integração com Inteligência Artificial (Google Gemini)](#integração-com-inteligência-artificial-google-gemini)
   - [Sistema de Pagamento & Assinaturas (Asaas)](#sistema-de-pagamento--assinaturas-asaas)
   - [Autenticação e Banco de Dados (Supabase)](#autenticação-e-banco-de-dados-supabase)
5. [Variáveis de Ambiente](#5-variáveis-de-ambiente)
6. [Scripts Disponíveis](#6-scripts-disponíveis)
7. [Segurança & Boas Práticas](#7-segurança--boas-práticas)

---

## 1. Visão Geral & Proposta de Valor

### O Problema do Corretor de Imóveis
- O corretor tira fotos de um imóvel com o celular logo após uma visita ou captação.
- Precisa divulgar rápido no WhatsApp, Instagram e portais antes da concorrência.
- Softwares convencionais (Canva, Photoshop) exigem selecionar fontes, ajustar grades, alinhar ícones, formatar preços e recortar fotos — processo demorado e propenso a erros visuais.

### A Solução do Post Na Mão
- **Filosofia Central:** *"Coloquei a foto. Preenchi o básico. Escolhi um estilo. Pronto."*
- O software toma as decisões de design (hierarquia tipográfica, contraste, posicionamento do selo, cálculo de badge e enquadramento) pelo usuário.
- O resultado visual é gerado instantaneamente no navegador em qualidade de estúdio (1080×1080 e 1080×1920 pixels).

---

## 2. Como Funciona (Fluxo de Usuário & UX)

### Princípio de Progressive Disclosure
A interface aplica **revelação progressiva**. Em vez de apresentar um formulário com dezenas de campos, o corretor é exposto apenas ao mínimo indispensável para gerar o primeiro post.

```
┌──────────────┐     ┌───────────────────────┐     ┌──────────────┐     ┌─────────────────────┐
│ 1. FOTO      │ ──> │ 2. DADOS ESSENCIAIS   │ ──> │ 3. ESTILO    │ ──> │ 4. RESULTADO & EXPORT│
│ (Upload/HEIC)│     │ (Tipo, Preço, Bairro) │     │ (6 templates)│     │ (Feed, Story, Zip)  │
└──────────────┘     └───────────────────────┘     └──────────────┘     └─────────────────────┘
                               │
                       [+ Mais Informações]
                       (Suítes, Lazer, Código,
                        Porteira Fechada, etc.)
```

### O Fluxo em 4 Etapas

#### Etapa 1: Foto
- Suporte a múltiplas fotos simultâneas com miniatura interativa.
- Arrastar e soltar (Drag and drop) ou clique para seleção.
- Conversão transparente de fotos do iPhone (`.heic`/`.heif`) diretamente no navegador.
- Definição da foto de capa principal com 1 clique e ordenação simples.

#### Etapa 2: Informações Essenciais
Os dados foram categorizados em três níveis de prioridade:
1. **Nível 1 (Essencial - Visível Imediatamente):**
   - Finalidade (Venda ou Locação);
   - Tipo de Imóvel (Apartamento, Casa, Cobertura, etc.);
   - Bairro e Cidade;
   - Preço (com máscara monetária brasileira automática);
   - Área privativa (m²);
   - Quartos e Vagas.
2. **Nível 2 e 3 (Opcionais - Agrupados em "+ Mais informações"):**
   - Suítes, Banheiros;
   - Código do Imóvel (ex: `AP0421`);
   - Preço anterior (para efeito "De / Por");
   - Porteira Fechada (toggle);
   - Despesas de Locação (Condomínio, IPTU ou Pacote);
   - Lazer, Comodidades e Diferenciais (piscina, varanda gourmet, academia, etc.);
   - Chamada personalizada / Headline.

#### Etapa 3: Estilo Visual
- O usuário escolhe entre **6 linguagens visuais pré-formatadas**.
- O estilo **Modern** vem pré-selecionado como *"Recomendado"*, eliminando indecisão.
- Miniaturas visuais fiéis ao template orientam a escolha sem necessidade de ler descrições técnicas.

#### Etapa 4: Resultado & Ajustes Rápidos
- Visualização imediata do post com zoom automático e proporção correta.
- Alternância instantânea de formato: **Feed (1:1)** vs **Story (9:16)**.
- **Selos de Destaque:** Aplicação com 1 clique de selos comerciais como:
  - *Lançamento*, *Exclusividade*, *Oportunidade*, *Preço Reduzido*, *Financiamento Disponível*, *Vendido*, *Alto Padrão*.
- **Ajustes de Imagem:** Controle de opacidade do gradiente de contraste e enquadramento horizontal da foto.
- **Exportação:** Download direto em PNG de alta definição ou exportação em lote compactada em `.zip`.

### Automação de Marca ("Minha Marca")
O corretor cadastra seus dados de marca **uma única vez**:
- Logotipo (com fundo transparente PNG/SVG/WEBP);
- Nome do Corretor ou Imobiliária;
- Número do CRECI;
- WhatsApp de contato.

**Resultado:** Em todas as artes geradas, os dados do corretor e o logotipo são inseridos automaticamente no rodapé do template com proporção e espaçamento calibrados.

---

## 3. Catálogo de Estilos Visuais (Templates)

Todos os templates são construídos com Tailwind CSS e utilizam contraste acessível e tipografia balanceada:

| Nome do Estilo | Arquivo | Estética Visual | Melhor Indicado Para |
| :--- | :--- | :--- | :--- |
| **Modern** *(Recomendado)* | `ModernTemplate.tsx` | Cards limpos, cantos arredondados, gradientes suaves e ícones modernos | Apartamentos urbanos, lançamentos e padrão intermediário |
| **Card Vidro** | `MinimalistTemplate.tsx` | Glassmorphism, desfoque de fundo (`backdrop-blur`), design clean e contemporâneo | Imóveis modernos, estúdios e lofts |
| **Premium Dark** | `LuxuryTemplate.tsx` | Fundo escuro profundo, tipografia serifada/elegante e detalhes dourados/âmbar | Mansões, coberturas e imóveis de alto padrão |
| **Impacto** | `BoldTemplate.tsx` | Tipografia em caixa alta, tarjas de destaque com alto contraste e presença comercial forte | Oportunidades, queimas de estoque e feirões |
| **Clean** | `ElegantTemplate.tsx` | Tons claros, linhas finas, espaçamento editorial e refinamento visual | Casas de condomínio, vilas e arquitetura clássica |
| **My Way** | `MyWayTemplate.tsx` | Flexibilidade de realce com paleta adaptável ao gosto do corretor | Posts versáteis para qualquer tipo de imóvel |

---

## 4. Por Debaixo do Capô (Arquitetura Técnica)

### Stack Tecnológica

| Camada | Tecnologia | Função |
| :--- | :--- | :--- |
| **Linguagem** | TypeScript 5.8 | Tipagem estática em 100% do frontend e backend |
| **SPA Framework** | React 19 | Interface declarativa, hooks e renderização reativa |
| **Build & Bundler** | Vite 6 + ESBuild | Transpilação instantânea, bundling e servidor dev |
| **Estilização** | Tailwind CSS v4 | Utilitários modernos, variáveis CSS nativas |
| **Servidor Node** | Express 4 + TSX | Servidor de desenvolvimento e produção com proxy de APIs |
| **Banco & Auth** | Supabase JS v2 | Autenticação, perfis de usuários e persistência de dados |
| **Inteligência Artificial**| `@google/genai` (Gemini 3.6 Flash)| Geração server-side de legendas para redes sociais |
| **Gateway de Pagamento** | Asaas API v3 | Cobrança recorrente (cartão/PIX) e webhooks de status |
| **Manipulação Gráfica** | `html-to-image`, `dom-to-image-more` | Rasterização de nós DOM do navegador para Canvas/PNG |
| **Processamento Local** | `browser-image-compression`, `heic2any`| Conversão de HEIC e compressão de imagens no cliente |
| **Empacotamento** | `JSZip` + `FileSaver` | Geração de arquivos ZIP no navegador sem onerar o servidor |

---

### Estrutura de Pastas e Componentes

```
post-na-mao/
├── server.ts                  # Backend Express: APIs, Webhooks, Gemini e proxy Vite
├── index.html                 # Ponto de entrada HTML com tratamento de sandbox
├── package.json               # Dependências e scripts do sistema
├── vite.config.ts             # Configuração do Vite com Tailwind v4 e React
├── src/
│   ├── main.tsx               # Bootstrap da aplicação React
│   ├── App.tsx                # Orquestrador central de estado, etapas e telas
│   ├── index.css              # Importação global do Tailwind CSS v4
│   ├── types.ts               # Interfaces TypeScript (PropertyDetails, BrandKit, etc.)
│   ├── components/
│   │   ├── PropertyForm.tsx          # Formulário em etapas (Progressive Disclosure)
│   │   ├── ImageUploader.tsx         # Upload múltiplo, HEIC e ordenação de fotos
│   │   ├── TemplateSelector.tsx      # Carrossel/grade dos 6 estilos visuais
│   │   ├── AspectRatioSelector.tsx   # Alternador Feed (1:1) / Story (9:16)
│   │   ├── TemplateRenderer.tsx      # Renderizador do template ativo
│   │   ├── BrandKitForm.tsx          # Gestão dos dados da marca do corretor
│   │   ├── LogoUploader.tsx          # Upload com preview do logotipo
│   │   ├── AmenitiesSelector.tsx     # Seletor de comodidades e lazer
│   │   ├── MyProperties.tsx          # Histórico de artes criadas
│   │   ├── MyAccount.tsx             # Painel da conta e cancelamento de assinatura
│   │   ├── PaywallModal.tsx          # Modal de conversão para o Plano Pro
│   │   ├── CheckoutModal.tsx         # Integração com checkout Asaas
│   │   ├── LandingPage.tsx           # Página pública de conversão e apresentação
│   │   ├── PostNaMaoLogo.tsx         # Logotipo vetorial da plataforma
│   │   ├── TermosDeUso.tsx           # Termos legais da plataforma
│   │   └── PoliticaPrivacidade.tsx   # Política de privacidade e LGPD
│   ├── templates/
│   │   ├── ModernTemplate.tsx        # Estilo Modern (Padrão/Recomendado)
│   │   ├── MinimalistTemplate.tsx    # Estilo Card Vidro
│   │   ├── LuxuryTemplate.tsx        # Estilo Premium Dark
│   │   ├── BoldTemplate.tsx          # Estilo Impacto
│   │   ├── ElegantTemplate.tsx       # Estilo Clean
│   │   ├── MyWayTemplate.tsx         # Estilo My Way
│   │   └── PriceDisplay.tsx          # Componente reutilizável de preço/moeda
│   ├── lib/
│   │   └── supabase.ts               # Inicialização do cliente Supabase
│   └── utils/
│       ├── checkout.ts               # Helpers de validação e checkout
│       └── formatters.ts             # Máscaras de CPF, Moeda (BRL) e Telefone
```

---

### Motor de Processamento e Exportação de Imagem

A renderização visual é **100% client-side**, o que garante privacidade total e custo zero de infraestrutura com servidores de renderização gráfica:

1. **Conversão de Formatos Proprietários (`heic2any`):**
   - Dispositivos Apple salvam fotos em `.HEIC`. Ao serem selecionadas, o script transcodifica a imagem para Blob JPEG na memória do navegador antes de enviar ao fluxo.
2. **Compressão Rápida (`browser-image-compression`):**
   - Fotos de câmeras profissionais (15MB+) são reamostradas para resoluções otimizadas, evitando estouro de memória no DOM.
3. **Rasterização em Alta Resolução (`html-to-image`):**
   - O elemento do template DOM é capturado através da árvore CSS e convertido em `<canvas>` com `pixelRatio: 2` (ou 3), garantindo imagens ultra-nítidas para telas de alta densidade (Retina):
     - **Feed:** 1080 × 1080 px
     - **Story:** 1080 × 1920 px
4. **Exportação em Lote (`jszip`):**
   - Permite que o corretor gere de uma só vez um pacote `.zip` contendo todas as fotos do imóvel em ambos os formatos com nomenclatura organizada (`imovel-feed-1.png`, `imovel-story-1.png`, etc.).

---

### Backend & APIs RESTful (`server.ts`)

O arquivo `server.ts` roda em Node.js com Express e gerencia as integrações seguras:

#### 1. `POST /api/generate-caption`
- **Finalidade:** Geração de legendas profissionais com IA para Instagram e WhatsApp.
- **Segurança:**
  - `express-rate-limit`: Limite de 10 requisições por minuto por IP.
  - Validação obrigatória de Token JWT via cabeçalho `Authorization: Bearer <token>` consultado no Supabase Auth.
  - Verificação de privilégios de plano (`pro`) para públicos-alvo exclusivos (ex: investidores e alto padrão).
- **Execução:** Comunica-se com a SDK `@google/genai` utilizando o modelo `gemini-3.6-flash`.

#### 2. `POST /api/create-checkout`
- **Finalidade:** Inicia a assinatura recorrente do Plano Pro via Asaas.
- **Fluxo:**
  1. Autentica o usuário pelo JWT do Supabase.
  2. Cria ou localiza o cliente no Asaas pelo CPF e e-mail (`/v3/customers`).
  3. Gera uma assinatura mensal recorrente de R$ 49,90 (`/v3/subscriptions`).
  4. Executa polling inteligente até recuperar a URL da fatura (`invoiceUrl`).
  5. Retorna a URL segura para o frontend redirecionar o corretor.

#### 3. `POST /api/cancel-subscription`
- **Finalidade:** Permite ao corretor cancelar a renovação automática da assinatura diretamente no painel "Minha Conta".
- **Fluxo:**
  1. Localiza a assinatura ativa vinculada ao `externalReference: user.id` no Asaas.
  2. Dispara requisição de exclusão (`DELETE /v3/subscriptions/:id`).
  3. Atualiza o perfil no Supabase para o plano `free` utilizando a `SUPABASE_SERVICE_ROLE_KEY`.

#### 4. `POST /api/webhook/asaas`
- **Finalidade:** Recebe notificações assíncronas do Asaas em tempo real.
- **Segurança:** Valida o cabeçalho `asaas-access-token` contra o segredo `ASAAS_WEBHOOK_TOKEN`.
- **Eventos Processados:**
  - `PAYMENT_RECEIVED` / `PAYMENT_CONFIRMED`: Eleva o usuário no Supabase para `plan: 'pro'`.
  - `PAYMENT_OVERDUE` / `PAYMENT_DELETED` / `PAYMENT_REFUNDED` / `PAYMENT_CHARGEBACK_REQUESTED`: Rebaixa o plano do usuário para `plan: 'free'`.

---

### Integração com Inteligência Artificial (Google Gemini)

O Post Na Mão utiliza o modelo **Gemini 3.6 Flash** configurado com prompts focados em copywriting persuasivo para o mercado imobiliário brasileiro:
- **Ganchos de Atenção:** Manchete curta e cativante.
- **Ficha Técnica Formatada:** Dormitórios, vagas, m² e localização organizados com emojis clean.
- **Chamada para Ação (CTA):** Direcionamento estratégico para direct ou link da bio/WhatsApp.
- **Hashtags Segmentadas:** Selecionadas de acordo com o bairro e tipo de imóvel.

---

### Sistema de Pagamento & Assinaturas (Asaas)

A monetização é baseada no modelo SaaS Freemium:
- **Plano Free:**
  - Criação de artes com recursos essenciais;
  - Marca d'água discreta ou limitações de geração avançada.
- **Plano PRO (R$ 49,90/mês):**
  - Remoção de qualquer marca d'água;
  - Legendas ilimitadas com IA para múltiplos públicos;
  - Download em lote de todas as fotos e formatos em ZIP;
  - Acesso prioritário a novos templates.

---

### Autenticação e Banco de Dados (Supabase)

O Post Na Mão adota uma estratégia híbrida resiliente:
- **Autenticação:** Supabase Auth (E-mail + Senha, confirmação de conta, recuperação de senha).
- **Tabela `profiles`:**
  - `id`: UUID (chave primária estrangeira de `auth.users`);
  - `plan`: `'free'` ou `'pro'`;
  - `brand_kit`: Objeto JSON com `{ logo, name, creci, whatsapp, isSaved }`.
- **Persistência de Artes Salvas ("Meus Imóveis"):**
  - Armazenamento em `localStorage` para navegação ultrarrápida e sem latência, com suporte a recuperação e edição instantânea.

---

## 5. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
# Google Gemini API
GEMINI_API_KEY="sua_chave_gemini_api"

# URL da Aplicação
APP_URL="http://localhost:3000"

# Supabase Auth e Banco de Dados
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_ANON_KEY="sua_chave_anonima_supabase"
SUPABASE_SERVICE_ROLE_KEY="sua_chave_service_role_supabase"

# Gateway de Pagamentos Asaas
ASAAS_API_KEY="sua_chave_api_asaas"
ASAAS_WEBHOOK_TOKEN="seu_token_de_seguranca_do_webhook"
```

---

## 6. Scripts Disponíveis

No arquivo `package.json`:

```bash
# Iniciar ambiente de desenvolvimento (Express + Vite HMR na porta 3000)
npm run dev

# Verificar tipagem TypeScript sem gerar arquivos
npm run lint

# Construir pacote de produção (Vite SPA + Bundle esbuild do server.ts)
npm run build

# Iniciar servidor compilado em produção
npm start

# Limpar artefatos de build
npm run clean
```

---

## 7. Segurança & Boas Práticas

1. **Proteção de Chaves de API:** Chaves sensíveis como `GEMINI_API_KEY`, `ASAAS_API_KEY` e `SUPABASE_SERVICE_ROLE_KEY` **nunca** são expostas ao navegador; ficam restritas ao `server.ts`.
2. **Rate Limiting:** Proteção contra ataques de força bruta e sobrecarga nas rotas públicas e de inteligência artificial.
3. **Validação de Webhook:** O endpoint do webhook do Asaas valida token com comparação estrita antes de efetuar qualquer alteração no banco de dados.
4. **Isolamento de Erros no iFrame:** Tratamento dedicado no `index.html` e configuração no `vite.config.ts` (`hmr: false`) para garantir estabilidade em ambientes de visualização encapsulados.
