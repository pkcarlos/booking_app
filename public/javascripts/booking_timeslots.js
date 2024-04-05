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
  let bookingSequence;

  submitBookTimeslot.addEventListener('submit', e => {
    e.preventDefault();

    // try to book timeslot with id and student email
    // if success, great
    // if not, take book sequence from response, save to variable, and unhide form

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
      } else {
        bookingSequence = getBookingSequence();

        // unhide details form
        let form = document.getElementById('new_student');
        form.hidden = false;

        // auto-populate details form
        document.getElementById('add_email').value = emailInput;
        document.getElementById('sequence').value = bookingSequence;
      }
    })

    // // request all registered students
    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', '/api/students');
    // xhr.responseType = 'json';
    // xhr.send();

    // let emailInput = document.getElementById('email').value.trim();

    // xhr.addEventListener('load', () => {
    //   function bookTimeslot() {
    //     let select = document.getElementById('schedule');
    //     scheduleId = Number(select.value);
    //     studentEmail = emailInput;

    //     let xhr = new XMLHttpRequest();
    //     xhr.open('POST', '/api/bookings');
    //     xhr.setRequestHeader('Content-Type', 'application/json');
    //     let data = JSON.stringify({'id': scheduleId, 'student_email': studentEmail});
    //     xhr.send(data);

    //     xhr.addEventListener('load', () => {
    //       if (xhr.status === 204) {
    //         alert('Timeslot booked!');
    //       } else {
    //         alert('Error with booking timeslot. Please try again.');
    //       }
    //     })
    //   }

    //   let allStudents = xhr.response;
      
    //   if (allStudents.find(stud => stud.email === emailInput)) {
    //     bookTimeslot();
    //   } else {
    //     // unhide form
    //     let form = document.getElementById('new_student');
    //     form.hidden = false;

    //     // email auto-populate
    //     document.getElementById('add_email').value = emailInput;
    //   }
    // })
  })

  // add student to database with provided student details
    // get data (need email, name, booking_sequence)
      // get email ... user's email input
      // get name ... student name
        // request all students, find student name with email equal to email input
      // get booking sequence (part of payload in server response from first form if email doesn't exist for registered student)
    // send data to add student to database

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
    
    let data = configureStudentData();
    xhr.send(data);

    xhr.addEventListener('load', () => {
      alert('success!');
    })
  })
})