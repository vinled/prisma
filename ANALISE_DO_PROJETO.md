# Revisão do PostNaMão

O PostNaMão é um editor de artes imobiliárias feito com React e TypeScript. A interface é executada no navegador; o servidor Node/Express serve o aplicativo e intermedeia Gemini e Asaas. Supabase fornece login, dados de conta, fotos e imóveis salvos na nuvem quando configurado.

## Organização da pasta

O excesso da raiz era real: havia **281 scripts avulsos de alteração/teste e um bun.lock**, totalizando **282 arquivos históricos**. Os scripts traziam nomes como `fix_*`, `patch_*` e `update_*`. Eles não eram importados pelo aplicativo nem usados pelos comandos de execução.

Todos foram movidos para **historico/scripts-antigos**, com inventário de nomes e tamanhos. Nenhum foi apagado ou executado. O projeto agora utiliza **npm** e **package-lock.json** como referência de instalação. A pasta `node_modules` pode conter milhares de arquivos: isso é normal e corresponde às bibliotecas instaladas automaticamente.

Também foram removidas da lista de dependências oito bibliotecas/tipagens sem uso no código e a declaração duplicada de Vite. As pastas `src`, `api`, `public`, `scripts` e os arquivos de configuração continuam necessários. A pasta `assets` foi preservada, pois contém metadados do ambiente de origem.

## Correções realizadas

- Arquivo de dependências sincronizado: `npm ci` falhava porque o roteador estava ausente do lockfile.
- Servidor passa a carregar `.env` e `.env.local` antes de executar as integrações.
- Removida a definição que podia incluir `GEMINI_API_KEY` no JavaScript público.
- Servidor local e publicação reutilizam os mesmos quatro arquivos de API, evitando duas implementações divergentes.
- Inicialização com porta configurável, mensagens claras de falha e acesso local limitado ao próprio computador por padrão.
- Iniciador Windows por duplo clique, com instalação inicial, abertura do navegador após a confirmação do servidor e reaproveitamento de servidor existente.
- `npm start` inicia realmente o modo de produção; `npm run clean` passa a funcionar no Windows.
- Demonstração local do editor sem cadastro, disponível apenas em desenvolvimento no endereço `/demo` pelo próprio computador.
- Marca e logotipo da demonstração são salvos localmente, sem tentativa de envio ao Supabase.
- Fotos enviadas passam a usar dados persistentes, evitando URLs temporárias que deixavam de funcionar após recarregar.
- Salvamento informa falta de espaço e não apresenta sucesso quando o navegador não consegue armazenar os dados.
- Armazenamento local separado por usuário e para a demonstração; dados de uma conta não são automaticamente misturados com os de outra. O armazenamento legado sem identificação de usuário foi preservado no navegador, mas não é importado automaticamente, pois não informa seu proprietário.
- Removido carregamento duplicado de conta e chamadas assíncronas de banco dentro do callback de autenticação, que podiam provocar travamento.
- Aviso de ativação Pro aparece apenas em atualizações para Pro, em vez de também aparecer ao rebaixar o plano.
- URLs de imagem mantêm os parâmetros originais, incluindo assinaturas temporárias de acesso.
- Antes do envio ao GitHub, o carregamento de conta foi ajustado para recuperar as artes locais mesmo sem resposta da nuvem. Imóveis com upload pendente não são sobrescritos por versões antigas ou incompletas do banco.
- Feed corrigido para **1080 × 1350 (4:5)**; Story mantém **1080 × 1920 (9:16)**.
- PNGs recebem nomes organizados com canal, formato e data. Um link permite repetir o download se o navegador bloquear a abertura automática.
- Interface usa Inter; títulos priorizam Inter Display quando disponível, com fallback para Inter. Estilos próprios de artes imobiliárias legadas foram preservados.
- API de legendas valida tipo/tamanho do texto e consulta o perfil com o token do usuário, respeitando as políticas de acesso do banco.
- Cancelamento verifica configuração, falhas do Asaas e atualização do perfil. Uma falha de exclusão não rebaixa o usuário nem retorna sucesso.
- Checkout valida o comprimento de CPF/CNPJ no servidor e codifica o e-mail usado na busca de cliente.
- README substituído por instruções específicas da ferramenta; documentação original ganhou nota sobre divergências.

## Verificações

- Verificação TypeScript: aprovada.
- Compilação da interface e servidor: aprovada. Há um aviso de tamanho de pacote, especialmente do conversor HEIC, que já é carregado sob demanda. Não impede a execução.
- Quatro testes automatizados das APIs: aprovados, sem chamar serviços reais nem gerar cobranças.
- Servidor local: endpoint de saúde respondeu corretamente; página `/demo` respondeu HTTP 200.
- Servidor compilado: iniciou em modo de produção na porta 3001 e respondeu HTTP 200; foi encerrado após a verificação.
- Navegador: editor abriu; foto demonstrativa foi processada; informações geraram a prévia; imóvel e foto continuaram disponíveis após recarregar e reabrir em Meus Imóveis.
- Exportação: o conteúdo PNG gerado pelo aplicativo teve assinatura PNG válida e dimensões verificadas de **1080 × 1350**. O navegador integrado não notificou o download automático durante o teste; o link de repetição ficou disponível, e o conteúdo gerado foi verificado diretamente.

