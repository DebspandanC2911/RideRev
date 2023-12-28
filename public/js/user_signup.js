const fileInput = document.getElementById('file');
const fileInfo = document.getElementById('file-info');
fileInput.addEventListener('change', (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        fileInfo.textContent = selectedFile.name;
    } else {
        fileInfo.textContent = 'No file chosen';
    }
});
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
function checkvalidation ()
{
    if (!validatePassword())
    {
        document.getElementById('error-span').textContent = "Password must be of 8 character with atleast one lowercase , uppercase , number";
        return false;
    }
    if (!validatePhoneNumber())
    {
        document.getElementById('error-span').textContent = "Phone number must compromise of 10 digits";
        return false;
    }
    if (document.getElementById('password').value != document.getElementById('cnf_password').value)
    {
        document.getElementById('error-span').textContent = "passwords and confirm passwords are not matching";
        return false;
    }
    return true;


}
document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    if (!checkvalidation()) return ;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phno = document.getElementById('phno').value;
    const name = document.getElementById('name').value;
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const aadharNumber = document.getElementById('aadhar').value;
    const address = document.getElementById('address').value;
    let aadharImage = document.getElementById('file');
    let aadharImageString;
    const file = aadharImage.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const base64String = e.target.result.split(',')[1];
            aadharImageString = base64String;
            const Signupdata = {
                name: name,
                email: email,
                password: password,
                phno: phno,
                dob: dob,
                gender: gender,
                aadharNumber: aadharNumber,
                address: address,
                imageencoding: aadharImageString,
            }
            const url = 'http://localhost:3000/sign_up'
            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Signupdata),
            }
            fetch(url, option)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        window.location.href='/login'
                    } else {
                        document.getElementById('error-span').textContent = data.message;
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });

        };
        reader.readAsDataURL(file);

    } else {
        document.getElementById('error-span').textContent = "please upload the file";
    }
});