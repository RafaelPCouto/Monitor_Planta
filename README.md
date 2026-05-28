# Monitor da Planta (React web)

Este projeto recria o app do App Inventor como uma interface web em React.

## Rodando localmente

1. Instale as dependencias:
   ```bash
   npm install
   ```

2. Suba o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra o link exibido no terminal (geralmente http://localhost:5173).

## Estrutura do projeto

- src/App.jsx: telas principais e navegacao local (Painel, Irrigacao, Perfis)
- src/App.module.css: estilos das telas usando CSS Modules
- src/store/usePlantStore.js: estado global com Zustand
- src/index.css: tema global e tipografia
- src/assets: imagens reutilizadas do App Inventor

## Estado e dados

O estado esta centralizado no Zustand com dados de exemplo (mock). Isso facilita
aprender a estrutura antes de integrar um backend.

Quando o backend existir (Node + Express + PostgreSQL), os dados podem ser
buscados via API e substituirem os valores iniciais em usePlantStore.js.

## Observacoes

- O calculo de saude e baseado em faixas ideais por sensor.
- O botao "Regar agora" apenas adiciona um item no historico local.
- Esta versao e focada em UI para disciplina inicial.
