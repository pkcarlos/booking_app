// Implement the markup and JavaScript for booking a schedule. Be sure to check out the documentation on the requirements for a booking.

// In the event that the student who's booking the appointment isn't in the database, you must provide a way for the user to create the student, and then automatically proceed with the booking once the student is successfully created.

// Assume that only one schedule at a time can be booked.

// Email validation

// Provide new student details

document.addEventListener('DOMContentLoaded', () => {
  // get available schedules
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/schedules');
  xhr.responseType = 'json';
  xhr.send();

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
    console.log(option);
  }

  xhr.addEventListener('load', () => {
    let allSchedules = xhr.response;
    let availableSchedules = allSchedules.filter(sched => sched.student_email === null);

    availableSchedules.forEach(sched => {
      addOption(sched);
    })
  })


})