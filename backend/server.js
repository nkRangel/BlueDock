const express = require('express');
const cors = require('cors');
const db = require('./database.js');

const app = express();
const PORT = 3001;

// Middlewares essenciais para a comunicação com o frontend e para o parsing de JSON.
app.use(cors());
app.use(express.json());


// --- ROTAS DA API ---

// Criei um endpoint dedicado para as categorias. O frontend usa isso
// para popular os formulários de forma dinâmica.
app.get('/api/categories', (req, res) => {
    const sql = "SELECT * FROM categories ORDER BY name ASC";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json({ "message": "success", "data": rows });
    });
});

// A rota principal de busca de serviços. Evoluiu bastante para incluir
// paginação e o JOIN com a tabela de categorias.
app.get('/api/services', (req, res) => {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const offset = (page - 1) * limit;

    // O LEFT JOIN aqui é a chave. Ele "enriquece" os dados do serviço
    // com o nome da categoria correspondente, tudo em uma única consulta.
    const sqlData = `
        SELECT 
            s.id, s.receipt_number, s.customer_name, s.customer_phone, s.customer_address,
            s.customer_email, s.item_description, s.service_details, s.price, s.status,
            s.created_at, s.category_id,
            c.name as category_name 
        FROM 
            services s 
        LEFT JOIN 
            categories c ON s.category_id = c.id
        ORDER BY s.created_at DESC 
        LIMIT ? OFFSET ?`;
    
    // A segunda query, para contagem, é essencial para a paginação no frontend.
    const sqlCount = `SELECT COUNT(*) as total FROM services`;

    // Optei por usar Promise.all para executar as duas consultas em paralelo,
    // o que é mais eficiente que executá-las em sequência.
    Promise.all([
        new Promise((resolve, reject) => { db.all(sqlData, [limit, offset], (err, rows) => err ? reject(err) : resolve(rows)); }),
        new Promise((resolve, reject) => { db.get(sqlCount, [], (err, result) => err ? reject(err) : resolve(result.total)); })
    ]).then(([data, total]) => {
        res.json({ message: "success", data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
    }).catch(err => {
        console.error("ERRO NO BANCO DE DADOS (GET):", err.message);
        res.status(500).json({ "error": err.message });
    });
});

// Rota para CRIAR um serviço.
app.post('/api/services', (req, res) => {
    const { customer_name, customer_phone, customer_address, customer_email, item_description, service_details, price, category_id } = req.body;
    if (!customer_name || !item_description || !price) {
        return res.status(400).json({ "error": "Faltam dados. Nome, descrição e preço são obrigatórios." });
    }
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const uniqueId = Date.now().toString().slice(-6); 
    const receiptNumber = `${year}-${uniqueId}`;
    // Tratamento para garantir que um category_id vazio seja salvo como NULL no banco.
    const finalCategoryId = category_id ? parseInt(category_id) : null;

    const sql = `INSERT INTO services (receipt_number, customer_name, customer_phone, customer_address, customer_email, item_description, service_details, price, status, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [receiptNumber, customer_name, customer_phone, customer_address, customer_email, item_description, service_details, price, 'Pendente', finalCategoryId];

    db.run(sql, params, function (err) {
        if (err) {
            console.error("ERRO NO BANCO DE DADOS (POST):", err.message);
            return res.status(500).json({ "error": err.message });
        }
        res.status(201).json({ "message": "success", "data": { id: this.lastID, ...req.body, receipt_number: receiptNumber, status: 'Pendente' } });
    });
});

// Rota para ATUALIZAR um serviço.
app.put('/api/services/:id', (req, res) => {
    const { id } = req.params;
    const { customer_name, customer_phone, customer_address, customer_email, item_description, service_details, price, status, category_id } = req.body;
    const finalCategoryId = category_id ? parseInt(category_id) : null;
    
    // O COALESCE foi uma mão na roda para as atualizações, mas para o category_id
    // precisei de um tratamento explícito para lidar com o caso de 'des-selecionar' uma categoria.
    const sql = `UPDATE services set
                    customer_name = COALESCE(?, customer_name), customer_phone = COALESCE(?, customer_phone),
                    customer_address = COALESCE(?, customer_address), customer_email = COALESCE(?, customer_email),
                    item_description = COALESCE(?, item_description), service_details = COALESCE(?, service_details),
                    price = COALESCE(?, price), status = COALESCE(?, status), category_id = ?
                    WHERE id = ?`;
    const params = [customer_name, customer_phone, customer_address, customer_email, item_description, service_details, price, status, finalCategoryId, id];

    db.run(sql, params, function (err) {
        if (err) {
            console.error("ERRO NO BANCO DE DADOS (PUT):", err.message);
            return res.status(500).json({ "error": err.message });
        }
        res.json({ message: "success", changes: this.changes });
    });
});

// Rota para DELETAR um serviço.
app.delete('/api/services/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM services WHERE id = ?';
    db.run(sql, id, function (err) {
        if (err) return res.status(500).json({ "error": err.message });
        res.json({ "message": "deleted", "changes": this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor do BlueDock rodando na porta ${PORT}. API pronta para as requisições do front-end!`);
});