document.addEventListener('DOMContentLoaded', function () {
  const tableBody = document.getElementById('table-body');
  const authToken = localStorage.getItem('authtoken');

  // Redirect to admin login page if auth token is not present
  if (!authToken) {
      window.location.href = '/static/admin.html';
  } else {
      fetchAndPopulateData(); // Call function to fetch and populate data
  }

  function fetchAndPopulateData() {
      const authToken = localStorage.getItem('authtoken');
      fetch(`https://peptabase-ixik.shuttle.app/v1/adminfetch/fetchadmin`, {
          headers: {
              'Authorization': `Bearer ${authToken}`
          }
      })
      .then(response => {
          console.log(response);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          tableBody.innerHTML = ''; // Clear existing table rows

          // Populate table with fetched data
          // Inside the fetchAndPopulateData function



// Populate table with fetched data


                    data.forEach(item => {
                        const newRow = document.createElement('tr');
                        newRow.innerHTML = `
                            <td>${item.aptamer}</td>
                            <td>${item.target}</td>
                            <td>${item.apt_type}</td>
                            <td>${item.length}</td>
                            <td>${item.sequence}</td>
                            <td>
                                <button class="reject-btn" onclick="handleDelete('${item.id}')">Delete</button>
                            </td>
                            <td>
                                <button class="edit-btn" onclick="handleEdit('${item.id}')">Edit</button>
                            </td>
                        `;
                        newRow.querySelector('.reject-btn').addEventListener('click', () => handleAction(item.id));
                        tableBody.appendChild(newRow);
                        newRow.querySelector('.edit-btn').addEventListener('click', () => handleEdit(item.id));
                        
                      
                    });

                    // Function to handle edit button click
                   
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
  }

  // Function to handle action button click
  function handleAction(itemId) {
      fetch(`https://peptabase-ixik.shuttle.app/v1/admin/delete/${itemId}`, { // Fixed typo here from delele to delete
          method: 'DELETE'
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log(data); // Handle response data if needed
      })
      .catch(error => {
          console.error('Error performing action:', error);
      });
  }
    function handleEdit(itemId) {
        window.location.href = `/static/edit.html/${itemId}`;
    }

});
