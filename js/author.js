const apiUrl = 'https://booky-b5bu.onrender.com/api/author';

document.addEventListener('DOMContentLoaded', () => {
    loadAuthors();
    document.getElementById('addAuthorForm').addEventListener('submit', addAuthor);
    document.getElementById('updateAuthorForm').addEventListener('submit', updateAuthor);
});

function loadAuthors() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load authors. Status: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data);
            const authors = Array.isArray(data.data) ? data.data : [];
            const authorsList = document.getElementById('authorsList');
            authorsList.innerHTML = '';

            authors.forEach(author => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${author.id}</td>
                    <td>${author.firstName}</td>
                    <td>${author.lastName}</td>
                    <td>${author.biography}</td>
                    <td>${author.booksId}</td>
                    <td>
                        <button onclick="editAuthor(${author.id})">Edit</button>
                        <button onclick="deleteAuthor(${author.id})">Delete</button>
                    </td>`;
                authorsList.appendChild(row);
            });
        })
        .catch(error => {
            alert(error.message);
            console.error('Error loading authors:', error);
        });
}

function addAuthor(event) {
    event.preventDefault();
    const newAuthor = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        biography: document.getElementById('biography').value,
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAuthor),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    const message = data.message || 'No message from backend';
                    throw new Error(`Error adding author. Message: ${message}`);
                });
            }
            return response.json();
        })
        .then(result => {
            loadAuthors();
            document.getElementById('addAuthorForm').reset();
        })
        .catch(error => {
            alert(error.message);
            console.error('Error adding author:', error);
        });
}

function editAuthor(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    const message = data.message || 'No message from backend';
                    throw new Error(`Error loading author for editing. Message: ${message}`);
                });
            }
            return response.json();
        })
        .then(result => {
            const author = result.data;
            console.log('Editing Author:', author);

            document.getElementById('updateAuthorId').value = author.id;
            document.getElementById('updateFirstName').value = author.firstName;
            document.getElementById('updateLastName').value = author.lastName;
            document.getElementById('updateBiography').value = author.biography;
        })
        .catch(error => {
            alert(error.message);
            console.error('Error loading author for editing:', error);
        });
}

function updateAuthor(event) {
    event.preventDefault();
    const id = document.getElementById('updateAuthorId').value;

    if (!id) {
        alert('Author ID is undefined.');
        return;
    }

    const updatedAuthor = {
        firstName: document.getElementById('updateFirstName').value,
        lastName: document.getElementById('updateLastName').value,
        biography: document.getElementById('updateBiography').value,
    };

    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAuthor),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    const message = data.message || 'No message from backend';
                    throw new Error(`Error updating author. Message: ${message}`);
                });
            }
            return response.json();
        })
        .then(result => {
            loadAuthors();
            document.getElementById('updateAuthorForm').reset();
        })
        .catch(error => {
            alert(error.message);
            console.error('Error updating author:', error);
        });
}

function deleteAuthor(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    const message = data.message || 'No message from backend';
                    throw new Error(`Error deleting author. Message: ${message}`);
                });
            }
            return response.json();
        })
        .then(result => {
            loadAuthors();
        })
        .catch(error => {
            alert(error.message);
            console.error('Error deleting author:', error);
        });
}
