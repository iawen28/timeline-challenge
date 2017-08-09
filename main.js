(function(){

const topRow = document.getElementById('top'),
      bottomRow = document.getElementById('bottom');

let awayEvents = [],
    homeEvents = [],
    idNumber = 1,
    totalTime;

function init(lengthOfPeriodInSeconds) {
  totalTime = lengthOfPeriodInSeconds;
  setTimeout(moveEls, 0);
}

function addAction(timeInSeconds, team) {
  const marker = document.createElement('DIV');
  if (team.toUpperCase() === 'AWAY') {
    // away red dot marker
    const id = 'away' + parseInt(timeInSeconds) + '-' + idNumber;
    idNumber++;
    marker.id = id;
    marker.className = 'awayEvent';
    bottomRow.appendChild(marker);
    saveVals(awayEvents, id, timeInSeconds);
  } else if (team.toUpperCase() === 'HOME') {
    // home teal dot marker
    const id = 'home' + parseInt(timeInSeconds) + '-' + idNumber;
    idNumber++;
    marker.id = id;
    marker.className = 'homeEvent';
    topRow.appendChild(marker);
    saveVals(homeEvents, id, timeInSeconds);
  } else {
    return 'Invalid input';
  }
}

window.init = init
window.addAction = addAction;

function saveVals(arr, id, time) {
  // saves home/away event information in ordered arrays
  if (arr[0] === undefined || arr[arr.length-1][1] <= time) {
    arr.push([id, time]);
  } else if (time <= arr[0][1]) {
    arr.unshift([id, time]);
  } else {
    arr.push([id, time]);
    for (let i = arr.length - 1; i > 0; i--) {
      if (arr[i-1][1] > arr[i][1]) {
        const temp = arr[i - 1];
        arr[i - 1] = arr[i];
        arr[i] = temp;
      }
    }
  }
}

function positionEvents(eventArr, w, team, row) {
  let posArr = [];

  for (let i = 0; i < eventArr.length; i++) {
    const el = document.getElementById(eventArr[i][0]);
    const time = eventArr[i][1];
    const pos = ((w * time)/totalTime);
    posArr.push([eventArr[i][0], pos]);
    el.style.marginLeft = pos + 'px';
    el.style.opacity = 1;
  }
  handleOverlap(posArr, w, team, row);
}

function handleOverlap(arr, w, team, row) {
  let count = 1,
      posSum = 0,
      leng = arr.length,
      i = 0,
      grouping = false;

  const markerWidth = 11;
  while (i < leng) {
    while (arr[i+1] && (arr[i][1] + markerWidth > arr[i+1][1])) {
      const el = document.getElementById(arr[i][0]);
      el.style.opacity = 0;
      count++;
      posSum += arr[i][1];
      grouping = true;
      i++;
    }
    if (grouping) {
      const el = document.getElementById(arr[i][0]);
      el.style.opacity = 0;
      posSum += arr[i][1];
      const group = document.createElement('DIV');
      group.className = team + 'EventGroup';
      group.innerHTML = count;
      row.append(group);
      group.style.marginLeft = Math.min((posSum/count), (w - 3)) + 'px';
      count = 1;
      posSum = 0;
      grouping = false;
    } 
    i++;
  }
}

window.addEventListener('resize', debounce());

function debounce() {
  let timeout;
  return function() {
    const moveLater = function() {
      timeout = null;
      moveEls();
    };
    clearTimeout(timeout);
    timeout = setTimeout(moveLater, 75);
  };
}

function moveEls() {
  const relements = document.getElementsByClassName('awayEventGroup');
  while (relements.length > 0) {
    relements[0].parentNode.removeChild(relements[0]);
  }
  const telements = document.getElementsByClassName('homeEventGroup');
  while (telements.length > 0) {
    telements[0].parentNode.removeChild(telements[0]);
  }
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth) - 25;
  positionEvents(awayEvents, width, 'away', bottomRow);
  positionEvents(homeEvents, width, 'home', topRow);
}

})();

// init(100);
// addAction(21, 'HOME');
// addAction(98, 'HOME');
// addAction(100, 'HOME');
// addAction(13, 'AWAY');
// addAction(16, 'AWAY');
// addAction(19, 'AWAY');
// addAction(22, 'AWAY');
// addAction(25, 'AWAY');
// addAction(28, 'AWAY');