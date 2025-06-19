const express = require('express'); // <-- Necesitas importar express
const app = express();              // <-- Necesitas crear una instancia de app
const PORT = process.env.PORT || 3000; // <-- Define el puerto

// Middleware para parsear JSON en el cuerpo de las peticiones
// ¡Esta línea es CRÍTICA y debe ir al principio, después de crear 'app'!
app.use(express.json());

// Middleware para parsear JSON en el cuerpo de las peticiones


// --- Datos en memoria (simulando una base de datos) ---
let books = [
    { id: '1', title: 'Cien años de soledad', author: 'Gabriel García Márquez', year: 1967 },
    { id: '2', title: '1984', author: 'George Orwell', year: 1949 },
    { id: '3', title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', year: 1605 }
];

// --- Endpoints de la API ---

// 1. GET /api/books - Obtener todos los libros
app.get('/api/books', (req, res) => {
    res.json(books);
});

// 2. GET /api/books/:id - Obtener un libro por ID
app.get('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).send('Libro no encontrado');
    }
});

// 3. POST /api/books - Agregar un nuevo libro
app.post('/api/books', (req, res) => {
    const newBook = req.body; // El cuerpo de la petición contendrá los datos del nuevo libro
    if (!newBook.title || !newBook.author) {
        return res.status(400).send('El título y el autor son campos obligatorios.');
    }
    // Asignar un ID simple (en un entorno real usarías UUIDs o IDs de DB)
    newBook.id = (books.length + 1).toString();
    books.push(newBook);
    res.status(201).json(newBook); // 201 Created
});

// 4. PUT /api/books/:id - Actualizar un libro existente
app.put('/api/books/:id', (req, res) => {
    console.log('¡PUT request recibido!'); // <-- Agrega esta línea
    const bookId = req.params.id;
    console.log('ID del libro a actualizar:', bookId);
    const updatedData = req.body;
    console.log('Datos recibidos en el body:', updatedData);
 
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex !== -1) {
        // Combinar datos existentes con los nuevos
        books[bookIndex] = { ...books[bookIndex], ...updatedData, id: bookId };
        res.json(books[bookIndex]);
    } else {
        res.status(404).send('Libro no encontrado para actualizar');
    }
});

// 5. DELETE /api/books/:id - Eliminar un libro
app.delete('/api/books/:id', (req, res) => {
    const bookId = req.params.id;
    const initialLength = books.length;
    books = books.filter(b => b.id !== bookId);

    if (books.length < initialLength) {
        res.status(204).send(); // 204 No Content (éxito sin contenido de respuesta)
    } else {
        res.status(404).send('Libro no encontrado para eliminar');
    }
});

// --- Iniciar el servidor ---
app.listen(PORT, () => {
    console.log(`API de Libros ejecutándose en http://localhost:${PORT}`);
    console.log('Endpoints disponibles:');
    console.log('GET /api/books (todos los libros)');
    console.log('GET /api/books/:id (un libro por ID)');
    console.log('POST /api/books (agregar libro)');
    console.log('PUT /api/books/:id (actualizar libro)');
    console.log('DELETE /api/books/:id (eliminar libro)');
});