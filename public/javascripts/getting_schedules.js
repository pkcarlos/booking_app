/*
Implement a function that retrieves all the schedules that are available. If one or more schedules are available, tally the count of schedules for each staff and alert the user of result as "key: value" pairs with the staff id as key (in the format of 'staff {id}'; e.g, 'staff 1') and the count of schedules as the value. If there are no schedules, alert the user that there are currently no schedules available for booking.

D/A:
- send request for all available schedules
- isolate schedules where student email is null, save to `availableSched`
- if count of available schedules > 0
  - map available schedules to string with staff id and corresponding count of available schedules
  - join mapped arr with newline; alert
- else alert that there are currently no schedules avaialable for booking

When implementing the function, keep in mind that the server has been known to slow down when there are more than 7 schedules to retrieve. It doesn't always happen, but be sure to handle it accordingly. Once 5 seconds have passed, cancel the retrieval and inform the user to try again.

Finally, inform the user about the completion of the request regardless of the success or failure (timeout) of the request.
*/


function retrieveAllSchedules() {
  let request = new XMLHttpRequest();
  request.timeout = 5000;
  request.ontimeout = function() {
    alert("Request timed out. Please try again.")
  }

  request.open('GET', 'http://localhost:3000/api/schedules');
  request.responseType = 'json';

  request.addEventListener('load', event => {
    let schedules = request.response;
    let availableSched = schedules.filter(sched => sched.student_email === null);

    if (availableSched.length > 0) {
      let available = availableSched.map(schedule => {
        let staffId = schedule.staff_id;
        let availableCount = availableSched.filter(sched => sched.staff_id === staffId).length;
        return `staff ${staffId}: ${availableCount}`;
      })

      available = [...new Set(available)];
      alert(available.join('\n'));
    } else {
      alert('There are currently no available schedules for booking.')
    }

    alert('Request completed.');
  })

  request.send();
}