## O que depende de configuração ou revisão posterior

Não foi encontrado `.env`/`.env.local` com credenciais na pasta recebida. Não foram criadas contas, feitas cobranças, canceladas assinaturas reais ou alterados serviços externos.

1. **Supabase:** configurar tabelas, políticas RLS e buckets, além das URLs de retorno do login. O esquema do banco não está incluído no projeto. É necessário garantir no banco que somente o backend possa mudar o plano e que cada usuário acesse apenas seus dados. A sincronização real, o login e o recebimento de atualizações não puderam ser validados sem credenciais.
2. **IA:** configurar Gemini e Supabase e validar geração autenticada. O modelo existente foi mantido; sua configuração consta na documentação oficial: https://ai.google.dev/gemini-api/docs/models.
3. **Pagamentos:** configurar Asaas e webhook. Antes de uso comercial, testar em sandbox duplicidade de checkout, eventos fora de ordem, reenvio de webhook e cancelamento de múltiplas assinaturas. O checkout atual ainda precisa de uma estratégia de idempotência persistente para impedir cobranças duplicadas em requisições simultâneas. O limitador local não substitui essa proteção.
4. **Armazenamento:** fotos locais são limitadas pela capacidade do navegador. Sincronização em nuvem, falhas de upload e resolução de conflitos precisam de teste com o banco real.
5. **Documentação original:** descreve exportação ZIP e múltiplos formatos em lote; o código recebido implementava downloads de PNG por foto. A revisão não criou um exportador ZIP.
6. **Identidade visual:** modelos antigos geram artes de clientes com escolhas como fontes serifadas e dourado. A revisão não redesenhou esses modelos nem substituiu o logotipo. Uma revisão visual completa pode padronizar os tokens da interface e distinguir a marca da plataforma da marca do corretor.
7. **Credenciais antigas:** um script histórico contém uma sequência que parece uma chave de pagamento. O histórico foi excluído do versionamento. Se a chave estiver ativa, deve ser substituída no painel do provedor. Seu conteúdo não foi exposto nem utilizado nesta revisão.

O resultado validado desta revisão é uma demonstração local utilizável e uma base corrigida. A revisão não equivale a uma homologação das integrações em produção.

## Vínculo com o GitHub

A pasta foi vinculada ao histórico existente de `https://github.com/vinled/prisma`, branch `main`, preservando os arquivos revisados. As variáveis reais continuam no ambiente da Vercel: `.env.local`, bibliotecas e backups foram excluídos do envio. Os scripts antigos deixam de fazer parte da árvore atual do repositório, permanecendo no backup local e nos commits anteriores. Uma possível chave encontrada em um script antigo pode continuar acessível no histórico; removê-la da versão atual não substitui sua revogação no provedor.

## Salvamento automático — 13/10/2026

O editor agora grava rascunhos automaticamente no IndexedDB, isolados por conta, com recuperação das fotos e da etapa em andamento. A sincronização usa a tabela existente `properties`, grava uma revisão no JSON `details.editor_meta` e impede que uma atualização antiga sobrescreva outra versão. Envios são serializados e fotos iguais reutilizam o mesmo caminho de armazenamento. Falhas de rede e limites de plano preservam o rascunho local.

O banco Supabase conectado foi identificado e sua URL corresponde ao projeto usado pelo site publicado. A leitura das tabelas confirmou os campos utilizados pelo código. O salvamento passou por testes de fotos grandes, isolamento de contas, falha de banco, edição durante envio, conflitos e escritas concorrentes. Na demonstração local, campos e foto foram recuperados após recarregar sem clicar em salvar.

## Proteção dos pagamentos — 13/10/2026

A migração `postnamao_billing_safety` adicionou um registro privado de operações e eventos ao banco existente. Uma trava por conta impede operações simultâneas de checkout, cancelamento e webhook. Assinaturas existentes são reutilizadas; respostas inconclusivas não provocam uma nova criação automática. Identificadores do Asaas são registrados para recuperação. Eventos são aplicados uma única vez, com atualização de plano e registro no mesmo commit do banco. Eventos atrasados usam a situação atual do provedor para decidir o plano.

O plano mensal continua R$ 49,90; as variáveis e o endereço de produção continuam os anteriores. A rota `/api/webhook/asaas` e o token configurado continuam válidos. O controle de acesso foi reforçado: um cliente não pode alterar seu próprio plano para Pro, e as políticas de gravação de fotos e logos passaram a exigir propriedade do arquivo. O limite de cinco imóveis é serializado no banco, preservando o limite já existente.

Os testes usam respostas simuladas do Asaas, sem criar cobranças, e um PostgreSQL local para validar a migração. Depois da aplicação, as funções de trava, duplicidade e proteção de plano também foram verificadas no banco real em uma transação revertida. Nenhum usuário, assinatura ou evento de teste foi mantido no banco. A validação completa com uma transação financeira real continua reservada ao titular da conta.
