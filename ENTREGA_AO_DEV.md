# Instrução curta para o responsável técnico

Você não precisa alterar o código da plataforma.

## Procedimento

1. Transfira o arquivo do Coonto para o VPS.
2. Extraia em `/opt/coonto`.
3. Confirme que `dev.coonto.com` aponta para o IP do VPS.
4. Confirme que o Caddy está ativo e que o arquivo principal é `/etc/caddy/Caddyfile`.
5. Execute:

```bash
cd /opt/coonto
sudo ./coonto.sh install
```

6. Ao terminar, abra `https://dev.coonto.com` no computador e no celular.

O instalador não instala Nginx, não executa Certbot e não substitui o Caddy. Antes de acrescentar o bloco do Coonto, ele salva uma cópia do `Caddyfile`, valida a configuração completa e só então faz um reload. Se houver erro, restaura o arquivo anterior.

## Em caso de sucesso

Informe:

- “instalação concluída”;
- horário do teste;
- se página inicial, login e *O Alienista* abriram corretamente.
- se o AltDesk continuou acessível normalmente.

Não envie o arquivo `.env` nem o código de acesso.

## Em caso de erro

Não tente reescrever o código. Execute:

```bash
cd /opt/coonto
sudo ./coonto.sh report
```

Envie o arquivo de relatório indicado pelo comando. Ele será analisado, o pacote será corrigido e você receberá uma nova versão para executar.
