const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Configuración de la Base de Datos SQLite ---
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error abriendo la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role INTEGER DEFAULT 1 -- 1: Usuario Normal, 2: Administrador
            )
        `, (err) => {
            if (err) {
                console.error('Error creando tabla users:', err.message);
            } else {
                console.log('Tabla users asegurada.');
                db.get("SELECT COUNT(*) AS count FROM users WHERE email = ?", ['admin@gamarka.com'], (err, row) => {
                    if (err) return console.error('Error al verificar admin:', err.message);
                    if (row.count === 0) {
                        bcrypt.hash('adminpassword', 10, (err, hash) => {
                            if (err) return console.error('Error al hashear password de admin:', err.message);
                            db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
                                ['Administrador Principal', 'admin@gamarka.com', hash, 2],
                                function (err) {
                                    if (err) console.error('Error al insertar admin inicial:', err.message);
                                    else console.log('Usuario administrador inicial creado: admin@gamarka.com (password: adminpassword)');
                                });
                        });
                    }
                });
            }
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS products (
                code TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                description TEXT,
                imageUrl TEXT
            )
        `, (err) => {
            if (err) console.error('Error creando tabla products:', err.message);
            else {
                console.log('Tabla products asegurada.');
                db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
                    if (err) return console.error(err.message);
                    if (row.count === 0) {
                        const stmt = db.prepare("INSERT INTO products (code, name, price, description, imageUrl) VALUES (?, ?, ?, ?, ?)");
                        stmt.run('0001', 'Jamón Serrano', 25.00, 'Delicioso jamón curado, ideal para tapas.', 'https://via.placeholder.com/200x150?text=Jamón+Serrano');
                        stmt.run('0002', 'Galletas Artesanales', 8.50, 'Hechas a mano con ingredientes frescos.', 'https://via.placeholder.com/200x150?text=Galletas+Artesanales');
                        stmt.run('0003', 'Chocolate Suizo', 12.00, 'El mejor chocolate con leche importado.', 'https://via.placeholder.com/200x150?text=Chocolate+Suizo');
                        stmt.run('0004', 'Lomo de Cerdo', 18.75, 'Tierna y jugosa pieza de lomo fresco.', 'https://via.placeholder.com/200x150?text=Lomo+de+Cerdo');
                        stmt.run('0005', 'Bombones Surtidos', 15.50, 'Selección de bombones premium.', 'https://via.placeholder.com/200x150?text=Bombones+Surtidos');
                        stmt.run('0006', 'Salchichón Ibérico', 20.00, 'Salchichón de bellota de alta calidad.', 'https://via.placeholder.com/200x150?text=Salchichón+Ibérico');
                        stmt.run('0007', 'Pan de Queso', 5.00, 'Deliciosos panes con queso fundido.', 'https://via.placeholder.com/200x150?text=Pan+de+Queso');
                        stmt.run('0008', 'Chorizo Picante', 10.00, 'Chorizo con un toque picante.', 'https://via.placeholder.com/200x150?text=Chorizo+Picante');
                        stmt.finalize();
                        console.log('Productos de ejemplo insertados.');
                    }
                });
            }
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS clients (
                code TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                id_number TEXT UNIQUE NOT NULL,
                phone TEXT,
                address TEXT
            )
        `, (err) => {
            if (err) console.error('Error creando tabla clients:', err.message);
            else {
                console.log('Tabla clients asegurada.');
                db.get("SELECT COUNT(*) AS count FROM clients", (err, row) => {
                    if (err) return console.error(err.message);
                    if (row.count === 0) {
                        const stmt = db.prepare("INSERT INTO clients (code, name, id_number, phone, address) VALUES (?, ?, ?, ?, ?)");
                        stmt.run('001', 'María González', 'V-12345678', '0414-1234567', 'Calle La Paz, Casa 5');
                        stmt.run('002', 'Panadería El Trigo', 'J-98765432', '0212-9876543', 'Av. Principal, Local 10');
                        stmt.run('003', 'Carnicería La Finca', 'J-11223344', '0426-5551234', 'Mercado Municipal, Puesto 20');
                        stmt.finalize();
                        console.log('Clientes de ejemplo insertados.');
                    }
                });
            }
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_number TEXT NOT NULL,
                amount REAL NOT NULL,
                comments TEXT,
                file_path TEXT NOT NULL,
                uploader_name TEXT NOT NULL,
                upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) console.error('Error creando tabla payments:', err.message);
            else console.log('Tabla payments asegurada.');
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS invoices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_number TEXT UNIQUE NOT NULL,
                client_code TEXT NOT NULL,
                client_name TEXT NOT NULL,
                total_amount REAL NOT NULL,
                pdf_path TEXT NOT NULL,
                generation_date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) console.error('Error creando tabla invoices:', err.message);
            else console.log('Tabla invoices asegurada.');
        });
    }
});

// --- Asegurar directorios de subida ---
const uploadDir = path.join(__dirname, 'uploads');
const paymentsDir = path.join(uploadDir, 'payments');
const invoicesDir = path.join(uploadDir, 'invoices');

[uploadDir, paymentsDir, invoicesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Directorio creado: ${dir}`);
    }
});

