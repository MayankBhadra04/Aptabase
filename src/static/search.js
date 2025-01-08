document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('search-form');
  const searchResults = document.getElementById('search-results');
  const keywordForm = document.getElementById('keyword-form');

  keywordForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get keyword input
    const keyword = document.getElementById('keyword').value.toLowerCase();
    fetch(`https://peptabase-ixik.shuttle.app/v1/fetch/${keyword}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log(response);
      return response.json();
    })
    .then(data => {
      searchResults.innerHTML = '';

      const table = document.createElement('table');
      table.classList.add('search-table');

      const headerRow = table.createTHead().insertRow();
      Object.keys(data[0]).forEach(key => {
        if (key !== 'id') { // Exclude 'id' from being displayed
          const headerCell = document.createElement('th');
          headerCell.textContent = key;
          headerRow.appendChild(headerCell);
        }
      });

      const tbody = table.createTBody();
      data.forEach(result => {
        const row = tbody.insertRow();
        Object.entries(result).forEach(([key, value]) => {
          if (key !== 'id') { // Exclude 'id' from being displayed
            const cell = row.insertCell();
            cell.textContent = value;
          }
        });
      });

      searchResults.appendChild(table);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });


  });

  

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const aptamerType = document.getElementById('m_AptamerType').value;
    const sortBy = document.getElementById('m_SortBy').value;
    const show = document.getElementById('m_Show').value;

    if (aptamerType === 'All') {
      fetch(`https://peptabase-ixik.shuttle.app/v1/fetch`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          searchResults.innerHTML = '';

          const table = document.createElement('table');
          table.classList.add('search-table');

          const headerRow = table.createTHead().insertRow();
          Object.keys(data[0]).forEach(key => {
            if (key !== 'id') { // Exclude 'id' from being displayed
              const headerCell = document.createElement('th');
              headerCell.textContent = key;
              headerRow.appendChild(headerCell);
            }
          });

          const tbody = table.createTBody();
          data.forEach(result => {
            const row = tbody.insertRow();
            Object.entries(result).forEach(([key, value]) => {
              if (key !== 'id') { // Exclude 'id' from being displayed
                const cell = row.insertCell();
                cell.textContent = value;
              }
            });
          });

          searchResults.appendChild(table);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    } else {
      const requestBody = {
        aptamer: '',
        target: '',
        apt_type: aptamerType !== 'All' ? aptamerType : '', // Check if aptamerType is not 'All'
        length: '',
        sequence: ''
      };
      console.log(JSON.stringify(requestBody));
      fetch('https://peptabase-ixik.shuttle.app/v1/fetchsingle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody) 
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        searchResults.innerHTML = '';

        const table = document.createElement('table');
        table.classList.add('search-table');

        const headerRow = table.createTHead().insertRow();
        Object.keys(data[0]).forEach(key => {
          if (key !== 'id') { // Exclude 'id' from being displayed
            const headerCell = document.createElement('th');
            headerCell.textContent = key;
            headerRow.appendChild(headerCell);
          }
        });

        const tbody = table.createTBody();
        data.forEach(result => {
          const row = tbody.insertRow();
          Object.entries(result).forEach(([key, value]) => {
            if (key !== 'id') { // Exclude 'id' from being displayed
              const cell = row.insertCell();
              cell.textContent = value;
            }
          });
        });

        searchResults.appendChild(table);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }
  });
});
