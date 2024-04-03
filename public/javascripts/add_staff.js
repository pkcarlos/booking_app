// Implement a form for adding new staff, and then use the booking app API to add the staff to the database. Your implementation should handle the different possible responses of the server and inform the user of the outcome.

// when user clicks submit in form, if form inputs are valid, form data is sent to server
  // serialize form data
  // send to server
  // alert that new staff added successfully

function validName(name) {
  let regex = /^[a-zA-Z' -]+$/;
  name = name.trim();
  return regex.test(name) && name !== '';
}

function validEmail(email) {
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  email = email.trim();
  return regex.test(email) && email !== '';
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', event => {
    event.preventDefault();

    let data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');

    if (validName(name) && validEmail(email)) {
      let request = new XMLHttpRequest();
      request.open(form.method, form.action);

      request.addEventListener('load', () => {
        let response = JSON.parse(request.response);
        if (request.status === 201) {
          let staffId = response.id;
          alert(`Staff with id ${staffId} successfully created.`);
        } else if (request.status === 400) {
          alert(response);
        }
      })

      request.send(data);
    } else {
      alert("Staff cannot be created. Check inputs.")
    }
  })
})