document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();

    validateAndSubmit();
  });
});

function validateAndSubmit() {
  var fullName = document.getElementById('fullName').value;
  var email = document.getElementById('email').value;
  var phone = document.getElementById('phone').value;
  var position = document.getElementById('position').value;

  saveUserData({ fullName, email, phone, position });
}

function saveUserData(userData) {
  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 400) {
          return response.text().then((data) => {
            throw new Error(data);
          });
        } else {
          throw new Error('Failed to register user. Please try again.');
        }
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      alert('Registration successful!');
    })
    .catch((error) => {
      console.error('Error:', error);
      alert(error.message);
    });
}
