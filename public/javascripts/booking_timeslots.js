document.addEventListener('DOMContentLoaded', () => {
  function changeStaffIdToName(schedule, option) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/staff_members');
    xhr.responseType = 'json';
    xhr.send();

    let [staffId, date, time] = [schedule.staff_id, schedule.date, schedule.time];

    xhr.addEventListener('load', () => {
      let staff = xhr.response;
      let staffMember = staff.find(member => member.id === Number(staffId));
      option.textContent = `${staffMember.name} | ${date} | ${time}`;
    })
  }

  function addOption(sched) {
    let text = '';
    let value = sched.id;
    let option = new Option(text, value);
    let select = document.querySelector('select');

    changeStaffIdToName(sched, option);
    select.appendChild(option);
  }

  // create timeslot dropdown
  function populateScheduleDropdown() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/schedules');
    xhr.responseType = 'json';
    xhr.send();
  
    xhr.addEventListener('load', () => {
      let allSchedules = xhr.response;
      let availableSchedules = allSchedules.filter(sched => sched.student_email === null);
  
      availableSchedules.forEach(sched => {
        addOption(sched);
      })
    })
  }

  populateScheduleDropdown();

  // book timeslot
  let submitBookTimeslot = document.getElementById('book_timeslot');

  submitBookTimeslot.addEventListener('submit', e => {
    e.preventDefault();

    function getBookingSequence() {
      const regex = /\d+/g;
      let response = xhr.response;
      return response.match(regex).join('');
    }

    let emailInput = document.getElementById('email').value.trim();
    let select = document.getElementById('schedule');
    scheduleId = Number(select.value);
    studentEmail = emailInput;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/bookings');
    xhr.setRequestHeader('Content-Type', 'application/json');
    let data = JSON.stringify({'id': scheduleId, 'student_email': studentEmail});
    xhr.send(data); 

    xhr.addEventListener('load', () => {
      if (xhr.status === 204) {
        alert('Timeslot booked!');
        window.location.reload();
      } else {
        alert(`${xhr.responseText}`);
        let bookingSequence = getBookingSequence();

        // unhide details form
        let form = document.getElementById('new_student');
        form.hidden = false;

        // auto-populate details form
        document.getElementById('add_email').value = emailInput;
        document.getElementById('sequence').value = bookingSequence;
      }
    })
  })

  // automatically book the timeslot on submit
  let submitNewStudent = document.getElementById('new_student');

  submitNewStudent.addEventListener('submit', e => {
    e.preventDefault();

    function configureStudentData() {
      let email = document.getElementById('add_email').value;
      let name = document.getElementById('name').value;
      let bookingSeq = document.getElementById('sequence').value;
      return { "email": email, "name": name, "booking_sequence": bookingSeq };
    }

    // add student to database
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/students');
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    let data = JSON.stringify(configureStudentData());
    xhr.send(data);

    xhr.addEventListener('load', () => {
      if (xhr.status === 201) {
        alert(xhr.responseText);

        // if adding student successful, book timeslot
        let emailInput = document.getElementById('email').value.trim();
        let select = document.getElementById('schedule');
        scheduleId = Number(select.value);
        studentEmail = emailInput;

        let request = new XMLHttpRequest();
        request.open('POST', '/api/bookings');
        request.setRequestHeader('Content-Type', 'application/json');
        let data = JSON.stringify({'id': scheduleId, 'student_email': studentEmail});
        request.send(data);

        request.addEventListener('load', () => {
          if (request.status === 204) {
            alert('Booked!');
            window.location.reload();
          } else {
            alert(request.responseText);
          }
        })
      } else {
        alert(xhr.responseText);
      }
    })
  })
})