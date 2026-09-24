# Documentação de Hospedagem e Ambientes — Coonto

Este documento centraliza as informações sobre a infraestrutura, ambientes e fluxo de deploy do projeto Coonto.

## Repositório Oficial
O código-fonte e o histórico de versões estão centralizados no GitHub:
- **Repositório:** `amguarizo/coonto`

## Ambientes e Domínios
O projeto está estruturado em dois ambientes que espelham o status do desenvolvimento:

1. **Ambiente de Desenvolvimento (Dev)**
   - **URL:** `dev.coonto.com.br`
   - **Branch correspondente:** `develop`
   - **Objetivo:** Ambiente para integração e validação de novas features, como a atualização para a versão 1.2.0 que acabou de ser aplicada.

2. **Ambiente de Produção (Alpha)**
   - **URL:** `alpha.coonto.com.br`
   - **Branch correspondente:** `main`
   - **Objetivo:** Ambiente estável. Recebe as modificações da branch `develop` apenas após validação do proprietário, garantindo segurança.

## Arquitetura do Servidor Remoto
Baseado nos scripts de deploy e configuração (`.github/workflows`, `coonto.sh`, `compose.yaml`):

- **Sistema Operacional:** Servidor Linux (Ubuntu).
- **Diretório de Deploy:** Em desenvolvimento, a aplicação é alocada no caminho remoto padrão: `/opt/coonto/dev`.
- **Containers (Docker):**
  - **App:** Aplicação Next.js (Node).
  - **Banco de Dados:** PostgreSQL 16 (imagem alpine) via rede interna.
  - **Migrações:** Execução de scripts `.sql` usando a imagem do Postgres também via container.
- **Proxy Reverso:** Caddy Server, encarregado de repassar as requisições HTTPS diretamente para o container do Next.js.

## Como funciona a publicação (Deploy)
A infraestrutura foi configurada para CI/CD (Integração e Deploy contínuos) pelo **GitHub Actions**:
1. Ao enviar as novas alterações para a respectiva branch (como `develop`), o fluxo do GitHub envia um pacote (`tar.gz`) para o servidor através de SSH/SCP.
2. É efetuada a extração do pacote e o script `coonto.sh install` é engatilhado no servidor.
3. Não há necessidade do proprietário fazer acesso via terminal (SSH) diretamente, pois toda permissão é gerenciada por "Secrets" configuradas no GitHub (`SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY`, etc.).

## Proteção e Automação Remota (Assistência IA)
Para realizar as atualizações da aplicação via chat (sem ferramentas instaladas na máquina física do gestor), utiliza-se o acesso ao GitHub, permitindo à IA:
- Ler os arquivos.
- Criar e enviar commits unicamente na branch `develop`.
- A branch `main` conta com restrição e só pode ser alterada mediante aprovação.
