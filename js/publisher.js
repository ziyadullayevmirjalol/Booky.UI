const apiUrl = 'https://booky-b5bu.onrender.com/api/publisher';

document.addEventListener('DOMContentLoaded', () => {
    loadPublishers();
    document.getElementById('addPublisherForm').addEventListener('submit', addPublisher);
    document.getElementById('updatePublisherForm').addEventListener('submit', updatePublisher);
});

function loadPublishers() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load publishers');
            }
            return response.json();
        })
        .then(data => {
            console.log('Publishers Data:', data);
            const publishers = Array.isArray(data.data) ? data.data : [];
            const publishersList = document.getElementById('publishersList');
            publishersList.innerHTML = '';

            if (publishers.length === 0) {
                publishersList.innerHTML = '<tr><td colspan="4">No publishers available</td></tr>';
                return;
            }

            publishers.forEach(publisher => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${publisher.id}</td>
                    <td>${publisher.name}</td>
                    <td>${publisher.address}</td>
                    <td>${publisher.contactNumber}</td>
                    <td>
                        <button onclick="editPublisher(${publisher.id})">Edit</button>
                        <button onclick="deletePublisher(${publisher.id})">Delete</button>
                    </td>`;
                publishersList.appendChild(row);
            });
        })
        .catch(error => {
            alert(error.message);
            console.error('Error loading publishers:', error);
        });
}

function addPublisher(event) {
    event.preventDefault();
    const newPublisher = {
        name: document.getElementById('publisherName').value,
        address: document.getElementById('publisherAddress').value,
        contactNumber: document.getElementById('publisherContact').value,
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPublisher),
    })
        .then(response => {
            if (response.ok) {
                loadPublishers();
                document.getElementById('addPublisherForm').reset();
            } else {
                return response.json().then(data => {
                    const message = data.message || 'No message from backend';
                    throw new Error(`Error adding publisher. Message: ${message}`);
                });
            }
        })
        .catch(error => {
            alert(error.message);
            console.error('Error adding publisher:', error);
        });
}

function editPublisher(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(result => {
            const publisher = result.data || result;
            if (publisher) {
                document.getElementById('updatePublisherId').value = publisher.id;
                document.getElementById('updatePublisherName').value = publisher.name;
                document.getElementById('updatePublisherAddress').value = publisher.address;
                document.getElementById('updatePublisherContact').value = publisher.contactNumber;
            } else {
                alert('Publisher not found!');
            }
        })
        .catch(error => {
            alert(error.message);
            console.error('Error loading publisher for editing:', error);
        });
}

function updatePublisher(event) {
    event.preventDefault();
    const id = document.getElementById('updatePublisherId').value;
    if (!id) {
        alert('Publisher ID is undefined.');
        return;
    }

    const updatedPublisher = {
        name: document.getElementById('updatePublisherName').value,
        address: document.getElementById('updatePublisherAddress').value,
        contactNumber: document.getElementById('updatePublisherContact').value,
    };

    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPublisher),
    })
        .then(response => {
            if (response.ok) {
                loadPublishers();
                document.getElementById('updatePublisherForm').reset();
            } else {
                return response.json().then(data => {
                    const message = data.message || 'No message from backend';
                    throw new Error(`Error updating publisher. Message: ${message}`);
                });
            }
        })
        .catch(error => {
            alert(error.message);
            console.error('Error updating publisher:', error);
        });
}

function deletePublisher(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                loadPublishers();
            } else {
                return response.json().then(data => {
                    const message = data.message || 'No message from backend';
                    throw new Error(`Error deleting publisher. Message: ${message}`);
                });
            }
        })
        .catch(error => {
            alert(error.message);
            console.error('Error deleting publisher:', error);
        });
}
