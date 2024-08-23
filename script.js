/*jshint esversion: 6 */
(function() {

var names = [];
var groupSize = 2;
var layout = window.localStorage.getItem('layout');

function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  return result;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getAllGrids(item) {
  return [grid1, grid2, grid3, grid4, grid5, grid6,
      grid7, grid8, grid9, grid10, grid11, grid12];
}


  var counter = 0;

  // Init grids


  var grid1 = new Muuri('.grid-1', {
    items: '.item',
    dragEnabled: true,
    dragContainer: document.body,
    dragSort: getAllGrids
  });

  var grid2 = new Muuri('.grid-2', {
    items: '.item',
    dragEnabled: true,
    dragContainer: document.body,
    dragSort: getAllGrids
  });
  var grid3 = new Muuri('.grid-3', {
    items: '.item',
    dragEnabled: true,
    dragContainer: document.body,
    dragSort: getAllGrids
  });
  var grid4 = new Muuri('.grid-4', {
    items: '.item',
    dragEnabled: true,
    dragContainer: document.body,
    dragSort: getAllGrids
  });
  var grid5 = new Muuri('.grid-5', {
    items: '.item',
    dragEnabled: true,
    dragContainer: document.body,
    dragSort: getAllGrids
  });
  var grid6 = new Muuri('.grid-6', {
    items: '.item',
    dragEnabled: true,
    dragContainer: document.body,
    dragSort: getAllGrids
  });

  var grid7 = new Muuri('.grid-7', {
    items: '.item',
    dragEnabled: true,
    dragContainer: document.body,
    dragSort: getAllGrids
  });

  var grid8 = new Muuri('.grid-8', {
    items: '.item',
    dragEnabled: true,
    dragContainer: document.body,
    dragSort: getAllGrids
  });
  var grid9 = new Muuri('.grid-9', {
    items: '.item',
    dragEnabled: true,
    dragContainer: document.body,
    dragSort: getAllGrids
  });
  var grid10 = new Muuri('.grid-10', {
    items: '.item',
    dragEnabled: true,
    dragContainer: document.body,
    dragSort: getAllGrids
  });
  var grid11 = new Muuri('.grid-11', {
    items: '.item',
    dragEnabled: true,
    dragContainer: document.body,
    dragSort: getAllGrids
  });
  var grid12 = new Muuri('.grid-12', {
    items: '.item',
    dragEnabled: true,
    dragContainer: document.body,
    dragSort: getAllGrids
  });
  var grids = getAllGrids("hi");

  // Init actions

  var grid1ClearButton = document.querySelector('.clear');
  var grid1RandomizeButton = document.querySelector('.randomize');
  var selectFile = document.getElementById('classfile');
  getNewListOfNames(selectFile); // to get the default
  var storeGrouping = document.querySelector('.store');
  var loadGrouping = document.querySelector('.load');
  var coldCallButton = document.querySelector('.coldcall');

  grid1ClearButton.addEventListener('click', function() {
    clearItemsAllGrids(grids);
  });

  grid1RandomizeButton.addEventListener('click', function() {
    randomizeItems(getAllGrids());
  });

  selectFile.addEventListener('change', function() {
    let fname = this.value;
    names = loadFile(fname).split('\n');
  });

  storeGrouping.addEventListener('click', function() {
    saveCurrentLayout(grids);
  });

  coldCallButton.addEventListener('click', function() {
    coldCall(grids);
  })

  loadGrouping.addEventListener('click', function() {
    var pickFile = document.createElement('input');
    pickFile.type = 'file';
    pickFile.onchange = e => {
       var file = e.target.files[0];
       var reader = new FileReader();
       reader.readAsText(file,'UTF-8');
       reader.onload = readerEvent => {
          var content = readerEvent.target.result; // this is the content!
          var loadedGrouping = JSON.parse(content);
          loadedGrouping.forEach( (team, index) => {
              team.forEach( (name) => {
                  addItemToGrid(grids[index], name);
              });
          });
       };
    };
    pickFile.click();
  });

  // Utils
  function getNewListOfNames(event) {
    let fname = event.value;
    names = loadFile(fname).split('\n');
  }

  function createItemElement(id, title, width, height) {
    var el = document.createElement('div');
    var classNames = 'item h' + height + ' w' + width;
    el.innerHTML = '<div class="' + classNames + '" data-id="' + id + '">' +
                     '<div class="item-content">' + title + '</div>' +
                   '</div>';
    return el.firstChild;
  }

  function clearItemsAllGrids(grids) {
    grids.forEach( (grid) => {
      grid.remove(grid.items, {removeElements: true});
    });
  }

  function addItemToGrid(grid, name) {
    var elements = createItem(name);
    elements.forEach(function(el) {
      el.style.display = 'none';
    });
    grid.add(elements);
    grid.show(elements);
  }

  function createItem(name) {
    var ret = [];
    for (var i = 0; i < 1; i++) {
      var id = ++counter;
      var title = name;
      var width = 12;
      var height = 1;
      ret.push(createItemElement(id, title, width, height));
    }
    return ret;
  }

  function randomizeItems(grids) {
    groupSize = parseInt(document.getElementById('teamsize').value);
    shuffleArray(names);
    let gridToInsertInto = 0;
    let howManyInGroup = 0;
    names.forEach( (name, index) => {
      addItemToGrid(grids[gridToInsertInto], name);
      ++howManyInGroup;
      if (howManyInGroup === groupSize) {
        let gr = grids[gridToInsertInto];
        var items = gr.getItems();
        items.length = groupSize;
        ++gridToInsertInto;
        howManyInGroup = 0;
      }
    });
  }

  function saveCurrentLayout(grids) {
    let teams = [];
    grids.forEach( (grid) => {
      teams.push([]);
      grid.getItems().forEach( (oneTeam, index) => {
        teams[teams.length - 1].push(oneTeam._element.innerText);
      });
    });
    let fname = document.getElementById('classfile').value;
    let today = new Date(Date.now()).toLocaleString();
    download(JSON.stringify(teams), "groups-".concat(today, '-', fname), 'text/plain');
  }

  function download(content, fileName, contentType) {
      var a = document.createElement("a");
      var file = new Blob([content], {type: contentType});
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
  }
  function coldCall(grids) {
    console.log(grids);
    const nameElements = Array.from(document.querySelectorAll('.item-content'));

    const randomIndex = Math.floor(Math.random() * nameElements.length);
    const selectedStudent = nameElements[randomIndex];
    // Step 3: Change the style of the selected student's display name
    //const studentElement = document.getElementById(selectedStudent.id);
    selectedStudent.style.fontSize = '4em';
    selectedStudent.style.color = 'red';

    // Step 4: Optionally, reset the style after a certain period (e.g., 5 seconds)
    setTimeout(() => {
      selectedStudent.style.fontSize = '';
      selectedStudent.style.color = '';
    }, 5000);
  }

})();
