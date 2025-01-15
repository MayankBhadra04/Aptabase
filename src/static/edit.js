document.addEventListener('DOMContentLoaded', function () {
    const editForm = document.getElementById('edit-form');
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    // Fetch existing data based on itemId and populate form fields
    // You need to fetch the existing data from the server using the itemId
    // and populate the form fields with the fetched data

    // For example:
    fetch(`https://peptabase-ixik.shuttle.app/v1/fetch/${itemId}`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Populate form fields with the fetched data
        document.getElementById('email').value = data.email;
        document.getElementById('aptamer').value = data.aptamer;
        document.getElementById('target').value = data.target;
        document.getElementById('apt_type').value = data.apt_type;
        document.getElementById('length').value = data.length;
        document.getElementById('sequence').value = data.sequence;
        document.getElementById('effect').value = data.effect;
        document.getElementById('reference').value = data.reference;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    // Handle form submission
    editForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Collect updated data from form
        const formData = new FormData(editForm);

        // Convert form data to JSON
        const updatedData = {};
        formData.forEach((value, key) => {
            updatedData[key] = value;
        });

        // Send updated data to the server
        fetch(`https://peptabase-ixik.shuttle.app/v1/update/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data updated successfully:', data);
            // Redirect to some page after successful update
            window.location.href = 'success.html';
        })
        .catch(error => {
            console.error('Error updating data:', error);
        });
    });
});
