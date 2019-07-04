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
fillStorage();

// Set date
document.getElementById('dateLabel').innerHTML = getDate();

// Set version
version.innerHTML = `Version <a href="https://github.com/marko-polo-cheno/Habit-Tracker-Extension/releases" target="_blank" title="See release notes">${chrome.runtime.getManifest().version}</a>`;

chrome.storage.local.get('toDoList', function getData(data) {
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
});



// Runs after user sleeps
function nightTask() {
  // Shift down
  for (let day = 0; day < 6; day++) {
    storageArr[day] = storageArr[day+1];
  }

  // Replace last day
  for (let done = 0; done < 7; done++) {
    storageArr[6][done] = toDoList[done].done;
  }

  // empty add-grid
  var addGrid = document.getElementById("add-grid");
  while (addGrid.firstChild) {
    addGrid.removeChild(addGrid.firstChild);
  }

  // fill add-grid
  for (let day = 5; day >= 0; day--) {
    for (let done = 0; done < 7; done++) {
      let marker = document.createElement("button");
      marker.innerHTML = toDoList[done].habit;
      if (storageArr[day][done]) {
        marker.style.background = green;
      } else {
        marker.style.background = white;
      }
      var addGrid = document.getElementById("add-grid");
      addGrid.appendChild(marker);
    }
  }

  // Refresh
  for (let x = 0; x<7; x++) {
    toDoList[x].done = false;
    document.getElementById(x).style.background = white;
  }
  
  // Stores
  chrome.storage.local.set(
    {'storageArr': storageArr, 'toDoList': toDoList, 'lastDate' : lastDate}
  );
}

// Creates an array for storage
function fillStorage() {
  chrome.storage.local.get('storageArr', function getData(data){

    if (data.storageArr) {
      storageArr = data.storageArr;
    } else {
      let arr = [];
      for (let day = 0; day < 7; day++) {
        arr[day] = []; // set up inner array
        for (let done = 0; done < 7; done++) {
          addCell(arr,day,done);
        }
      }
      storageArr = arr;
    }
    
    // Creates a button grid displaying a weeks worth of tracking
    for (let day = 5; day >= 0; day--) {
      for (let done = 0; done < 7; done++) {
        let marker = document.createElement("button");
        marker.innerHTML = toDoList[done].habit;
        if (storageArr[day][done]) {
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

  });
}

function addCell(arr, day, done) {
  arr[day][done] = false;
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

var now = new Date();
var timeDiff = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 0, 0, 0) - now;
if (timeDiff < 0) {
  timeDiff += 86400000; // 24 hours later
}
setTimeout(nightTask, timeDiff); // setInterval did weird stuff, just use setTimeout
// setTimeout(nightTask, 5000); // for testing