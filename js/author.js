const apiUrl = 'https://localhost:7177/api/author';

document.addEventListener('DOMContentLoaded', () => {
    loadAuthors();
    document.getElementById('addAuthorForm').addEventListener('submit', addAuthor);
    document.getElementById('updateAuthorForm').addEventListener('submit', updateAuthor);
});

function loadAuthors() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
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
                    <td>${author.firstName}</td>
                    <td>${author.lastName}</td>
                    <td>${author.biography}</td>
                    <td>
                        <button onclick="editAuthor(${author.id})">Edit</button> 
                        <button onclick="deleteAuthor(${author.id})">Delete</button>
                    </td>`;
                authorsList.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading authors:', error));
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
            if (response.ok) {
                loadAuthors();
                document.getElementById('addAuthorForm').reset();
            } else {
                console.error('Error adding author:', response.statusText);
            }
        })
        .catch(error => console.error('Error adding author:', error));
}

function editAuthor(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(result => {
            const author = result.data;
            console.log('Editing Author:', author);

            document.getElementById('updateAuthorId').value = author.id;
            document.getElementById('updateFirstName').value = author.firstName;
            document.getElementById('updateLastName').value = author.lastName;
            document.getElementById('updateBiography').value = author.biography;
        })
        .catch(error => console.error('Error loading author:', error));
}

function updateAuthor(event) {
    event.preventDefault();
    const id = document.getElementById('updateAuthorId').value;
    console.log('Author ID for update:', id);

    if (!id) {
        console.error('Author ID is undefined.');
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
            if (response.ok) {
                loadAuthors();
                document.getElementById('updateAuthorForm').reset();
            } else {
                console.error('Error updating author:', response.statusText);
            }
        })
        .catch(error => console.error('Error updating author:', error));
}


function deleteAuthor(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                loadAuthors();
            } else {
                console.error('Error deleting author:', response.statusText);
            }
        })
        .catch(error => console.error('Error deleting author:', error));
}
