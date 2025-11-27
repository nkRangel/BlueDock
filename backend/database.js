const sqlite3 = require('sqlite3').verbose();

// Inicialização da conexão com o banco SQLite.
// Optei por manter em arquivo local pela simplicidade da arquitetura.
const db = new sqlite3.Database('./services.db', (err) => {
    if (err) {
        console.error("Erro na conexão com o banco:", err.message);
    } else {
        console.log('Banco de dados conectado.');
        
        // Habilita suporte a chaves estrangeiras (FK)
        db.run('PRAGMA foreign_keys = ON;');

        // Estrutura para normalização das categorias
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )`, (err) => {
            if (!err) {
                // Seed inicial de categorias padrão
                const categories = ['Carretilha', 'Molinete', 'Carabina'];
                const insert = db.prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)");
                categories.forEach(cat => insert.run(cat));
                insert.finalize();
            }
        });

        // Tabela principal de serviços com todas as regras de negócio aplicadas
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
            status TEXT NOT NULL CHECK(status IN ('Em Orçamento', 'Aguardando Aprovação', 'Pendente', 'Em Manutenção', 'Aguardando Peça', 'Peça Indisponível', 'Pronto', 'Concluído', 'Cancelado')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            finished_at DATETIME,
            category_id INTEGER,
            FOREIGN KEY (category_id) REFERENCES categories (id)
        )`, (err) => {
            if (err) console.error("Erro na criação da tabela services:", err.message);
        });
    }
});

module.exports = db;