// --- Configuración de Multer para la subida de archivos ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, paymentsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
    const userRole = req.headers['x-user-role'];
    if (parseInt(userRole) === 2) {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
};

// --- Rutas de la API (Endpoints) ---

// 1. Registro de Usuario
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) return res.status(500).json({ message: 'Error en el servidor.' });
        if (row) return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ message: 'Error al hashear la contraseña.' });
            db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
                [name, email, hashedPassword, 1],
                function (err) {
                    if (err) return res.status(500).json({ message: 'Error al registrar el usuario.' });
                    res.status(201).json({ message: 'Usuario registrado con éxito.', userId: this.lastID });
                }
            );
        });
    });
});

// 2. Login de Usuario
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
    }
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ message: 'Error en el servidor.' });
        if (!user) return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error al verificar la contraseña.' });
            if (!isMatch) return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });

            res.status(200).json({
                message: 'Inicio de sesión exitoso.',
                user: { id: user.id, name: user.name, email: user.email, role: user.role }
            });
        });
    });
});

// 3. Obtener Productos (Todos) con búsqueda y ordenamiento
app.get('/products', (req, res) => {
    const searchTerm = req.query.search ? `%${req.query.search.toLowerCase()}%` : '%';
    const query = `
        SELECT * FROM products
        WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(code) LIKE ?
        ORDER BY code ASC
    `;
    db.all(query, [searchTerm, searchTerm, searchTerm], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Error al obtener productos.', error: err.message });
        res.status(200).json(rows);
    });
});

// 4. Obtener un producto por código (exacto)
app.get('/product/:code', (req, res) => {
    const productCode = req.params.code.toUpperCase();
    db.get("SELECT * FROM products WHERE code = ?", [productCode], (err, row) => {
        if (err) return res.status(500).json({ message: 'Error al buscar producto.', error: err.message });
        if (!row) return res.status(404).json({ message: 'Producto no encontrado.' });
        res.status(200).json(row);
    });
});

// 5. Sugerencias de Productos (búsqueda parcial por nombre o código)
app.get('/product-suggestions', (req, res) => {
    const queryTerm = req.query.q ? `%${req.query.q.toLowerCase()}%` : '';
    if (!queryTerm) return res.json([]);

    const query = `
        SELECT code, name FROM products
        WHERE LOWER(code) LIKE ? OR LOWER(name) LIKE ?
        ORDER BY code ASC
        LIMIT 10
    `;
    db.all(query, [queryTerm, queryTerm], (err, rows) => {
        if (err) {
            console.error('Error buscando sugerencias de productos:', err.message);
            return res.status(500).json([]);
        }
        res.json(rows);
    });
});


// 6. Añadir Nuevo Producto (Admin)
app.post('/products', isAdmin, (req, res) => {
    const { code, name, price, description, imageUrl } = req.body;
    const formattedCode = String(code).padStart(4, '0');

    if (!formattedCode || !name || !price) {
        return res.status(400).json({ message: 'Código, nombre y precio son obligatorios.' });
    }

    db.get("SELECT * FROM products WHERE code = ?", [formattedCode], (err, row) => {
        if (err) return res.status(500).json({ message: 'Error al verificar producto existente.' });
        if (row) return res.status(409).json({ message: 'Ya existe un producto con ese código.' });

        db.run("INSERT INTO products (code, name, price, description, imageUrl) VALUES (?, ?, ?, ?, ?)",
            [formattedCode, name, parseFloat(price), description || '', imageUrl || ''],
            function (err) {
                if (err) return res.status(500).json({ message: 'Error al añadir el producto.', error: err.message });
                res.status(201).json({ message: 'Producto añadido con éxito.', productId: this.lastID });
            }
        );
    });
});
// (Aquí irían PUT y DELETE para productos)


