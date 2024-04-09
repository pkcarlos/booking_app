const getJsonData = (url, param = '') => {
  if (param) {
    param = `/${param}`;
  }

  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url + param);
    xhr.responseType = 'json';

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 400) {
        resolve(xhr.response);
      } else {
        reject("Error with retrieving data.")
      }
    })

    xhr.send();
  })
}

const createListOfBookedDates = () => {
  return getJsonData('/api/bookings').then((dates) => {
    let unorderedList = document.createElement('ul');
    unorderedList.setAttribute('id', 'booked_dates');
    document.body.appendChild(unorderedList);

    dates.forEach(date => {
      let listItem = document.createElement('li');
      listItem.textContent = date;
      unorderedList.appendChild(listItem);
    })
  })
}

const addDetailsToBookedDates = () => {
  let bookedDates = document.querySelector('ul').children;

  for (i = 0; i < bookedDates.length; i ++) {
    let date = bookedDates[i];
    let unorderedList = document.createElement('ul');
    unorderedList.hidden = true;
    date.appendChild(unorderedList);

    getJsonData('/api/bookings', date.textContent).then((details) => {
      details = details.flat();
      let text = `${details[0]} | ${details[1]} | ${details[2]}`;
      let listItem = document.createElement('li');
      listItem.textContent = text;
      unorderedList.appendChild(listItem);
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  createListOfBookedDates().then(addDetailsToBookedDates);

  // when clicking on booked date, show booking details
  document.addEventListener('click', event => {
    if (event.target.tagName === 'LI') {
      event.target.children[0].hidden = false;
    }
  })
})
