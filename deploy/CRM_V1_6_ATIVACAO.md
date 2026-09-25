# Ativação do CRM v1.6 no ambiente de desenvolvimento

O CRM foi separado da experiência pública pelo endereço `crm.dev.coonto.com`. O código mantém o mesmo PostgreSQL e exige a função `admin`. Em `dev.coonto.com/backoffice`, a aplicação responde com 404; o domínio administrativo mostra apenas login, CRM, pesquisa e arquivos necessários à interface.

## DNS necessário

Na zona de `coonto.com`, criar **CNAME `crm.dev` → `dev.coonto.com`** (ou um registro A para o mesmo IP público de `dev.coonto.com`, se a configuração da zona não permitir CNAME). Não substituir o registro existente de `dev`.

Após a propagação, confirmar que `https://crm.dev.coonto.com/login` abre com HTTPS e que `https://crm.dev.coonto.com/backoffice` pede autenticação. O Caddy recebe a configuração do novo domínio pelo deploy automático da branch `develop`. O arquivo `.env` existente pode permanecer como está: o instalador deriva `CRM_DOMAIN=crm.${DOMAIN}`; o valor pode ser definido explicitamente se necessário.

## Conferência

1. Entrar com um e-mail presente em `ADMIN_EMAILS` no servidor. O cookie administrativo fica no domínio do CRM.
2. Confirmar as telas Painel, Contas, Atividade, Parcerias e Pesquisa.
3. Confirmar 404 em `https://dev.coonto.com/backoffice` e em páginas públicas acessadas pelo domínio do CRM.
4. Criar uma organização de teste, vincular uma conta já cadastrada, criar uma turma e atribuir uma vaga; validar que o limite de vagas é respeitado.
5. Criar um link de indicação para um contato de teste e abrir `https://dev.coonto.com/r/CODIGO` em janela privada; após entrar, verificar a atribuição no CRM.

Oportunidades guardam **potencial estimado**, sem comissão automática, cobrança ou pagamento. A nova migração `007_crm_intelligence.sql` é aditiva e roda antes de iniciar a aplicação.
