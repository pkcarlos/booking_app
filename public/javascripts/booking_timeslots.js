// Implement the markup and JavaScript for booking a schedule. Be sure to check out the documentation on the requirements for a booking.

// In the event that the student who's booking the appointment isn't in the database, you must provide a way for the user to create the student, and then automatically proceed with the booking once the student is successfully created.

// Assume that only one schedule at a time can be booked.

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

  // request all schedules
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/schedules');
  xhr.responseType = 'json';
  xhr.send();

  // dropdown timeslot selection
  xhr.addEventListener('load', () => {
    let allSchedules = xhr.response;
    let availableSchedules = allSchedules.filter(sched => sched.student_email === null);

    availableSchedules.forEach(sched => {
      addOption(sched);
    })
  })

  // submitting timeslot form
  let submitBookTimeslot = document.getElementById('book_timeslot');

  submitBookTimeslot.addEventListener('submit', e => {
    e.preventDefault();

    // request all registered students
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/students');
    xhr.responseType = 'json';
    xhr.send();

    let emailInput = document.getElementById('email').value.trim();

    xhr.addEventListener('load', () => {
      function bookTimeslot() {
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
            alert('Timeslot booked!')
          } else {
            alert('Error with booking timeslot. Please try again.');
          }
        })
      }

      let allStudents = xhr.response;
      
      if (allStudents.find(stud => stud.email === emailInput)) {
        bookTimeslot();
      } else {
        // unhide form
        let form = document.getElementById('new_student');
        form.hidden = false;
      }
    })
  })

  // add student to database with provided student details
    // 
  // automatically book the timeslot

  let submitNewStudent = document.getElementById('new_student');

  submitNewStudent.addEventListener('submit', e => {
    e.preventDefault();


  })

})