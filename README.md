# BlueDock - Gerenciador de Ordens de Serviço

Desenvolvido por **Pedro Rangel**, o BlueDock é uma aplicação web Full-Stack criada como um sistema de gerenciamento de serviços (Ordens de Serviço) para uma casa de pesca, caça e camping. O projeto demonstra uma arquitetura moderna com uma clara separação entre o servidor (back-end) e a interface do cliente (front-end).

## Funcionalidades Implementadas

- **Dashboard Principal:** Interface com visão geral de métricas importantes da oficina.
- **CRUD Completo de Serviços:**
  - **Create:** Adicionar novos serviços através de um formulário em modal.
  - **Read:** Listar todos os serviços em uma tabela organizada e de fácil visualização.
  - **Update:** Editar informações de serviços existentes, incluindo a mudança de status.
  - **Delete:** Remover serviços do banco de dados com uma etapa de confirmação.
- **Busca em Tempo Real:** Filtragem instantânea da tabela de serviços por nome do cliente, descrição do item ou número do canhoto.
- **Geração de Canhoto Único:** Cada novo serviço recebe um número de ordem de serviço único e sequencial, gerado e garantido pelo backend.
- **Tema Personalizado:** Interface estilizada com uma paleta de cores customizada para criar uma identidade visual única e profissional.

## Tecnologias Utilizadas

- **Frontend:**
  - React
  - Vite
  - TypeScript
  - Tailwind CSS
  - Shadcn/UI

- **Backend:**
  - Node.js
  - Express.js
  - SQLite

## Como Executar o Projeto Localmente

É necessário ter o Node.js instalado no sistema.

1.  **Clonar o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/bluedock.git](https://github.com/seu-usuario/bluedock.git)
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

- Adicionar um sistema de notificações "Toast" para um feedback mais elegante das ações do usuário.
- Implementar paginação na tabela para otimizar a performance com um grande volume de dados.

---
*Este projeto foi desenvolvido como parte do meu portfólio pessoal.*