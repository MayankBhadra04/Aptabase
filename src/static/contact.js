document.addEventListener('DOMContentLoaded', function () {
    const commentForm = document.getElementById('comment-form');
  
    commentForm.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent default form submission
  
      // Get user input
      const userEmail = document.getElementById('user-email').value;
      const comment = document.getElementById('comment').value;
  
      // Prepare data for API call
      const formData = {
        email: userEmail,
        comment: comment
      }
      console.log(JSON.stringify(formData))
      // Call API to submit comment
      fetch('https://peptabase-ixik.shuttle.app/v1/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)

      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Handle successful submission
        console.log('Comment submitted successfully:', data);
        // You can show a success message to the user or perform any other action
      })
      .catch(error => {
        // Handle errors
        console.error('Error submitting comment:', error);
        // You can show an error message to the user or perform any other action
      });
    });
  });
  