// 7. Obtener Clientes (Solo para Admin) con búsqueda
app.get('/clients', isAdmin, (req, res) => {
    const searchTerm = req.query.search ? `%${req.query.search.toLowerCase()}%` : '%';
    const query = `
        SELECT * FROM clients
        WHERE LOWER(name) LIKE ? OR LOWER(id_number) LIKE ? OR LOWER(code) LIKE ? OR LOWER(address) LIKE ?
        ORDER BY code ASC
    `;
    db.all(query, [searchTerm, searchTerm, searchTerm, searchTerm], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Error al obtener clientes.', error: err.message });
        res.status(200).json(rows);
    });
});

// 8. Obtener un cliente por código (exacto)
app.get('/client/:code', (req, res) => {
    const clientCode = req.params.code.toUpperCase();
    db.get("SELECT * FROM clients WHERE code = ?", [clientCode], (err, row) => {
        if (err) return res.status(500).json({ message: 'Error al buscar cliente.', error: err.message });
        if (!row) return res.status(404).json({ message: 'Cliente no encontrado.' });
        res.status(200).json(row);
    });
});

// 9. Sugerencias de Clientes (búsqueda parcial por nombre o código)
app.get('/client-suggestions', (req, res) => {
    const queryTerm = req.query.q ? `%${req.query.q.toLowerCase()}%` : '';
    if (!queryTerm) return res.json([]);

    const query = `
        SELECT code, name FROM clients
        WHERE LOWER(code) LIKE ? OR LOWER(name) LIKE ?
        ORDER BY code ASC
        LIMIT 10
    `;
    db.all(query, [queryTerm, queryTerm], (err, rows) => {
        if (err) {
            console.error('Error buscando sugerencias de clientes:', err.message);
            return res.status(500).json([]);
        }
        res.json(rows);
    });
});

// 10. Obtener el siguiente código de cliente (NUEVO)
app.get('/clients/next-code', isAdmin, (req, res) => {
    db.get("SELECT MAX(code) AS max_code FROM clients", (err, row) => {
        if (err) {
            console.error('Error al obtener el máximo código de cliente:', err.message);
            return res.status(500).json({ message: 'Error al obtener el siguiente código de cliente.' });
        }
        let nextCodeNum = 1;
        if (row && row.max_code) {
            nextCodeNum = parseInt(row.max_code) + 1;
        }
        const nextCode = String(nextCodeNum).padStart(3, '0');
        res.status(200).json({ nextCode: nextCode });
    });
});


// 11. Añadir Nuevo Cliente (Admin)
app.post('/clients', isAdmin, (req, res) => {
    const { code, name, id_number, phone, address } = req.body;
    // No formateamos el código aquí porque ya debería venir formateado o generado
    const clientCode = code;

    if (!clientCode || !name || !id_number) {
        return res.status(400).json({ message: 'Código, nombre e identificación son obligatorios.' });
    }

    db.get("SELECT * FROM clients WHERE code = ? OR id_number = ?", [clientCode, id_number], (err, row) => {
        if (err) return res.status(500).json({ message: 'Error al verificar cliente existente.' });
        if (row) {
            if (row.code === clientCode) {
                return res.status(409).json({ message: 'Ya existe un cliente con ese código.' });
            } else if (row.id_number === id_number) {
                return res.status(409).json({ message: 'Ya existe un cliente con esa identificación.' });
            }
        }

        db.run("INSERT INTO clients (code, name, id_number, phone, address) VALUES (?, ?, ?, ?, ?)",
            [clientCode, name, id_number, phone || '', address || ''],
            function (err) {
                if (err) return res.status(500).json({ message: 'Error al añadir el cliente.', error: err.message });
                res.status(201).json({ message: 'Cliente añadido con éxito.', clientId: this.lastID });
            }
        );
    });
});


