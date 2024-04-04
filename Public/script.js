document.addEventListener('DOMContentLoaded', function () {
  const materialForm = document.getElementById('materialForm');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const materialTable = document.getElementById('materialTable');

  // Event listener for form submission
  materialForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const formData = new FormData(materialForm);

      const materialData = {
          name: formData.get('name'),
          quantity: formData.get('quantity'),
          note: formData.get('note'),
          entryName: formData.get('entryName'),
          entryDate: formData.get('entryDate')
      };

      addMaterial(materialData);
  });

  // Event listener for the search button
  searchButton.addEventListener('click', function () {
    if (searchInput) {
      const searchText = searchInput.value.toLowerCase();

      // Fetch materials data from the server
      fetch('/materials')
          .then(response => response.json())
          .then(data => {
              const filteredData = data.filter(material =>
                  material.name.toLowerCase().includes(searchText) ||
                  material.note.toLowerCase().includes(searchText) ||
                  material.entryName.toLowerCase().includes(searchText) ||
                  material.entryDate.includes(searchText)
              );

              displayMaterials(filteredData);
          })
          .catch(error => {
            console.error('Error fetching materials:', error);
            console.log('Error object:', error); // Log the error object
            
          });
  }}
  );

  // Function to add material
  function addMaterial(materialData) {
      console.log('Sending request to add material:', materialData);

      fetch('/materials', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(materialData)
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Failed to add material');
              }
              return response.json(); // Parse response body as JSON
          })
          .then(data => {
              console.log('Material added successfully');
              // Clear the form after adding material
              materialForm.reset();
              // Reload materials table
              searchButton.click();
              // Show success message
              showMessage('Material added successfully', 'success');
          })
          .catch(error => {
            console.error('Error adding material:', error);
              // Show error message
              showMessage('Failed to add material. Please try again.', 'error');
          });
  }

  // Function to show message
  function showMessage(message, type) {
      const messageElement = document.createElement('div');
      messageElement.textContent = message;
      messageElement.classList.add('message', type);
      document.body.appendChild(messageElement);

      // Remove the message after 3 seconds
      setTimeout(() => {
          messageElement.remove();
      }, 3000);
  }

  // Function to display materials in a table
  function displayMaterials(materials) {
      let tableHTML = '<table>';
      tableHTML += '<tr><th>Name</th><th>Quantity</th><th>Note</th><th>Name of Entry</th><th>Date of Entry</th></tr>';

      materials.forEach(material => {
          tableHTML += `<tr><td>${material.name}</td><td>${material.quantity}</td><td>${material.note}</td><td>${material.entryName}</td><td>${material.entryDate}</td></tr>`;
      });

      tableHTML += '</table>';
      materialTable.innerHTML = tableHTML;
  }
});
