# BlueDock - Gerenciador de Ordens de Serviço

Desenvolvido por **Pedro Rangel**, o BlueDock é uma aplicação web Full-Stack completa, criada como um sistema de gerenciamento de serviços (Ordens de Serviço) para uma oficina ou pequena empresa, como uma casa de pesca, caça e camping. O projeto demonstra uma arquitetura moderna com uma clara separação entre o servidor (back-end) e a interface do cliente (front-end), implementando funcionalidades avançadas para uma experiência de usuário robusta e profissional.

## Funcionalidades Implementadas

- **Dashboard Dinâmico:** A tela inicial apresenta uma visão geral com métricas importantes, como faturamento total (de serviços concluídos), número de serviços pendentes e em andamento. Os valores são calculados em tempo real a partir dos dados da aplicação.

- **CRUD Completo de Serviços:**
  - **Create:** Adicionar novos serviços através de um formulário completo em modal, incluindo dados detalhados do cliente e do serviço.
  - **Read:** Listar todos os serviços em uma tabela organizada, limpa e de fácil visualização.
  - **Update:** Editar informações de serviços existentes através de um modal, permitindo a alteração de todos os campos, incluindo o status do serviço.
  - **Delete:** Remover serviços do banco de dados com uma etapa de confirmação para garantir a segurança dos dados.

- **Sistema de Categorias:** Os serviços podem ser classificados em categorias (Carretilha, Molinete, Carabina), implementadas através de um modelo de banco de dados relacional para garantir a integridade e consistência dos dados.

- **Busca e Filtragem em Tempo Real:** Um campo de busca permite a filtragem instantânea da tabela de serviços por nome do cliente, descrição do item, número do canhoto ou categoria. Também conta com filtro rápido por Status.

- **Paginação:** A tabela de serviços é paginada para garantir a performance e escalabilidade da aplicação, mesmo com um grande volume de dados. O backend envia os dados em "fatias", e o frontend renderiza os controles de navegação.

- **Geração de Canhoto Único:** Cada novo serviço recebe um número de ordem de serviço único (ex: `2025-123456`), gerado e garantido pelo backend no momento da criação, facilitando o rastreamento.

- **Notificações Inteligentes (Toasts):** A aplicação fornece feedback visual para as ações do usuário (criar, editar, excluir) através de notificações "toast" não-bloqueantes, melhorando a experiência do usuário.

- **Integração com WhatsApp:** Funcionalidade para notificar o cliente sobre o status de sua ordem de serviço, gerando uma mensagem pré-formatada com os dados da loja e abrindo o WhatsApp para envio com um único clique.

- **Design e Tema:** A interface foi construída com uma paleta de cores personalizada e um tema escuro consistente, garantindo uma identidade visual única e profissional.

## Tecnologias Utilizadas

- **Frontend:**
  - React (com Hooks: `useState`, `useEffect`, `useMemo`)
  - Vite
  - TypeScript
  - Tailwind CSS
  - Shadcn/UI (para componentes: Tabela, Cards, Modais, etc.)
  - Sonner (para notificações Toast)
  - React Icons

- **Backend:**
  - Node.js
  - Express.js
  - SQLite

## Como Executar o Projeto Localmente

É necessário ter o Node.js instalado no sistema.

1.  **Clonar o repositório:**
    ```bash
    git clone [https://github.com/nkRangel/BlueDock.git](https://github.com/nkRangel/BlueDock.git)
    cd bluedock
    ```

2.  **Configurar e iniciar o Back-end (executar em um terminal):**
    ```bash
    cd backend
    npm install
    node server.js
    ```
    O servidor da API estará em execução em `http://localhost:3001`.

3.  **Configurar e iniciar o Front-end (executar em outro terminal):**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    A aplicação estará acessível em `http://localhost:5173`.

## Próximos Passos e Melhorias Futuras

- Implementar sistema de Login e Autenticação.
- Adicionar funcionalidade de impressão de canhoto/recibo em PDF.
- Criar gráficos visuais para análise de faturamento mensal.

## 🤝 Contexto e Agradecimentos

Este projeto foi desenvolvido inicialmente para atender a uma demanda real da **Casa das Redes do Alencar**, visando modernizar e facilitar o controle de entrada de serviços da loja.

Um agradecimento especial à minha gestora, **Elaine**, pela confiança no meu potencial, pela oportunidade de aplicar meus conhecimentos em um cenário real e pelo apoio neste início da minha jornada como desenvolvedor.

---
*Desenvolvido por Pedro Rangel.*