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

//Shows the date to user
chrome.storage.local.get('currentDate', function getData(data) {
  let currentDate = data.currentDate;
  let dateLabel = document.getElementById('dateLabel');
  dateLabel.innerHTML = currentDate;
});

chrome.storage.local.get('toDoList', function getData(data) {
  toDoList = data.toDoList;
  for (let x = 0; x < 7; x++) {
    let button = document.createElement("button");
    button.innerHTML = toDoList[x].habit;
    button.id = x;
  
    if (toDoList[x].done) {
      button.style.background = green;
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

setTimeout(
  nightTask,
  moment("3:00:00", "hh:mm:ss").diff(moment(), 'seconds')
);

function nightTask() {
  
}

function getDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  return today;
}