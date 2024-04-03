document.addEventListener('DOMContentLoaded', () => {
  // request staff members
  let staff;

  let request = new XMLHttpRequest();
  request.open('GET', '/api/staff_members');
  request.responseType = 'json';
  request.send();

  // add options to staff dropdown
  request.addEventListener('load', () => {
    staff = request.response;

    staff.forEach(member => {
      let select = document.querySelector('select');
      let option = document.createElement('option');

      option.value = member.id;
      option.textContent = member.name;
      select.appendChild(option);
    })
  })

  // insert copy of form element after last form element in document
  function addFormCopy() {
    let form = document.querySelector('form');
    let formDeepCopy = form.cloneNode(true);
    let legend = formDeepCopy.querySelector('legend');
    let staffInput = formDeepCopy['staff_name'];
    let dateInput = formDeepCopy['date'];
    let timeInput = formDeepCopy['time'];
    let formCount = document.querySelectorAll('form').length;
    let submitDivIdx = document.body.children.length - 2;
    let submitDiv = document.body.children[submitDivIdx];

    legend.textContent = `Schedule ${formCount + 1}`;
    staffInput.id = `staff_name${formCount + 1}`;
    dateInput.id = `date${formCount + 1}`;
    timeInput.id = `time${formCount + 1}`;

    document.body.insertBefore(formDeepCopy, submitDiv);
  }

  // add new form when clicking Add Another Schedule
  document.getElementById('add').addEventListener('click', event => {
    event.preventDefault();
    addFormCopy();
  })

  // send form data to server on clicking Submit button

  function serializeFormInputs() {
    let forms = document.querySelectorAll('form');
    let schedules = [];
    
    for (i = 0; i < forms.length; i ++) {
      let form = forms[i];
      let data = new FormData(form);
      let obj = {};

      for (let entry of data.entries()) {
        let [key, value] = [entry[0], entry[1]];
        
        if (key === 'staff_id') {
          value = Number(entry[1]);
        }

        obj[key] = value;
      }

      schedules.push(obj)
    }

    return { "schedules": schedules };
  }
  
  document.getElementById('submit').addEventListener('click', event => {
    event.preventDefault();
    
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/schedules');
    xhr.setRequestHeader('Content-Type', 'application/json');
    let data = JSON.stringify(serializeFormInputs());

    xhr.addEventListener('load', () => {
      if (xhr.status === 201) {
        alert('Form submitted.');
      } else {
        alert('Error with form submission.')
      }
    })

    xhr.send(data);
  })
})