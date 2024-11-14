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
            console.log('API Response:', result);
            const books = Array.isArray(result.data) ? result.data : [];
            const booksList = document.getElementById('booksList');
            booksList.innerHTML = '';

            books.forEach(book => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.genre}</td>
                    <td>${new Date(book.publishedDate).toLocaleDateString()}</td>
                    <td>${book.isbn}</td>
                    <td>${book.publisherId}</td>
                    <td>${book.authorsId}</td>
                    
                    <td>
                        <button onclick="editBook(${book.id})">Edit</button>
                        <button onclick="deleteBook(${book.id})">Delete</button>
                    </td>`;
                booksList.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error loading books:', error);
            window.alert('Error loading books. Please try again later.');
        });
}

function addBook(event) {
    event.preventDefault();

    const newBook = {
        title: document.getElementById('bookTitle').value,
        genre: document.getElementById('bookGenre').value,
        publisherId: document.getElementById('publisherId').value,
        authorsId: document.getElementById('authorsId').value.split(',').map(id => id.trim()),
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
                response.json().then(error => {
                    console.error('Error adding book:', error.message);
                    window.alert(`Error adding book: ${error.message}`);
                });
            }
        })
        .catch(error => {
            console.error('Error adding book:', error);
            window.alert('Error adding book. Please try again later.');
        });
}

function editBook(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(result => {
            const book = result.data;
            console.log('Editing Book:', book);

            document.getElementById('updateBookId').value = book.id;
            document.getElementById('updateTitle').value = book.title;
            document.getElementById('updateGenre').value = book.genre;
        })
        .catch(error => {
            console.error('Error loading book for editing:', error);
            window.alert('Error loading book for editing. Please try again later.');
        });
}


function updateBook(event) {
    event.preventDefault();

    const id = document.getElementById('updateBookId').value;

    if (!id) {
        console.error('Book ID is undefined.');
        window.alert('Book ID is undefined.');
        return;
    }

    const updatedBook = {
        title: document.getElementById('updateTitle').value,
        genre: document.getElementById('updateGenre').value,
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
                response.json().then(error => {
                    console.error('Error updating book:', error.message);
                    window.alert(`Error updating book: ${error.message}`);
                });
            }
        })
        .catch(error => {
            console.error('Error updating book:', error);
            window.alert('Error updating book. Please try again later.');
        });
}

function deleteBook(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                loadBooks();
            } else {
                response.json().then(error => {
                    console.error('Error deleting book:', error.message);
                    window.alert(`Error deleting book: ${error.message}`);
                });
            }
        })
        .catch(error => {
            console.error('Error deleting book:', error);
            window.alert('Error deleting book. Please try again later.');
        });
}
