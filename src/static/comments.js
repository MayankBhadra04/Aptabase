window.onload = function() {
    const authToken = localStorage.getItem('authtoken');
    if (!authToken) {
        window.location.href = '/static/admin.html'; // R
        console.log("Token not found!")// edirect to the admin login page if authentication token is not present
    } else {
        fetchComments(authToken);
    }
}

function fetchComments(authToken) {
    const apiUrl = 'https://peptabase-ixik.shuttle.app/v1/admin/comment'; 
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}` // Include the authentication token as a Bearer token in the request headers
        }
    })
    .then(response => response.json())
    .then(data => {
        displayComments(data); // Once comments are fetched successfully, display them in the frontend
    })
    .catch(error => {
        console.error('Error fetching comments:', error);
    });
}

function displayComments(comments) {
    const commentList = document.querySelector('.comment-list');
    commentList.innerHTML = ''; // Clear existing comments

    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        
        const userParagraph = document.createElement('p');
        userParagraph.innerHTML = `<strong>User:</strong> ${comment.email}`;
        commentDiv.appendChild(userParagraph);
        
        const commentParagraph = document.createElement('p');
        commentParagraph.innerHTML = `<strong>Comment:</strong> ${comment.comment}`;
        commentDiv.appendChild(commentParagraph);
        
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = 'Delete';
        commentDiv.appendChild(deleteButton);

        // Add event listener to delete button
        deleteButton.addEventListener('click', () => {
            deleteComment(comment.id); // Call deleteComment function when the delete button is clicked
        });

        commentList.appendChild(commentDiv);
    });
}

function deleteComment(commentId) {
    // Implement the logic to delete the comment with the specified ID
    // You can make a fetch request to the server to delete the comment
    // Example:
    const apiUrl = `https://peptabase-ixik.shuttle.app/v1/admin/deletecomment/${commentId}`;
    fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete comment');
        }
        return response.json();
    })
    .then(data => {
        // Handle success response
    })
    .catch(error => {
        console.error('Error deleting comment:', error);
    });
}

