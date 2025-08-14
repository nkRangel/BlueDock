// backend/server.js

const express = require('express');
const cors = require('cors');
// Importo minha configuração do banco de dados.
const db = require('./database.js');

const app = express();
// Defini a porta 3001 para a API, para não conflitar com a porta do frontend do Vite.
const PORT = 3001;

// Middlewares essenciais.
// O cors() permite que meu frontend React, rodando em outra porta, possa fazer requisições para esta API.
app.use(cors());
// O express.json() permite que a API entenda o corpo de requisições enviado em formato JSON.
app.use(express.json());


// --- ROTAS DA API ---

// ROTA GET: Busca e lista todos os serviços.
app.get('/api/services', (req, res) => {
    // Ordeno por 'created_at DESC' para que os serviços mais recentes apareçam primeiro.
    const sql = "SELECT * FROM services ORDER BY created_at DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// ROTA POST: Adiciona um novo serviço.
app.post('/api/services', (req, res) => {
    const { customer_name, item_description, price } = req.body;

    // Validação básica para garantir a integridade dos dados essenciais.
    if (!customer_name || !item_description || !price) {
        return res.status(400).json({ "error": "Faltam dados. Nome, descrição e preço são obrigatórios." });
    }

    // A lógica para gerar o número do canhoto é baseada no timestamp
    // para garantir um ID único e sequencial, o que é mais robusto que um número aleatório.
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const uniqueId = Date.now().toString().slice(-6); 
    const receiptNumber = `${year}-${uniqueId}`;

    const sql = 'INSERT INTO services (receipt_number, customer_name, item_description, price, status) VALUES (?, ?, ?, ?, ?)';
    // O status padrão de todo novo serviço é 'Pendente'.
    const params = [receiptNumber, customer_name, item_description, price, 'Pendente'];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        // Retorno o objeto completo, incluindo o novo ID e o canhoto gerado.
        res.status(201).json({
            "message": "success",
            "data": { id: this.lastID, receipt_number: receiptNumber, customer_name, item_description, price, status: 'Pendente' }
        });
    });
});

// ROTA PUT: Atualiza um serviço existente.
app.put('/api/services/:id', (req, res) => {
    const { id } = req.params;
    const { customer_name, item_description, price, status } = req.body;

    // Gostei muito de usar COALESCE aqui. Ele permite atualizações parciais de forma elegante.
    // Se um campo não for enviado pelo frontend, o COALESCE mantém o valor que já estava no banco.
    const sql = `UPDATE services set
                    customer_name = COALESCE(?, customer_name),
                    item_description = COALESCE(?, item_description),
                    price = COALESCE(?, price),
                    status = COALESCE(?, status)
                    WHERE id = ?`;
    const params = [customer_name, item_description, price, status, id];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        res.json({
            message: "success",
            changes: this.changes
        });
    });
});

// ROTA DELETE: Remove um serviço.
app.delete('/api/services/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM services WHERE id = ?';

    db.run(sql, id, function (err) {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        res.json({ "message": "deleted", "changes": this.changes });
    });
});

// Inicialização do servidor.
app.listen(PORT, () => {
    console.log(`Servidor do BlueDock rodando na porta ${PORT}. API pronta para as requisições do front-end!`);
});