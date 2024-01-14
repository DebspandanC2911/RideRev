const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i => {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');
searchButton.addEventListener('click', function (e) {
	if (window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if (searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})

if (window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if (window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}

window.addEventListener('resize', function () {
	if (this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})
const switchMode = document.getElementById('switch-mode');
switchMode.addEventListener('change', function () {
	if (this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

document.getElementById('update-btn').addEventListener('click', function(event) {
    event.preventDefault();
    const dobinput = document.getElementById('dob')
    const phnum = document.getElementById('number')
    const name = document.getElementById('name')
    const image = document.getElementById('image')
    dobinput.hidden = !dobinput.hidden
    phnum.hidden = !phnum.hidden
    name.hidden = !name.hidden
    image.hidden = !image.hidden
    const updtbtn = document.getElementById('update-btn');
    if (updtbtn.textContent == 'Update')
    {
        updtbtn.textContent = 'Save'
        updtbtn.style.backgroundColor ='green'
    }
    else
    {
        const file = image.files[0]
        updtbtn.textContent = 'Update'
        updtbtn.style.backgroundColor ='blue'
        const newUserData = new FormData()
        newUserData.append('name', name.value)
        newUserData.append('phnum' , phnum.value)
        newUserData.append('dob', dobinput.value)
        newUserData.append('image', file)
        const url='http://localhost:3000/updateuserprofile'
        fetch(url, {
            method: 'POST',
            body: newUserData,
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.success === true) {
                    window.location.href='/userProfile'
                }
                else {
                    document.getElementById('error-text').textContent = data.message;
                }
            })
            .then(error => {
                console.log(error);
            })
        
    }
})