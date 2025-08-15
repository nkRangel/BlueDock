// Mantive a escolha pelo sqlite3. Para uma aplicação de portfólio como esta,
// a simplicidade de ter um banco de dados baseado em arquivo é imbatível.
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./services.db', (err) => {
    if (err) {
        console.error("Erro ao abrir o banco de dados", err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite do BlueDock.');
        
        // precisei habilitar as chaves estrangeiras no SQLite para garantir a integridade relacional.
        db.run('PRAGMA foreign_keys = ON;');

        // Decidi criar uma tabela separada para as categorias.
        // Isso normaliza o banco de dados, evita erros de digitação e facilita o gerenciamento.
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )`, (err) => {
            if (err) {
                console.error("Erro ao criar a tabela 'categories'", err.message);
            } else {
                // "Semear" (seeding) o banco com categorias iniciais foi uma boa ideia
                // para garantir que a aplicação já comece com dados úteis para teste.
                const categories = ['Molinetes', 'Carretilhas', 'Carabinas', 'Varas', 'Acessórios'];
                const insert = db.prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)");
                categories.forEach(cat => insert.run(cat));
                insert.finalize();
            }
        });

        // Esta é a tabela principal. Ela foi evoluindo para incluir mais detalhes
        // tanto do cliente quanto do serviço.
        db.run(`CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            receipt_number TEXT UNIQUE,
            customer_name TEXT NOT NULL,
            customer_phone TEXT,
            customer_address TEXT,
            customer_email TEXT,
            item_description TEXT NOT NULL,
            service_details TEXT,
            price REAL NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('Pendente', 'Em Andamento', 'Concluído', 'Cancelado')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            category_id INTEGER,
            FOREIGN KEY (category_id) REFERENCES categories (id)
        )`, (err) => {
            if (err) {
                console.error("Erro ao criar a tabela 'services'", err.message);
            }
        });
    }
});

module.exports = db;