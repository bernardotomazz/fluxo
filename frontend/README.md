# Fluxo Front-end

Interface web responsiva para o Fluxo, um sistema local de gestão financeira pessoal. O front-end consome a API Spring Boot do projeto e reúne transações, categorias, metas e o Fluxômetro em uma experiência única.

## Funcionalidades

- Dashboard com resumo financeiro, histórico mensal e gastos por categoria.
- Fluxômetro com diagnóstico explicável da saúde financeira.
- Cadastro, edição, consulta, filtro e exclusão de transações.
- Categorias personalizadas com cor, ícone e consulta dos lançamentos vinculados.
- Metas financeiras com acompanhamento de progresso e registro de aportes.
- Temas claro e escuro persistidos no navegador.
- Layout responsivo com tabela no desktop e listas adaptadas para telas menores.
- Estados de carregamento, vazio, erro e confirmação de operações.

## Tecnologias

- React 19 e TypeScript
- Vite 8
- Tailwind CSS 4
- Base UI e componentes shadcn
- React Hook Form e Zod
- Axios
- Recharts
- Lucide Icons

## Pré-requisitos

- Node.js 20 ou superior
- npm
- Backend do Fluxo em execução

## Executando localmente

1. Instale as dependências:

```bash
npm install
```

2. Inicie o backend na porta `8080`.

3. Inicie o front-end:

```bash
npm run dev
```

4. Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`.

Durante o desenvolvimento, requisições para `/api` são encaminhadas pelo Vite para `http://localhost:8080`. Para usar outro endereço, crie um arquivo `.env.local` a partir de `.env.example` e defina `VITE_API_URL`.

## Scripts

```bash
npm run dev      # servidor de desenvolvimento
npm run lint     # análise estática
npm run build    # validação TypeScript e build de produção
npm run preview  # prévia local do build
```

## Estrutura principal

```text
src/
  components/   páginas, dashboard, modais e componentes de interface
  contexts/     tema, atualização de dados, títulos e feedback global
  hooks/        carregamento dos recursos da API
  lib/          cálculo do Fluxômetro e utilitários
  schemas/      validação dos formulários
  services/     integração com os endpoints do backend
  types/        tipos internos e contratos dos DTOs
```

## Decisões de interface

O produto usa IBM Plex Sans na interface, Fraunces na pontuação do Fluxômetro e IBM Plex Mono em leituras técnicas. O sistema de cores é semântico, possui paridade entre temas claro e escuro e prioriza contraste WCAG AA. Mais detalhes estão em [DESIGN.md](./DESIGN.md).

## API local

O Fluxo não depende de um serviço em nuvem. Os dados permanecem no ambiente configurado pelo backend local. Quando a API estiver indisponível, a interface informa o problema e oferece uma nova tentativa sem descartar os dados já preenchidos nos formulários.