// 12. Subir Pago
app.post('/upload_payment', upload.single('paymentProof'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se subió ningún archivo.' });
    }

    const { invoiceNumber, amount, comments, uploaderName } = req.body;
    const filePath = req.file.path;

    if (!invoiceNumber || !amount || !uploaderName) {
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error al eliminar archivo incompleto:', err.message);
        });
        return res.status(400).json({ message: 'Número de factura, monto y nombre del remitente son obligatorios.' });
    }

    db.run("INSERT INTO payments (invoice_number, amount, comments, file_path, uploader_name) VALUES (?, ?, ?, ?, ?)",
        [invoiceNumber, parseFloat(amount), comments || '', filePath, uploaderName],
        function (err) {
            if (err) {
                console.error('Error al insertar pago en DB:', err.message);
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error al eliminar archivo después de fallo DB:', err.message);
                });
                return res.status(500).json({ message: 'Error al registrar el pago en la base de datos.' });
            }
            res.status(201).json({ message: 'Comprobante de pago subido y registrado exitosamente.', paymentId: this.lastID, filePath: filePath });
        }
    );
});


// 13. Generar Factura en PDF (Corrección de crasheo y mejoras de formato)
app.post('/generate_invoice', (req, res) => {
    const { client, items, totalAmount, subtotal, taxAmount } = req.body;

    if (!client || !client.code || !client.name || !items || items.length === 0 || !totalAmount) {
        return res.status(400).json({ message: 'Datos de factura incompletos. Asegúrate de que el cliente y los productos estén seleccionados y el total sea válido.' });
    }

    db.get("SELECT COUNT(*) AS count FROM invoices", (err, row) => {
        if (err) {
            console.error('Error al obtener el contador de facturas:', err.message);
            return res.status(500).json({ message: 'Error interno al generar factura (problema con contador).' });
        }

        const nextInvoiceNumber = row.count + 1;
        const formattedInvoiceNumber = String(nextInvoiceNumber).padStart(4, '0');

        // *************** CORRECCIÓN CLAVE PARA EL CRASHEO DE FUENTES ***************
        // PDFKit por defecto busca las fuentes en el directorio actual.
        // Para usar las fuentes predeterminadas sin problemas, simplemente no especifiques la ruta.
        // Se recomienda usar `Helvetica`, `Helvetica-Bold`, `Helvetica-Oblique` y `Helvetica-BoldOblique`
        // que vienen incluidas en PDFKit y no requieren archivos externos.
        // Si quieres fuentes personalizadas, tendrías que incluirlas y especificar la ruta completa.
        const doc = new PDFDocument({ margin: 50 });
        // ******************************************************************************

        const cleanClientName = client.name.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, '_');
        const fileName = `Factura_${cleanClientName}_${formattedInvoiceNumber}.pdf`;
        const filePath = path.join(invoicesDir, fileName);

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        stream.on('error', (err) => {
            console.error('Error al escribir el archivo PDF:', err);
            // Si el stream falla antes de que la respuesta HTTP sea enviada, podemos manejarlo.
            // Si ya se enviaron los headers, esto no tendrá efecto.
            if (!res.headersSent) {
                return res.status(500).json({ message: 'Error interno del servidor al crear el archivo PDF.' });
            }
        });

        // --- Contenido del PDF ---
        doc.font('Helvetica-Bold').fontSize(25).fillColor('#A0522D').text('Gamarka', { align: 'center' });
        doc.moveDown();
        doc.font('Helvetica').fontSize(10).text('Tu Charcutería y Confitería de Calidad', { align: 'center' });
        doc.moveDown();
        doc.strokeColor('#D2B48C').lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        doc.fontSize(12).fillColor('#333');
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-VE')}`, { align: 'right' });
        doc.text(`Factura N°: ${formattedInvoiceNumber}`, { align: 'right' });
        doc.moveDown();

        doc.font('Helvetica-Bold').fontSize(14).text('Datos del Cliente:', { underline: true });
        doc.font('Helvetica').fontSize(11)
            .text(`Nombre/Razón Social: ${client.name}`)
            .text(`Identificación: ${client.id_number}`)
            .text(`Código: ${client.code}`)
            .text(`Dirección: ${client.address || 'N/A'}`);
        doc.moveDown();

        doc.font('Helvetica-Bold').fontSize(14).text('Detalle de Productos:', { underline: true });
        doc.moveDown(0.5);

        const tableTop = doc.y;
        const col1 = 50;
        const col2 = 120;
        const col3 = 300;
        const col4 = 380;
        const col5 = 450;
        const colWidth = 60;

        doc.font('Helvetica-Bold').fontSize(10);
        doc.text('Código', col1, tableTop);
        doc.text('Descripción', col2, tableTop);
        doc.text('Cant.', col3, tableTop, { width: colWidth, align: 'right' });
        doc.text('P. Unit.', col4, tableTop, { width: colWidth, align: 'right' });
        doc.text('Subtotal', col5, tableTop, { width: colWidth, align: 'right' });
        doc.moveDown();

        doc.strokeColor('#ddd').lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);

        doc.font('Helvetica').fontSize(10);
        let currentY = doc.y;
        items.forEach(item => {
            const itemName = item.name ? item.name : 'Producto Desconocido';
            doc.text(item.code, col1, currentY);
            doc.text(itemName, col2, currentY, { width: 170 });
            doc.text(item.quantity.toFixed(0), col3, currentY, { width: colWidth, align: 'right' });
            doc.text(item.price.toFixed(2), col4, currentY, { width: colWidth, align: 'right' });
            doc.text(item.lineTotal.toFixed(2), col5, currentY, { width: colWidth, align: 'right' });
            currentY += 20;
        });
        doc.y = currentY;
        doc.moveDown();

        doc.strokeColor('#D2B48C').lineWidth(1).moveTo(400, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);

        doc.font('Helvetica').fontSize(11).fillColor('#333');
        doc.text(`Subtotal:`, 400, doc.y, { width: 80, align: 'left' });
        doc.text(`$${subtotal.toFixed(2)}`, 400, doc.y, { width: 150, align: 'right' });
        doc.moveDown(0.3);

        doc.text(`IVA (16%):`, 400, doc.y, { width: 80, align: 'left' });
        doc.text(`$${taxAmount.toFixed(2)}`, 400, doc.y, { width: 150, align: 'right' });
        doc.moveDown(0.3);

        doc.font('Helvetica-Bold').fontSize(14).fillColor('#A0522D');
        doc.text(`Total a Pagar:`, 400, doc.y, { width: 100, align: 'left' });
        doc.text(`$${totalAmount.toFixed(2)}`, 400, doc.y, { width: 150, align: 'right' });
        doc.moveDown();

        doc.font('Helvetica-Italic').fontSize(10).fillColor('#555').text('¡Gracias por tu compra!', { align: 'center' });

        doc.end();

        stream.on('finish', () => {
            db.run("INSERT INTO invoices (invoice_number, client_code, client_name, total_amount, pdf_path) VALUES (?, ?, ?, ?, ?)",
                [formattedInvoiceNumber, client.code, client.name, totalAmount, filePath],
                function (err) {
                    if (err) {
                        console.error('Error al guardar factura en DB:', err.message);
                        return res.status(500).json({ message: 'Factura generada, pero hubo un error al registrarla en la base de datos.' });
                    }
                    res.status(201).json({
                        message: 'Factura generada y guardada exitosamente.',
                        invoiceNumber: formattedInvoiceNumber,
                        pdfPath: `/uploads/invoices/${fileName}`
                    });
                }
            );
        });
    });
});

