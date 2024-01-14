function validatePassword() {
  const password = document.getElementById('password').value;
  if (password.length < 8) {
      return false;
  }
  if (!/[a-z]/.test(password)) {
      return false;
  }
  if (!/[A-Z]/.test(password)) {
      return false;
  }
  if (!/\d/.test(password)) {
      return false;
  }
  return true;
}

function validatePhoneNumber() {
  const phno = document.getElementById('phno').value;
  const numericPhno = phno.replace(/\D/g, '');
  if (numericPhno.length !== 10) {
      return false;
  }
  return true;
}

function checkValidation() {
  if (!validatePassword()) {
      document.getElementById('error-span').textContent = "Password must be of 8 characters with at least one lowercase, uppercase, and number";
      return false;
  }
  if (!validatePhoneNumber()) {
      document.getElementById('error-span').textContent = "Phone number must comprise of 10 digits";
      return false;
  }
  if (document.getElementById('password').value !== document.getElementById('cnf_password').value) {
      document.getElementById('error-span').textContent = "Passwords and confirm passwords do not match";
      return false;
  }
  return true;
}

document.getElementById('form').addEventListener('submit', function (event) {
  event.preventDefault();
  if (!checkValidation()) return;

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const phno = document.getElementById('phno').value;
  const name = document.getElementById('name').value;
  const dob = document.getElementById('dob').value;
  const gender = document.getElementById('gender').value;
  const aadharNumber = document.getElementById('aadhar').value;
  const address = document.getElementById('address').value;

  const signupData = {
      name: name,
      email: email,
      password: password,
      phno: phno,
      dob: dob,
      gender: gender,
      aadharNumber: aadharNumber,
      address: address,
  };

  const url = 'http://localhost:3000/sign_up';
  const option = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
  };

  fetch(url, option)
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              window.location.href = '/login';
          } else {
              document.getElementById('error-span').textContent = data.message;
          }
      })
      .catch(error => {
          console.error('Fetch error:', error);
      });
});
