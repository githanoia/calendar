/*

this is a simple version built for learning.
it doesn't support adding events/todos, yet!
that'll be in the next version :]

Todo: ES5 => ES6.

Feel free to play with it!

*/


// DOM elements
var calendar = document.getElementById('calendar'), // table
    weekdays = document.getElementById('weekdays'), // table head
    days = document.getElementById('days'), // table body
    todayDate = document.getElementById('today-date'),
    monthLabel = document.getElementById('month-label'),
    yearLabel = document.getElementById('year-label'),
    nxtPrevDate = document.getElementById('nxt-prev-date'),
    nextBtn = document.getElementById('next'), // next month button
    prevBtn = document.getElementById('prev'), // previous month button
    monthBG = document.getElementById('background');

// Date info
var date = new Date(),
    month = date.getMonth(),
    year = date.getFullYear(),
    today = date.getDate(),
    day = date.getDay();

var currentMonth = month,
    currentYear = year,

    nextMonth,
    prevMonth,

    nextYear,
    prevYear;

// determine the number of days in February later.
// depending on whether the year is a leap or not
var monthNames = ["January","February","March","April","May","June","July","August","September","October","November", "December"],
    daysInMonth = ["31", "" ,"31","30","31","30","31","31","30","31","30","31"],
    dayNames = ["Sun","Mon","Tue","Wed","Thr","Fri", "Sat"],
    dayFullName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday", "Saturday"],

    monthLength,
    firstDay,
    lastDay,

    start,
    end;

var backgroundColors = [ '#A6D8BD', '#81d9cc','#a4edb4',
                         '#07E586', '#cbe967', '#ffcf3b',
                         '#FFB510', '#ff9100', '#FF8B3B',
                         '#e95130', '#FF4D43', '#d8ece9'];


// create today's date labels
todayDate.innerHTML = dayFullName[day] + ', ' +
                      today + ' ' + monthNames[currentMonth] + ' ' + currentYear;

// count days per month
var counter = 1;
// use it for creating next month days
var day = 1;

// create weekdays labels
for(var i = 0; i < 7; i++) {
  var th = document.createElement('th');
  var thData = document.createTextNode(dayNames[i]);
  th.appendChild(thData);
  weekdays.appendChild(th);
}

/*--------------------- THE MAIN FUNCTION ---------------------*/
function createCalendar() {
  // determine how many days in February
  isLeapYear();

  // change the background color based on the month
  changeBGColor(month);

  // create month and year labels for each month in each year
  var monthName = monthNames[month];
  currTableInfo(monthName, year);

  // how many days per month
  monthLength = daysInMonth[month];

  // get first and last day. returns 'day month date and time'
  firstDay = new Date(year, month, 1);
  lastDay = new Date(year, month, monthLength);


  // month start & end. returns a number. 0-6 (day from 'day month date and time')
  start = firstDay.getDay();
  end = lastDay.getDay();

  var row = document.createElement('tr');
  // create cells for days from the previous month
  // if current month doesn't start from sunday
  if(start !== 0) {
    // how many days in the previous month
    var prevMonthLng = daysInMonth[month - 1];
    // first, check if it's a new year, set month to '11'
    // which is the last one from the previous.
    if (month == 0) {
      prevMonthLng = daysInMonth[11]
    }
    var prevMonthDays = [];
    // from where the current month starts count down
    var countDown = start;
    while (countDown > 0) {
      // in a descending order, push days from the previous month
      prevMonthDays.push(prevMonthLng);
      prevMonthLng--;
      countDown--;
    }
    // reverse the days so it creates cells
    // starting from the smallest number in the array;
    prevMonthDays = prevMonthDays.reverse();

    for(var i = 0; i < start; i++) {
      var td = document.createElement('td');
      var data = document.createTextNode(prevMonthDays[i]);
      td.appendChild(data);
      td.id = 'prev-month-day';
      row.appendChild(td);
    }
  }


  // create days cells for the current month
  for(var i = start; i < 7; i++) {
      var td = document.createElement('td');
      var data = document.createTextNode(counter);

      td.appendChild(data);
      // check counter before incrementing
      // to not miss cell '1'. if it happens to be the current day
      highlightToday(td); // pass the cell to be able to append an id to it
      row.appendChild(td);
      counter++;
    }
  days.appendChild(row);
  createNewRow(); // keep creating rows
}

function createNewRow() {
  if(counter <= monthLength) {
    // keep creating cells
    var tr = document.createElement('tr');
    for(var i = 0; i < 7; i++) {
      var td = document.createElement('td');
      // check if counter is more than monthLength
      // if so, create cells for the next month
      if(counter > monthLength) {
        var data = document.createTextNode(day);
        td.appendChild(data);
        td.id = 'next-month-day';
        day++; // days from the next month

      } else { // if counter is less or equal to monthLength
       var data = document.createTextNode(counter);
      }

      td.appendChild(data);
      highlightToday(td);
      tr.appendChild(td);
      counter++;
    }
    days.appendChild(tr);
    createNewRow();
  }
}

/*--------------------- EVENT LISTENERS ---------------------*/
// show next month
nextBtn.addEventListener('click', function() {
  // reset current & next month counters
  counter = 1;
  day = 1;

  nextMonth = month + 1;
  month = nextMonth;

  // check if month is greater than 11 (0-11)
  // then start a new year
  if(month > 11) {
    nextYear = year + 1;
    year = nextYear;
    // reset month to '0', to start from January
    month = 0;
  }

  // remove the previous month cells
  days.innerHTML = '';
  // create the table
  createCalendar();
});

// show previous month
prevBtn.addEventListener('click', function() {
  // reset current & next month counters
  counter = 1;
  day = 1;

  prevMonth = month - 1;
  month = prevMonth;

  // check if month is less than 0
  // go to the previous year
  if(month < 0) {
    lastYear = year - 1;
    year = lastYear;
    // reset month to '11', so it starts from December
    month = 11;
  }

  // remove previous cells so it doesn't append new ones to the old
  days.innerHTML = '';
  // create the table
  createCalendar();
});




/*--------------------- FUNCTIONS ---------------------*/
function isLeapYear() {
  // check if the year is a leap year
  // if so, set February to 28 days, otherwise 29.
  if (month === 1) {
    if ( (year % 100 != 0 ) && (year % 4 == 0) || (year % 400 == 0) ) {
      daysInMonth[1] = 29;
    } else {
      daysInMonth[1] = 28;
    }
  }
}

function highlightToday(cell) {
  if (month === currentMonth && counter === today && year === currentYear) {
    cell.id = 'today';
  }
}

function changeBGColor(month) {
  var color = backgroundColors[month];
  monthBG.style.backgroundColor = color;
}

function currTableInfo(monthName, year) {
  monthLabel.innerHTML = monthNames[month];
  yearLabel.innerHTML = year;
}



// The starting point.
createCalendar();
