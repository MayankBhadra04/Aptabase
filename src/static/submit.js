document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('my-form');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission behavior
  
      // Get form data
      const formData = {
        email: document.getElementById('email').value,
        aptamer: document.getElementById('aptamer').value,
        target: document.getElementById('target').value,
        apt_type: document.getElementById('apt_type').value,
        length: document.getElementById('length').value,
        sequence: document.getElementById('sequence').value,
        effect: document.getElementById('effect').value,
        reference: document.getElementById('reference').value
      };

      console.log(JSON.stringify(formData))
  
      // Make the API call
      fetch('http://peptabase-ixik.shuttle.app/v1/insert', {
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
        console.log('Success:', data);
        // Handle success response here
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle error response here
      });
    });
  });
  