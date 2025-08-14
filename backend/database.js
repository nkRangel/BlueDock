// backend/database.js

// Escolhi o sqlite3 pela simplicidade. Para uma aplicação deste porte,
// ter o banco de dados em um único arquivo, sem precisar de um servidor separado, é ideal.
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./services.db', (err) => {
    if (err) {
        // Log de erro crítico se não for possível conectar ao banco.
        console.error("Erro ao abrir o banco de dados", err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite do BlueDock.');
        // O comando 'CREATE TABLE IF NOT EXISTS' é minha garantia de que a estrutura
        // da tabela sempre existirá quando a aplicação iniciar.
        db.run(`CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            receipt_number TEXT UNIQUE,
            customer_name TEXT NOT NULL,
            item_description TEXT NOT NULL,
            price REAL NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('Pendente', 'Em Andamento', 'Concluído', 'Cancelado')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                // Outro log de erro crítico se a tabela não puder ser criada.
                console.error("Erro ao criar a tabela 'services'", err.message);
            }
        });
    }
});

// Exporto a conexão 'db' para ser usada em outros arquivos, como o server.js.
module.exports = db;