# BlueDock - Gerenciador de Ordens de Serviço

Desenvolvido por **Pedro Rangel**, o BlueDock é uma aplicação web Full-Stack completa, criada como um sistema de gerenciamento de serviços (Ordens de Serviço) para uma oficina ou pequena empresa, como uma casa de pesca, caça e camping. O projeto demonstra uma arquitetura moderna com uma clara separação entre o servidor (back-end) e a interface do cliente (front-end), implementando funcionalidades avançadas para uma experiência de usuário robusta e profissional.

## Funcionalidades Implementadas

- **Dashboard Financeiro:** A tela inicial apresenta uma visão geral com métricas importantes, como faturamento total, número de serviços pendentes e em andamento.

- **Módulo de Produtividade e Analytics:** - **Gráficos Visuais:** Gráfico de barras interativo (usando `recharts`) para acompanhar o volume de serviços criados vs. concluídos nos últimos 7 dias.
  - **Relatório de Lead Time:** Tabela automática que calcula o tempo exato decorrido entre a entrada e a conclusão de cada serviço, permitindo identificar gargalos.

- **CRUD Completo de Serviços:**
  - **Create:** Adicionar novos serviços através de um formulário completo em modal, com suporte a preços opcionais e detalhes técnicos.
  - **Read:** Listar todos os serviços em uma tabela organizada, com colunas personalizadas.
  - **Update:** Editar informações de serviços existentes, incluindo a mudança rápida de status via dropdown direto na tabela.
  - **Delete:** Remover serviços do banco de dados com confirmação de segurança.

- **Sistema de Categorias:** Classificação de serviços (Carretilha, Molinete, Carabina) via banco de dados relacional para garantir a integridade dos dados.

- **Busca e Filtragem Avançada:** Campo de busca textual (por cliente, item ou canhoto) combinado com um filtro rápido por Status ("Em Manutenção", "Pronto", etc.).

- **Geração de Canhoto Único:** Cada novo serviço recebe um número de ordem de serviço único e sequencial (ex: `2025-123456`), gerado pelo backend.

- **Integração com WhatsApp:** Botão "Click-to-Chat" que gera uma mensagem personalizada com os dados da OS (Cliente, Item, Status) pronta para envio.

- **Notificações Inteligentes (Toasts):** Feedback visual não-bloqueante para todas as ações do usuário.

- **Design Premium:** Interface com tema escuro personalizado (baseado na identidade visual da marca), ícones intuitivos e layout responsivo.

## Tecnologias Utilizadas

- **Frontend:**
  - React, Vite, TypeScript
  - Tailwind CSS, Shadcn/UI
  - Recharts (Gráficos)
  - Sonner (Notificações)
  - React Icons

- **Backend:**
  - Node.js
  - Express.js
  - SQLite (com suporte a relacionamentos e migrações)

## Como Executar o Projeto Localmente

É necessário ter o Node.js instalado no sistema.

1.  **Clonar o repositório:**
    ```bash
    git clone [https://github.com/nkRangel/BlueDock.git](https://github.com/nkRangel/BlueDock.git)
    cd bluedock
    ```

2.  **Configurar e iniciar o Back-end:**
    ```bash
    cd backend
    npm install
    node server.js
    ```
    O servidor da API rodará em `http://localhost:3001`.

3.  **Configurar e iniciar o Front-end:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    A aplicação estará acessível em `http://localhost:5173`.

## Próximos Passos

- Implementar sistema de Login e Autenticação.
- Adicionar funcionalidade de impressão de canhoto/recibo em PDF.

## 🤝 Contexto e Agradecimentos

Este projeto foi desenvolvido inicialmente para atender a uma demanda real da **Casa das Redes do Alencar**, visando modernizar e facilitar o controle de entrada de serviços da loja.

Um agradecimento especial à minha gestora, **Elaine**, pela confiança no meu potencial, pela oportunidade de aplicar meus conhecimentos em um cenário real e pelo apoio incondicional neste início da minha jornada como desenvolvedor.

---
*Desenvolvido por Pedro Rangel.*