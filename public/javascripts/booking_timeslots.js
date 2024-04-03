// Implement the markup and JavaScript for booking a schedule. Be sure to check out the documentation on the requirements for a booking.

// In the event that the student who's booking the appointment isn't in the database, you must provide a way for the user to create the student, and then automatically proceed with the booking once the student is successfully created.

// Assume that only one schedule at a time can be booked.

// Select schedulen from dropdown
  // populate SELECT A SCHEDULE with all available schedules in the following format: staff_name | date | time
  // get all available schedules
  // filter schedules with student_email of null
  // iterate through filtered schedules
    // create option for drop down in specified format
    // insert option as child of select element

// Email validation

// Provide new student details

document.addEventListener('DOMContentLoaded', () => {
  // get available schedules
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/schedules');
  xhr.responseType = 'json';
  xhr.send();

  function addOption() {
    let text = `${sched.staff_id} | ${sched.date} | ${sched.time}`;
    let value;
    let option = new Option(text);

    let select = document.querySelector('select').
  }

  xhr.addEventListener('load', () => {
    let allSchedules = xhr.response;
    let availableSchedules = allSchedules.filter(sched => sched.student_email === null);

    availableSchedules.forEach(sched => {
      // create and insert new option
      addOption();


    })
  })


})