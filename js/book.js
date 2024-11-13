const apiUrl = 'https://booky-b5bu.onrender.com/api/book';

document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    document.getElementById('addBookForm').addEventListener('submit', addBook);
    document.getElementById('updateBookForm').addEventListener('submit', updateBook);
});

function loadBooks() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(result => {
            console.log('API Response:', result); // Debugging line
            const books = Array.isArray(result.data) ? result.data : [];
            const booksList = document.getElementById('booksList');
            booksList.innerHTML = '';

            books.forEach(book => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.genre}</td>
                    <td>${new Date(book.publishedDate).toLocaleDateString()}</td>
                    <td>${book.isbn}</td>
                    <td>
                        <button onclick="editBook(${book.id})">Edit</button>
                        <button onclick="deleteBook(${book.id})">Delete</button>
                    </td>`;
                booksList.appendChild(tr);
            });
        })
        .catch(error => console.error('Error loading books:', error));
}

function addBook(event) {
    event.preventDefault();
    const newBook = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        publishedDate: document.getElementById('publishedDate').value,
        isbn: document.getElementById('isbn').value,
        publisherId: 1, // Adjust as needed
        authorsId: []   // Add author IDs as needed
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
    })
    .then(response => {
        if (response.ok) {
            loadBooks();
            document.getElementById('addBookForm').reset();
        } else {
            console.error('Error adding book:', response.statusText);
        }
    })
    .catch(error => console.error('Error adding book:', error));
}

function editBook(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(result => {
            const book = result.data;
            console.log('Editing Book:', book); // Debugging line

            document.getElementById('updateBookId').value = book.id;
            document.getElementById('updateTitle').value = book.title;
            document.getElementById('updateGenre').value = book.genre;
            document.getElementById('updatePublishedDate').value = book.publishedDate.split('T')[0];
            document.getElementById('updateIsbn').value = book.isbn;
        })
        .catch(error => console.error('Error loading book:', error));
}

function updateBook(event) {
    event.preventDefault();
    const id = document.getElementById('updateBookId').value;

    if (!id) {
        console.error('Book ID is undefined.');
        return;
    }

    const updatedBook = {
        title: document.getElementById('updateTitle').value,
        genre: document.getElementById('updateGenre').value,
        publishedDate: document.getElementById('updatePublishedDate').value,
        isbn: document.getElementById('updateIsbn').value,
        publisherId: 1, // Adjust as needed
        authorsId: []   // Add author IDs as needed
    };

    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBook),
    })
    .then(response => {
        if (response.ok) {
            loadBooks();
            document.getElementById('updateBookForm').reset();
        } else {
            console.error('Error updating book:', response.statusText);
        }
    })
    .catch(error => console.error('Error updating book:', error));
}

function deleteBook(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            loadBooks();
        } else {
            console.error('Error deleting book:', response.statusText);
        }
    })
    .catch(error => console.error('Error deleting book:', error));
}
