let toDoList = [
  {'habit':'Brush', 'done':false},
  {'habit':'Pray', 'done':false},
  {'habit':'Bible', 'done':false},
  {'habit':'Eat', 'done':false},
  {'habit':'Exercise', 'done':false},
  {'habit':'Study', 'done':false},
  {'habit':'Sleep', 'done':false}
];
let green = 'rgb(50, 205, 50)';
let white = "#eee";
let storageArr;
let lastDate;

/* To avoid timing problems, this code should only once use "get": chrome.storage.local.get 
 * Any "sets" should called within this "get" (or called by functions within this "get"). 
 */
chrome.storage.local.get(['toDoList','storageArr','lastDate'], function getData(data) {

  createToDoList(data);
  fillStorage(data);

  let nowDate = new Date().getDate();
  lastDate = (data.lastDate) ? data.lastDate : storageArr[6][0].date;

  //Creates a new line for every different day, and missed days eg. offline for 48 hours = 2 empty days OR lost computer for a week = 7 empty days
  if (nowDate > lastDate) {
    for(let daysPassed = 0; daysPassed < nowDate - lastDate; daysPassed++){
      nightTask();
    }
  } else if (lastDate > nowDate){ // when dec 31 turns to jan 1
    let nowMonth = new Date().getMonth();
    //Days from last month (later on, +1 -1 can cancel)
    let totalTimePassed = daysInMonth(nowMonth-1) - lastDate + nowDate;
    
    for(let daysPassed = 0; daysPassed < totalTimePassed; daysPassed++){
      nightTask();
    }

  }


  //Update complete ~ all past data is up to date
  lastDate = nowDate;
  //fillStorage(data.storageArr);

  // Stores last date of when code ran
  chrome.storage.local.set(
    {'lastDate' : lastDate}
  );
});

// Set date
document.getElementById('dateLabel').innerHTML = getDate();

// Set version
version.innerHTML = `Version <a href="https://github.com/marko-polo-cheno/Habit-Tracker-Extension/releases" target="_blank" title="See release notes">${chrome.runtime.getManifest().version}</a>`;

function createToDoList(data) {
  toDoList = (data.toDoList) ? data.toDoList : toDoList;
  for (let x = 0; x < 7; x++) {
    let button = document.createElement("button");
    button.innerHTML = toDoList[x].habit;
    button.id = x;

    if (toDoList[x].done) {
      button.style.background = green;
    } else {
      button.style.background = white;
    }
    button.addEventListener("click", function useSettings() {
      if (document.getElementById(x).style.backgroundColor == green) {
        document.getElementById(x).style.background = white;
        toDoList[x].done = false;
      } else {
        document.getElementById(x).style.background = green;
        toDoList[x].done = true;
      }
      chrome.storage.local.set({'toDoList': toDoList});
    });

    var addButtonsHere = document.getElementById("add-buttons-here");
    addButtonsHere.appendChild(button);
  }
}

// Runs after user sleeps aka upon opening on a new day
function nightTask() {
  // Shift down
  for (let day = 0; day < 6; day++) {
    storageArr[day] = storageArr[day+1];
  }

  // Replace last day
  for (let habit = 0; habit < 7; habit++) {
    storageArr[6][habit].done = toDoList[habit].done;
  }

  // empty add-grid
  var addGrid = document.getElementById("add-grid");
  while (addGrid.firstChild) {
    addGrid.removeChild(addGrid.firstChild);
  }

  // fill add-grid
  for (let day = 5; day >= 0; day--) {
    for (let habit = 0; habit < 7; habit++) {
      let marker = document.createElement("button");
      marker.innerHTML = toDoList[habit].habit;
      if (storageArr[day][habit].done) {
        marker.style.background = green;
      } else {
        marker.style.background = white;
      }
      var addGrid = document.getElementById("add-grid");
      addGrid.appendChild(marker);
    }
    addGrid.appendChild(document.createElement('div'));
  }

  // Refresh
  for (let x = 0; x < 7; x++) {
    toDoList[x].done = false;
    document.getElementById(x).style.background = white;
  }
  
  // Stores
  chrome.storage.local.set(
    {'storageArr': storageArr, 'toDoList': toDoList}
  );
}

// Creates an array for storage
function fillStorage(data) {
    if (data.storageArr) {
      storageArr = data.storageArr;
    } else {
      storageArr = empty7by7();
    }
    
    // Creates a button grid displaying a weeks worth of tracking
    for (let day = 5; day >= 0; day--) {
      for (let habit = 0; habit < 7; habit++) {
        let marker = document.createElement("button");
        marker.innerHTML = toDoList[habit].habit;
        if (storageArr[day][habit].done) {
          marker.style.background = green;
        } else {
          marker.style.background = white;
        }
        marker.style.opacity = (day*0.1 + 0.5) + "";
        var addGrid = document.getElementById("add-grid");
        addGrid.appendChild(marker);
      }
      addGrid.appendChild(document.createElement('div'));
    }
}

// Gets the date from the computer
function getDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  return today;
}

function empty7by7(){
  let arr = [];
  let date = new Date().getDate();
  for (let day = 0; day < 7; day++) {
    arr[day] = []; // set up inner array
    for (let habit = 0; habit < 7; habit++) {
      addCell(arr,day,habit,date);
    }
  }
  return arr;
}

function addCell(arr, day, habit, date) {
  arr[day][habit] = {
    'done': false, // get this with: storageArr[day][habit].done
    'date': date // get this with: storageArr[day][habit].date
  };
}


function daysInMonth(num){
  //Changes computer nums into actual month nums
  num++;

  //Returns num of days in a month
  if (num==2){
    return 28;
  } else if (num<=7){
    return (num%2) ? 30 : 31;
  } else {
    return (num%2) ? 31 : 30;
  }
}