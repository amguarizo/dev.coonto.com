# Encerramento automático + reabertura/escalonamento — pronto para aplicar

O código está commitado na branch `feature/encerramento-escalonamento` do seu
repositório local clonado nesta sessão, mas **não consegui empurrar (push)
para o GitHub**: o proxy desta sessão bloqueou com "Leobaiao/altdesk is not
in this session's authorized repository set" — é uma trava de acesso deste
ambiente, não do seu token (o clone com o mesmo token funcionou normal).
Sem um jeito de liberar isso daqui, o caminho é você aplicar o patch em
anexo (ou seu dev aplicar).

## Como aplicar

```
cd altdesk
git checkout -b feature/encerramento-escalonamento
git am 0001-encerramento-e-escalonamento.patch
git push origin feature/encerramento-escalonamento
```

Depois é só abrir o PR normalmente no GitHub a partir dessa branch.

## O que o patch faz

Implementado direto contra o código real (TypeScript + mssql/SQL Server,
não o esqueleto Sequelize que eu tinha mandado antes de ter acesso ao
repo — aquele pode ser descartado, era só uma referência sem o schema
real). Reaproveita o que já existe em vez de duplicar: `ticketService.ts`,
o padrão de escalonamento de `slaService.ts`, e o módulo Alertas
(`fireAlertEvent`) para as notificações — em vez de um caminho de
notificação paralelo.

**1. Toda conversa vira chamado.** `TicketClosureConfig.AutoCreateTicketPerConversation`
(ligado por padrão) — chamado a cada mensagem de entrada, reaproveitando
`createTicketForConversation` que já existia e já é idempotente.

**2. Encerramento automático, 4 formas, tudo configurável por tenant:**
- Comando escrito do solicitante (lista de frases configurável, ex.
  "encerrar chamado")
- O próprio solicitante fechando (rota no portal interno e no portal do
  cliente externo)
- Timeout com aviso prévio (estilo ITIL v3 — avisa, espera, só então
  fecha) — inclui a versão "agente pede confirmação antes", que é o mesmo
  mecanismo disparado manualmente
- Timeout silencioso (sem aviso)
- Chamados CRITICAL/URGENT ficam de fora do fechamento automático por
  padrão (dá pra desligar essa exceção)

**3. Reabertura sem limite de quantidade, dentro de uma janela em horas
configurável.** A partir de X reaberturas (configurável), escalona
sozinho: reatribui para um papel configurável (ex. SUPERVISOR), sobe a
prioridade um degrau, notifica quem assumiu — e o agente original não
some do chamado, vira "watcher" (tabela nova `TicketWatcher`) e continua
sendo notificado.

## Arquivos

- `backend/db/58-encerramento-escalonamento.sql` — migration idempotente
  (colunas novas em `Ticket`, tabelas novas `TicketClosureConfig` e
  `TicketWatcher`)
- `backend/src/services/closureService.ts` — toda a lógica, worker
  periódico incluso (mesmo intervalo de 60s do SLA/Alertas)
- `backend/src/routes/settings.ts` — `GET/PUT /api/settings/encerramento`
  (tela de config do admin, mesmo padrão da tela de SLA)
- `backend/src/routes/tickets.ts` — `POST /:id/close` e `/:id/reopen`
  (lado do agente)
- `backend/src/routes/customerPortal.ts` — `POST /tickets/:id/close` e
  `/reopen` (lado do solicitante externo)
- `backend/src/services/conversation.ts` — o "gancho": toda mensagem de
  entrada passa por `ensureAutoTicket` + `tryCloseByCommand`
- `backend/src/scripts/migrate-alerts.ts` — 4 gatilhos novos no catálogo
  do módulo Alertas (aviso de encerramento, encerrado, reaberto, escalado
  por reabertura) — assim a notificação de cada evento já sai
  configurável pelo tenant na tela que já existe, sem eu inventar um
  caminho novo
- `backend/src/index.ts` — inicia o worker novo junto dos outros

`npx tsc --noEmit` passou limpo (zero erros) contra o repositório real.

## Faltou (fora do escopo de backend)

Não fiz a tela de configuração no front-end — só a API. A tela de SLA
existente (`/settings` → SLA) é o padrão mais próximo pra seguir, se seu
dev quiser espelhar o layout.
