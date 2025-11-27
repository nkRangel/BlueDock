const express = require('express');
const cors = require('cors');
const db = require('./database.js');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Listar serviços com paginação e filtros
app.get('/api/services', (req, res) => {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const offset = (page - 1) * limit;

    const sqlData = `
        SELECT 
            s.*, 
            c.name as category_name 
        FROM 
            services s 
        LEFT JOIN 
            categories c ON s.category_id = c.id
        ORDER BY s.created_at DESC LIMIT ? OFFSET ?`;
    
    const sqlCount = `SELECT COUNT(*) as total FROM services`;

    Promise.all([
        new Promise((resolve, reject) => { db.all(sqlData, [limit, offset], (err, rows) => err ? reject(err) : resolve(rows)); }),
        new Promise((resolve, reject) => { db.get(sqlCount, [], (err, result) => err ? reject(err) : resolve(result.total)); })
    ]).then(([data, total]) => {
        res.json({ message: "success", data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
    }).catch(err => {
        res.status(500).json({ "error": err.message });
    });
});

// Criar novo serviço
app.post('/api/services', (req, res) => {
    const { 
        customer_name, customer_phone, customer_address, customer_email, 
        item_description, service_details, price, category_id 
    } = req.body;

    if (!customer_name || !item_description) {
        return res.status(400).json({ "error": "Campos obrigatórios ausentes." });
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const uniqueId = Date.now().toString().slice(-6); 
    const receiptNumber = `${year}-${uniqueId}`;
    
    const finalCategoryId = category_id ? parseInt(category_id) : null;
    const finalPrice = price ? parseFloat(price) : 0;
    const initialStatus = 'Pendente'; 

    const sql = `INSERT INTO services 
                 (receipt_number, customer_name, customer_phone, customer_address, customer_email, item_description, service_details, price, status, category_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                 
    const params = [
        receiptNumber, customer_name, customer_phone, customer_address, customer_email, 
        item_description, service_details, finalPrice, initialStatus, finalCategoryId
    ];

    db.run(sql, params, function (err) {
        if (err) {
            console.error("Database Error:", err.message);
            return res.status(500).json({ "error": err.message });
        }
        res.status(201).json({ "message": "success", "data": { id: this.lastID, ...req.body, receipt_number: receiptNumber, status: initialStatus } });
    });
});

// Atualizar serviço
app.put('/api/services/:id', (req, res) => {
    const { id } = req.params;
    const { 
        customer_name, customer_phone, customer_address, customer_email, 
        item_description, service_details, price, status, category_id 
    } = req.body;
    
    const finalCategoryId = category_id ? parseInt(category_id) : null;
    
    const sql = `UPDATE services set
                    customer_name = COALESCE(?, customer_name),
                    customer_phone = COALESCE(?, customer_phone),
                    customer_address = COALESCE(?, customer_address),
                    customer_email = COALESCE(?, customer_email),
                    item_description = COALESCE(?, item_description),
                    service_details = COALESCE(?, service_details),
                    price = COALESCE(?, price),
                    status = COALESCE(?, status),
                    category_id = ?
                    WHERE id = ?`;
    
    const params = [
        customer_name, customer_phone, customer_address, customer_email, 
        item_description, service_details, price, status, 
        finalCategoryId, 
        id
    ];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ "error": err.message });
        res.json({ message: "success", changes: this.changes });
    });
});

// Deletar serviço
app.delete('/api/services/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM services WHERE id = ?';
    db.run(sql, id, function (err) {
        if (err) return res.status(500).json({ "error": err.message });
        res.json({ "message": "deleted", "changes": this.changes });
    });
});

// Listar categorias
app.get('/api/categories', (req, res) => {
    const sql = "SELECT * FROM categories ORDER BY name ASC";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json({ "message": "success", "data": rows });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});