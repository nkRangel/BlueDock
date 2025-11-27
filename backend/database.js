const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./services.db', (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        
        // Habilita chaves estrangeiras
        db.run('PRAGMA foreign_keys = ON;');

        // Tabela de Categorias
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )`, (err) => {
            if (!err) {
                // Seed inicial de categorias
                const categories = ['Carretilha', 'Molinete', 'Carabina'];
                const insert = db.prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)");
                categories.forEach(cat => insert.run(cat));
                insert.finalize();
            }
        });

        // Tabela de Serviços
        db.run(`CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            receipt_number TEXT UNIQUE,
            customer_name TEXT NOT NULL,
            customer_phone TEXT,
            customer_address TEXT,
            customer_email TEXT,
            item_description TEXT NOT NULL,
            service_details TEXT,
            price REAL DEFAULT 0,
            status TEXT NOT NULL CHECK(status IN ('Orçamento Enviado', 'Aguardando Aprovação', 'Pendente', 'Em Andamento', 'Aguardando Peça', 'Pronto', 'Concluído', 'Cancelado')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            category_id INTEGER,
            FOREIGN KEY (category_id) REFERENCES categories (id)
        )`, (err) => {
            if (err) {
                console.error("Erro ao criar tabela services:", err.message);
            }
        });
    }
});

module.exports = db;