function cancelSchedule(scheduleId) {
  let xhr = new XMLHttpRequest();
  xhr.open('DELETE', `/api/bookings/${scheduleId}`);

  xhr.addEventListener('load', () => {
    if (xhr.status === 204) {
      alert('Schedule cancelled successfully.');
    } else {
      alert(xhr.statusText);
    }
  })

  xhr.send();
}

function cancelBooking(bookingId) {
  let xhr = new XMLHttpRequest();
  xhr.open('PUT', `/api/bookings/${bookingId}`);

  xhr.addEventListener('load', () => {
    if (xhr.status === 204) {
      alert('Booking cancelled successfully.');
    } else {
      alert(xhr.statusText);
    }
  })

  xhr.send();
}
