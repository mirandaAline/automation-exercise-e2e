# Automation Exercise — Trabalho de conclusão

[![Testes E2E](https://github.com/mirandaAline/automation-exercise-e2e/actions/workflows/e2e.yml/badge.svg)](https://github.com/mirandaAline/automation-exercise-e2e/actions/workflows/e2e.yml)

Projeto individual de automação de interface com **Playwright Test e JavaScript**, cobrindo os casos **1, 2, 3, 4, 5, 8, 9, 10, 15 e 16** do [roteiro oficial](https://www.automationexercise.com/test_cases).

Autora: **Aline Miranda** · [Repositório para entrega](https://github.com/mirandaAline/automation-exercise-e2e)

## Executar localmente

Requisitos: Node.js 22 ou superior (CI com Node.js 24 LTS), npm, Git e acesso à internet. Execute na pasta do projeto:

```bash
npm ci
npx playwright install chromium
npm test
```

Em Linux, instale também as dependências do navegador: `npx playwright install --with-deps chromium`.

```bash
npm run test:headed       # execução com navegador visível
npm run test:ui           # interface interativa do Playwright
npm run test:list         # conferir os dez testes coletados
npm test -- --grep CT15   # executar um caso específico
npm run report           # abrir o último relatório HTML
```

O endereço padrão é `https://automationexercise.com`. A variável opcional `BASE_URL` permite usar outra instância compatível. Não são necessários segredos ou contas previamente cadastradas.

## Casos implementados

| Caso | Cenário | Arquivo |
| --- | --- | --- |
| CT01 | Cadastrar com todos os campos, confirmar login e excluir conta | `tests/authentication.spec.js` |
| CT02 | Login válido e exclusão de conta | `tests/authentication.spec.js` |
| CT03 | Login inválido com mensagem de erro | `tests/authentication.spec.js` |
| CT04 | Logout e retorno à página de login | `tests/authentication.spec.js` |
| CT05 | Cadastro com e-mail já existente | `tests/authentication.spec.js` |
| CT08 | Listagem e detalhes: nome, categoria, preço, disponibilidade, condição e marca | `tests/products.spec.js` |
| CT09 | Busca e comparação de todos os resultados com o catálogo | `tests/products.spec.js` |
| CT10 | Inscrição na newsletter pelo rodapé | `tests/subscription.spec.js` |
| CT15 | Cadastro pela interface antes da compra, carrinho, endereços, pagamento e exclusão | `tests/checkout.spec.js` |
| CT16 | Login antes da compra, carrinho, endereços, pagamento e exclusão | `tests/checkout.spec.js` |

## Estrutura e boas práticas

```text
.github/workflows/e2e.yml   # CI e publicação de artefatos
pages/                      # Page Objects de navegação, autenticação e checkout
tests/                      # dez cenários independentes
tests/support/              # fixtures, massa exclusiva e limpeza por API
scripts/package.mjs         # ZIP do código versionado
playwright.config.js        # navegador, esperas, relatórios e evidências
```

- Seletores priorizam roles, labels e atributos `data-qa` do site. CSS é usado para IDs estáveis e escopos de componentes sem identificadores semânticos.
- Cada teste recebe um contexto isolado; e-mails UUID evitam colisões. Nenhum cenário depende de outro ou de ordem de execução.
- CT01 e CT15 cadastram pela interface. CT02, CT04, CT05 e CT16 preparam uma conta pela [API pública](https://www.automationexercise.com/api_list), preservando o foco do cenário.
- A fixture tenta excluir a própria conta temporária mesmo em caso de falha. Os casos que exigem exclusão também a validam pela interface. Falhas na limpeza são reportadas.
- Dados de endereço, identidade e cartão são fictícios, destinados exclusivamente ao ambiente de prática.
- Asserções com espera automática substituem pausas fixas. Não há `waitForTimeout`, `force: true`, testes ignorados ou captura de erro para aprovar falhas.
- Somente requisições de publicidade de terceiros são bloqueadas para evitar anúncios sobre os controles. Respostas da aplicação não são simuladas.
- Um worker reduz carga no ambiente público; CI permite uma repetição por falha transitória. O relatório identifica testes instáveis e tentativas.

## GitHub Actions

Acesse [Actions → Testes E2E](https://github.com/mirandaAline/automation-exercise-e2e/actions/workflows/e2e.yml). O workflow executa em pushes e pull requests para `main`, e manualmente por **Run workflow**. Instala as versões do lockfile, Chromium e suas dependências, executa os dez casos e publica os artefatos por 30 dias. Uma falha definitiva deixa a execução vermelha; não há `continue-on-error`.

Na página de uma execução, baixe:

- **relatorios-playwright**: relatório HTML, JUnit XML, JSON e evidências de falha.
- **projeto-entrega**: ZIP do projeto versionado, sem `node_modules`, `.git`, segredos ou arquivos de execução.

## Relatórios

| Saída | Finalidade |
| --- | --- |
| `playwright-report/index.html` | Status, duração, passos, erros e tentativas por teste |
| `test-results/junit.xml` | Integração com ferramentas de resultados de testes |
| `test-results/results.json` | Resultado estruturado para análise |
| `test-results/` | Screenshot, vídeo e trace preservados em falhas |

Abra o HTML com `npm run report`. Para um trace de falha: `npx playwright show-trace caminho/trace.zip`. Relatórios são gerados a cada execução e não são versionados.

O roteiro dos casos 15/16 menciona uma mensagem de sucesso de pagamento. A implementação valida a página final `payment_done`, o título `Order Placed!` e a confirmação persistente `Congratulations! Your order has been confirmed!`, evitando depender de mensagem transitória anterior ao redirecionamento.

## Entrega

Entregue a URL **https://github.com/mirandaAline/automation-exercise-e2e**. Para gerar um ZIP local após um commit:

```bash
npm run zip
```

Arquivo: `dist/automation-exercise-e2e.zip`. O ZIP contém o **último commit**, não alterações ainda não commitadas. Quem recebe o projeto deve executar `npm ci` e instalar o navegador antes dos testes.

Como o alvo é um serviço público externo, disponibilidade e tempo de resposta podem afetar execuções futuras. Consulte o resultado da execução e suas evidências para distinguir problemas do site de falhas nos cenários.