// --- Nuevas Rutas para Gestión de Usuarios/Roles (Admin Only) ---

// 14. Obtener todos los usuarios (para asignar o ver roles)
app.get('/admin/users', isAdmin, (req, res) => {
    db.all("SELECT id, name, email, role FROM users ORDER BY name ASC", [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Error al obtener usuarios.', error: err.message });
        res.status(200).json(rows);
    });
});

// 15. Actualizar el rol de un usuario
app.put('/admin/users/:id/role', isAdmin, (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;

    if (!userId || ![1, 2].includes(parseInt(role))) {
        return res.status(400).json({ message: 'ID de usuario o rol inválido.' });
    }

    db.run("UPDATE users SET role = ? WHERE id = ?", [role, userId], function (err) {
        if (err) return res.status(500).json({ message: 'Error al actualizar el rol.', error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Usuario no encontrado.' });
        res.status(200).json({ message: 'Rol de usuario actualizado con éxito.' });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor de Gamarka ejecutándose en http://localhost:${port}`);
    console.log('Asegúrate de iniciar este servidor y luego abrir index.html en tu navegador.');
    console.log('Usuario Admin por defecto: admin@gamarka.com / adminpassword');
    console.log('Ahora puedes gestionar roles de usuario desde la sección "Opciones Admin".');
});