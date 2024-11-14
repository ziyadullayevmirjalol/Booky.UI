const apiUrl = 'https://booky-b5bu.onrender.com/api/review';

document.addEventListener('DOMContentLoaded', () => {
    loadReviews();
    document.getElementById('addReviewForm').addEventListener('submit', addReview);
    document.getElementById('updateReviewForm').addEventListener('submit', updateReview);
});

function loadReviews() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const reviews = Array.isArray(data.data) ? data.data : [];
            const reviewsList = document.getElementById('reviewsList');
            reviewsList.innerHTML = '';

            if (reviews.length === 0) {
                reviewsList.innerHTML = '<tr><td colspan="5">No reviews available</td></tr>';
                return;
            }

            reviews.forEach(review => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${review.id}</td>
                    <td>${review.content}</td>
                    <td>${review.rating}</td>
                    <td>${review.bookTitle || "N/A"}</td>
                    <td>
                        <button onclick="editReview(${review.id})">Edit</button>
                        <button onclick="deleteReview(${review.id})">Delete</button>
                    </td>`;
                reviewsList.appendChild(row);
            });
        })
        .catch(error => {
            alert('Failed to load reviews');
            console.error('Error loading reviews:', error);
        });
}

function addReview(event) {
    event.preventDefault();
    const newReview = {
        content: document.getElementById('reviewContent').value,
        rating: document.getElementById('rating').value,
        bookId: document.getElementById('bookId').value
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
    })
        .then(response => {
            if (response.ok) {
                loadReviews();
                document.getElementById('addReviewForm').reset();
            } else {
                return response.json().then(data => {
                    throw new Error(data.message || 'Error adding review');
                });
            }
        })
        .catch(error => {
            alert(error.message);
            console.error('Error adding review:', error);
        });
}

function editReview(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(result => {
            const review = result.data;
            console.log(result.data)
            if (review) {
                document.getElementById('updateReviewId').value = review.id;
                document.getElementById('updateContent').value = review.content;
                document.getElementById('updateRating').value = review.rating;
            } else {
                alert('Review not found!');
            }
        })
        .catch(error => {
            alert(error.message);
            console.error('Error loading review for editing:', error);
        });
}

function updateReview(event) {
    event.preventDefault();
    const id = document.getElementById('updateReviewId').value;
    if (!id) {
        alert('Review ID is undefined.');
        return;
    }

    const updatedReview = {
        content: document.getElementById('updateContent').value,
        rating: document.getElementById('updateRating').value
    };

    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReview),
    })
        .then(response => {
            if (response.ok) {
                loadReviews();
                document.getElementById('updateReviewForm').reset();
            } else {
                return response.json().then(data => {
                    throw new Error(data.message || 'Error updating review');
                });
            }
        })
        .catch(error => {
            alert(error.message);
            console.error('Error updating review:', error);
        });
}

function deleteReview(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                loadReviews();
            } else {
                return response.json().then(data => {
                    throw new Error(data.message || 'Error deleting review');
                });
            }
        })
        .catch(error => {
            alert(error.message);
            console.error('Error deleting review:', error);
        });
}
