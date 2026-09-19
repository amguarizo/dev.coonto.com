# Instruções para atualização remota do Coonto

## Objetivo

Permitir que o Coonto seja atualizado remotamente pelo ChatGPT/Codex, sem instalar Git, GitHub Desktop ou qualquer ferramenta no notebook do proprietário.

A configuração técnica deve ser feita uma única vez. Depois disso, as atualizações deverão ser solicitadas diretamente pelo chat.

## Repositório

Confirmar o endereço oficial do repositório antes de configurar o acesso. O repositório registrado anteriormente é:

```text
amguarizo/coonto
```

## Relação entre branches e ambientes

```text
Branch develop → dev.coonto.com.br
Branch main    → alpha.coonto.com.br
```

- `develop` é a branch de desenvolvimento.
- `dev.coonto.com.br` é o ambiente usado para testar e validar as alterações.
- `main` é a branch estável.
- `alpha.coonto.com.br` recebe somente versões já validadas.

Quando o proprietário disser **“publique no dev”**, isso significa:

1. Enviar as alterações para a branch `develop`.
2. Aguardar a execução do GitHub Actions.
3. Confirmar a publicação em `dev.coonto.com.br`.
4. Não alterar a branch `main`.

## Configuração remota necessária

Configurar uma integração remota do GitHub para que o ChatGPT/Codex possa trabalhar no repositório sem depender do notebook do proprietário.

A autorização deve ficar restrita ao repositório do Coonto e permitir:

- **Contents: Read and write** — ler arquivos, criar commits e enviar alterações.
- **Pull requests: Read and write** — criar e acompanhar solicitações de integração quando necessário.
- Leitura dos resultados do GitHub Actions.
- Criação e atualização de conteúdo na branch `develop`.

O erro apresentado anteriormente foi:

```text
403 — Resource not accessible by integration
```

Esse erro indica que a integração usada conseguia ler o repositório, mas não possuía autorização para escrever nele.

## Proteções obrigatórias

- Restringir a integração ao repositório do Coonto.
- Autorizar atualizações automáticas somente na branch `develop`.
- Manter a branch `main` protegida.
- Não permitir publicação direta em `main` sem aprovação do proprietário.
- Não compartilhar senhas ou tokens pelo chat.
- Guardar credenciais somente no serviço remoto autorizado.

## Teste que o técnico deve realizar

1. Criar uma alteração de teste sem impacto na branch `develop`.
2. Registrar um commit remoto.
3. Fazer o envio para `develop`.
4. Confirmar que o erro 403 não ocorre novamente.
5. Confirmar a execução bem-sucedida do GitHub Actions.
6. Confirmar que a alteração chegou a `dev.coonto.com.br`.
7. Confirmar que a branch `main` e `alpha.coonto.com.br` permaneceram inalterados.

## Alternativa, caso a integração atual não aceite escrita

Criar uma GitHub App exclusiva para o Coonto, instalada somente no repositório do projeto e com as permissões mínimas descritas acima. Essa aplicação funcionará como um robô remoto de publicação.

Essa alternativa também deve funcionar sem qualquer instalação no notebook do proprietário.

## Fluxo depois da configuração

O proprietário deverá precisar escrever apenas:

```text
Atualize a develop com esta versão.
```

O processo remoto esperado será:

```text
Preparar arquivos
→ criar backup
→ registrar versão e commit
→ enviar para develop
→ acompanhar GitHub Actions
→ confirmar publicação em dev.coonto.com.br
```

Somente depois da validação do proprietário poderá ser solicitada a integração de `develop` em `main`, seguida da atualização de `alpha.coonto.com.br`.

