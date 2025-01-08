document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('my-form');

  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get authtoken from localStorage
    const authToken = localStorage.getItem('authtoken');
    if (!authToken) {
        // Redirect to admin login page if authtoken is not present
        window.location.href = '/static/admin.html';
        return;
    }

    // Get form data
    const formData = {
      id :'0',
      aptamer: document.getElementById('aptamer').value,
      target: document.getElementById('target').value,
      apt_type: document.getElementById('apt_type').value,
      length: document.getElementById('length').value,
      sequence: document.getElementById('sequence').value,
      effect: document.getElementById('effect').value,
      reference: document.getElementById('reference').value
    };

    console.log(JSON.stringify(formData))

    // Make the API call with authtoken included in the header
    fetch('http://peptabase-ixik.shuttle.app/v1/admin/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // Include authtoken in the request header
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
