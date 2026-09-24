# Coonto 1.2.0 — catálogo inicial, Coonto Club e sugestões

**Destino:** ambiente de desenvolvimento `dev.coonto.com`.  
**Origem:** atualização do kit Coonto 1.1.0 (Caddy/PostgreSQL).  
**Status:** código compilado; implantação no servidor e testes com banco real ainda pendentes.

## O que muda

- O catálogo apresenta três obras iniciais: *O Alienista* (disponível na validação), *Dom Casmurro* e *Memórias Póstumas de Brás Cubas* (em preparação). Não há links falsos de acesso às duas últimas.
- A proposta comercial fica explícita: o Coonto Club como produto será lançado com as três experiências completas e revisadas; depois, a meta é ao menos uma nova edição por mês. Outras 12 candidatas aparecem em uma lista posterior, sem promessa de data.
- Duas ofertas mostram valores **de referência** riscados e acesso gratuito durante a validação: obra individual R$ 9,90 e Club R$ 19,90/mês. O botão leva à obra disponível; não ativa assinatura nem pagamento. O administrador altera os valores em `/backoffice`, sem editar o código.
- A obra disponível pode ser salva para uso offline dentro da conta em “Salvar neste aparelho”, recurso já existente. Nenhum HTML da obra é oferecido como download público.
- O catálogo ganha formulário de sugestões de obras. As sugestões ficam em `work_suggestions` e as 50 mais recentes aparecem no backoffice para avaliação editorial.

## Arquivos principais alterados

`app/catalogo/page.tsx`, `app/obra/o-alienista/page.tsx`, `app/backoffice/page.tsx`, `app/backoffice/actions.ts`, `app/api/sugestoes-obras/route.ts`, `components/suggestion-form.tsx`, `lib/commercial.ts`, `db/migrations/002_work_suggestions.sql`, `app/globals.css` e `VERSION`.

## Instalação pelo responsável técnico

1. Fazer backup dos arquivos e do PostgreSQL da versão existente antes de substituir o código. Conferir qual kit e diretório são usados no servidor; o pacote pressupõe o kit 1.1.0, mas pode haver mudanças feitas depois dele.
2. Extrair o pacote em um diretório de preparação e comparar suas alterações locais, `.env` e configuração do Caddy. **Preservar o `.env` real e os segredos existentes.** Não substituir diretamente o diretório ativo sem comparação.
3. Aplicar a migração `db/migrations/002_work_suggestions.sql` antes da atualização da aplicação. O `compose.yaml` do kit executa os arquivos SQL em ordem no serviço de migração; a migração usa `IF NOT EXISTS` e `ON CONFLICT` para ser repetível. Confirmar que a migração terminou sem erro.
4. Construir a nova imagem, iniciar e conferir `/api/health`. O comando de atualização existente do kit (`./coonto.sh update`) deve ser usado apenas depois da conferência do ambiente e do backup.
5. Testar `/catalogo` em celular e desktop: apenas *O Alienista* abre; as outras duas aparecem indisponíveis; preços estão riscados e acompanhados de “valores de referência”; não ocorre cobrança. Testar “Salvar neste aparelho” em uma conta autorizada.
6. Enviar uma sugestão de teste e confirmar que apareceu em `/backoffice`. Salvar um novo preço no backoffice, conferir catálogo e página de *O Alienista*, e voltar aos valores decididos pelo proprietário.
7. Se qualquer etapa falhar, restaurar versão anterior e backup do banco conforme a rotina existente. A migração adiciona tabelas e não remove dados antigos.

**Importante:** uma edição completa de *Dom Casmurro* ou *Memórias Póstumas* ainda não está neste pacote. A publicação de cada uma exige produção, curadoria e integração da experiência. A assinatura só deve ser ativada depois das três experiências completas, da capacidade mensal validada e da configuração comercial aprovada.

## Verificação local realizada

`npm run typecheck` e `npm run build` concluíram sem erros. A instalação, o envio real do formulário e o painel com PostgreSQL precisam ser conferidos no servidor de desenvolvimento.
