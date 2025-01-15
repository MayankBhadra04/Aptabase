
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("my-form");

      form.addEventListener('submit', function(event) {
          event.preventDefault(); // Prevent the default form submission behavior
          // Get form data
          const formData = {
              email: document.getElementById("username").value,
              password: document.getElementById("password").value,
          };

          // Make the API call
          try {
            fetch('https://peptabase-ixik.shuttle.app/v1/auth/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
          })
              .then(response => {
                  if(response.status === 200){
                      console.log(response);``
                      const token = response.headers.get('token');
                      console.log(token);
                      localStorage.setItem('authtoken', token);
                      window.open("redirect_links.html", "_blank")
                  } else {
                      window.alert("Wrong credentials")
                  }
              });
          } catch (error) {
            console.log(error);
            window.alert("Wrong credentials")
          }
          
      });
});