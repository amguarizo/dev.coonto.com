# Coonto Deployment Kit

Pacote autocontido para instalar a plataforma Coonto em um VPS Linux com Docker e PostgreSQL, preservando o Caddy que já gerencia o acesso e o HTTPS do servidor.

## Instalação resumida

O responsável técnico deve copiar e extrair o pacote em um caminho sem espaços, preferencialmente:

```bash
/opt/coonto
```

Depois, dentro da pasta extraída, executar:

```bash
sudo ./coonto.sh install
```

O instalador:

1. verifica o servidor;
2. instala dependências ausentes em Ubuntu ou Debian;
3. cria segredos locais;
4. inicia o PostgreSQL;
5. aplica as migrações;
6. constrói a aplicação;
7. verifica a saúde do sistema;
8. salva uma cópia do `Caddyfile` existente;
9. valida e acrescenta somente o bloco de `dev.coonto.com`;
10. recarrega o Caddy sem interromper os outros sites;
11. testa o acesso HTTPS e ativa o backup diário.

Nenhuma senha deve ser enviada pelo chat ou adicionada ao Git.

## Primeiro acesso

Enquanto o SMTP não estiver configurado, o kit usa o modo de validação. Durante a instalação, será exibido um código temporário de seis números.

Esse código permite testar a criação de contas por e-mail sem depender do envio de mensagens. Quando o SMTP estiver disponível, altere no `.env`:

```text
AUTH_MODE=email
```

Preencha as variáveis `SMTP_*` e execute novamente:

```bash
sudo ./coonto.sh update
```

## Comandos operacionais

```bash
sudo ./coonto.sh status
sudo ./coonto.sh diagnose
sudo ./coonto.sh backup
sudo ./coonto.sh rollback
sudo ./coonto.sh report
sudo ./coonto.sh caddy
```

Para restaurar um backup:

```bash
sudo ./coonto.sh restore /caminho/do/backup.sql.gz
```

A restauração pede confirmação explícita e cria um backup de segurança antes de substituir os dados.

## Se ocorrer erro

Executar:

```bash
sudo ./coonto.sh report
```

O comando informará o caminho de um arquivo semelhante a:

```text
support/coonto-support-report-20260922T220000Z.txt
```

Enviar somente esse relatório para análise. O relatório não inclui os valores do `.env` e tenta remover padrões sensíveis que possam aparecer nos logs.

Não enviar:

- `.env`;
- chave SSH;
- senha do PostgreSQL;
- senha SMTP;
- código temporário de acesso;
- chaves do Stripe.

## Estrutura do pacote

```text
coonto-deployment-kit/
├── app/                  aplicação web e APIs
├── components/           interface da plataforma
├── content/              obra protegida, fora da pasta pública
├── db/migrations/        estrutura PostgreSQL
├── deploy/caddy/         bloco isolado para dev.coonto.com
├── public/               identidade visual e PWA
├── scripts/              backup, restauração e relatório
├── coonto.sh             comando único de operação
├── compose.yaml          serviços Docker
├── Dockerfile            imagem da aplicação
├── .env.example          modelo sem segredos
└── VERSION               versão do kit
```

## Requisitos e comportamento seguro

- O kit deve ser executado em VPS Linux.
- O caminho da instalação não pode conter espaços.
- PostgreSQL fica acessível apenas dentro da rede Docker.
- A aplicação escuta apenas em `127.0.0.1:3100` por padrão.
- Somente o Caddy existente recebe tráfego público.
- O instalador não instala Nginx nem executa Certbot.
- O `Caddyfile` completo é copiado antes de qualquer mudança.
- O bloco do Coonto é delimitado por marcadores e pode ser atualizado sem reescrever os demais sites.
- A configuração completa é validada antes do reload do Caddy.
- Se o reload falhar ou o serviço ficar inativo, o `Caddyfile` anterior é restaurado.
- O instalador interrompe se detectar configuração essencial inválida.
- Atualizações geram backup quando o banco já está ativo.
- A imagem anterior da aplicação é mantida para rollback.
- O domínio principal `coonto.com` não é modificado.

## Estado funcional desta versão

Incluído:

- landing page e catálogo;
- conta própria por e-mail e código;
- modo de validação sem SMTP;
- biblioteca pessoal;
- progresso sincronizado;
- limite configurável de aparelhos;
- licença offline renovável;
- experiência completa de *O Alienista*;
- feedback e cadastro de parceiros;
- backoffice restrito aos e-mails administradores;
- PWA instalável;
- PostgreSQL, backup e relatório de diagnóstico.

Preparado, mas ainda não ativado:

- cobranças Stripe;
- produtos e preços definitivos;
- Customer Portal;
- cupons e indicações;
- relatórios pedagógicos institucionais.

## Observação sobre Caddy, DNS e HTTPS

Antes de instalar, `dev.coonto.com` deve apontar para o IP público do VPS e as portas 80 e 443 devem continuar sob controle do Caddy. O Coonto é publicado apenas em `127.0.0.1:3100`; o Caddy faz o proxy e administra o certificado. Caso seja necessário reaplicar somente o bloco do Coonto, execute:

```bash
sudo ./coonto.sh caddy
```

O domínio principal `coonto.com`, o AltDesk e os demais blocos existentes não são reescritos pelo instalador.
