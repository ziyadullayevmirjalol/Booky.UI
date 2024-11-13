const apiUrl = 'https://booky-b5bu.onrender.com/api/book';

document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    document.getElementById('addBookForm').addEventListener('submit', addBook);
    document.getElementById('updateBookForm').addEventListener('submit', updateBook);
});

// Function to load books from the API
function loadBooks() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(result => {
            console.log('API Response:', result); // Debugging line
            const books = Array.isArray(result.data) ? result.data : [];
            const booksList = document.getElementById('booksList');
            booksList.innerHTML = '';  // Clear current list

            books.forEach(book => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
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
        .catch(error => console.error('Error loading books:', error));
}

// Function to add a new book
function addBook(event) {
    event.preventDefault();

    const newBook = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        publishedDate: document.getElementById('publishedDate').value,
        isbn: document.getElementById('isbn').value,
        publisherId: 1,  // Adjust as needed
        authorsId: []    // Add author IDs as needed
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
            loadBooks();  // Reload books after adding a new one
            document.getElementById('addBookForm').reset();  // Clear form
        } else {
            console.error('Error adding book:', response.statusText);
        }
    })
    .catch(error => console.error('Error adding book:', error));
}

// Function to load book details for editing
function editBook(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(result => {
            const book = result.data;
            console.log('Editing Book:', book); // Debugging line

            // Populate the update form with the current book data
            document.getElementById('updateBookId').value = book.id;
            document.getElementById('updateTitle').value = book.title;
            document.getElementById('updateGenre').value = book.genre;
            document.getElementById('updatePublishedDate').value = book.publishedDate.split('T')[0];  // Format date
            document.getElementById('updateIsbn').value = book.isbn;
        })
        .catch(error => console.error('Error loading book for editing:', error));
}

// Function to update an existing book
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
        publisherId: 1,  // Adjust as needed
        authorsId: []    // Add author IDs as needed
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
            loadBooks();  // Reload books after update
            document.getElementById('updateBookForm').reset();  // Clear update form
        } else {
            console.error('Error updating book:', response.statusText);
        }
    })
    .catch(error => console.error('Error updating book:', error));
}

// Function to delete a book
function deleteBook(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            loadBooks();  // Reload books after delete
        } else {
            console.error('Error deleting book:', response.statusText);
        }
    })
    .catch(error => console.error('Error deleting book:', error));
}
