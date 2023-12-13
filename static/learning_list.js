var ratings=[];
var fileName;
var fileContent;
var nextText;
var selectedRating;
var last_rating;
function myTrim(x) {
  return x.replace(/^\s+|\s+$/gm,'');
}

function setCookie(name,value,daysToExpire){
  var expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysToExpire);
  var cookieValue = Array.isArray(value) ? JSON.stringify(value) : encodeURIComponent(value);
  cookieValue += "; expires=" + expirationDate.toUTCString();
  document.cookie=name+'='+cookieValue;
}

function getCookie(name){
  var cookie=document.cookie;
  var arrCookie=cookie.split(';');
  var key='';
  for(var i=0;i<arrCookie.length;i++){
    key=arrCookie[i].split('=');
    if(myTrim(key[0])==myTrim(name)){
      return name === 'ratings' ? JSON.parse(key[1]) : key[1];
    }
  }
}

var round = 1; // initial round
//url parameters
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('user'); //username
const category = urlParams.get('category');//category
if(urlParams.get('round')){
  round = urlParams.get('round');//round
}


window.addEventListener("DOMContentLoaded", (event) => {
    const filePaths = [
      './sentence/Academic Research Scenarios - Essay Writing.json',
      './sentence/Academic Research Scenarios - Learning Experience Communication.json',
      './sentence/Accommodation Scenarios - Furniture and Appliances.json',
      './sentence/Accommodation Scenarios - Room.json',
      './sentence/Banking Service Scenarios - Accounts.json',
      './sentence/Banking Service Scenarios - Finance.json',
      './sentence/Extracurricular Scenarios - Competitions.json',
      './sentence/Extracurricular Scenarios - Sports.json',
      './sentence/Learning Scenarios - Assessment Methods.json',
      './sentence/Learning Scenarios - Course Structure.json',
      './sentence/Learning Scenarios - Course Types.json',
      './sentence/Learning Scenarios - Specialized Subjects.json',
      './sentence/Library Scenarios - Book Categories.json',
      './sentence/Library Scenarios - Borrowing and Returning Books.json',
      './sentence/Library Scenarios - Equipment and Features.json',
      './sentence/New Student Enrollment Scenarios - Campus Facilities.json',
      './sentence/New Student Enrollment Scenarios - Educational Background.json',
      './sentence/New Student Enrollment ScenarioS - Faculty and Staff.json',
      './sentence/New Student Enrollment Scenarios - Identity.json',
      './sentence/Outing Scenarios - Accommodation and Transportation.json',
      './sentence/Outing Scenarios - Airport.json',
      './sentence/Outing Scenarios - Carrying Items.json',
      './sentence/Outing Scenarios - Vacation Attractions.json'

    ];
    if (round==1){
      // filter all files of the category
      let filteredFiles = filePaths.filter(filePath => filePath.includes(category+' Scenarios'));
      // step1:random select a file from the category
      fileContent = filteredFiles[Math.floor(Math.random() * filteredFiles.length)];
      fileName = fileContent.split('/').pop();
      console.log(fileName);
  }
  else{//next file(recommended based on previous rating)
    fileName=getCookie('fileName');
    ratings=getCookie('ratings');
    console.log(fileName);
    console.log(typeof ratings[ratings.length-1]);
    var requestBody = {
        "fileName": fileName,
        "ratings": ratings[ratings.length-1]
    };
    fetch('/api/get_next', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
  })
  .then(function(response) {

    return response.json();
    })
  .then(function(data) {
    nextText = data.next_text; // get filename
    fileName=nextText;
    console.log("New fileName:",fileName);
  });

}

fetch('./sentence/'+fileName)
.then(function(response) {

  return response.json();
})
.then(function(data) {

var randomSelection = [];
var indices = [];

  // generate index array
  for (var i = 0; i < data.length; i++) {
    indices.push(i);
  }

  // shuffle the index array
  for (var j = indices.length - 1; j > 0; j--) {
    var randomIndex = Math.floor(Math.random() * (j + 1));
    var temp = indices[j];
    indices[j] = indices[randomIndex];
    indices[randomIndex] = temp;
  }

  // get first 10 words
  for (var k = 0; k < 10; k++) {
    randomSelection.push(data[indices[k]]);
  }

// generate html elements to contain the words
randomSelection.forEach(function(obj, index) {
  var word = obj.word;
  var meaning = obj.meaning;
  var sentence = obj.sentence;

  var wordElement = document.createElement('p');
  wordElement.id = 'word' + (index + 1);
  wordElement.textContent = word;

  var meaningElement = document.createElement('p');
  meaningElement.id = 'meaning' + (index + 1);
  meaningElement.textContent = meaning;

  var sentenceElement = document.createElement('p');
  sentenceElement.id = 'sentence' + (index + 1);
  sentenceElement.textContent = sentence;

  // add words to containers
  var boxes = document.getElementsByClassName('box');

    boxes[index].appendChild(wordElement);
    boxes[index].appendChild(meaningElement);

  var sentence_boxes=document.getElementsByClassName("sentence-box");
  sentence_boxes[index].appendChild(sentenceElement);

});
});
});

    // get all checkboxes
    var checkboxes = document.querySelectorAll('.checkbox');

    // add checkbox event listener
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener("change", checkAllCheckboxes);
    });

    function checkAllCheckboxes() {
        const allChecked = Array.from(checkboxes).every(function(checkbox) {
        return checkbox.checked;
        });

        if (allChecked) {
            // when all checkboxes selected, rating form pops out
            document.getElementById("ratingPopup").style.display = "block";
        } else {
            // at least one checkbox not selected, hide rating form
            document.getElementById("ratingPopup").style.display = "none";
        }
    }

    // get submission button
    const submitBtn = document.getElementById("submitBtn");
    const submitButton = document.querySelector('.rating-button');

    submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    });

    submitBtn.addEventListener('click', function() {
    var selectedElement = document.querySelector('input[name="rating"]:checked');//rating
    if(selectedElement){
        selectedRating=selectedElement.value;
        var urlParams = new URLSearchParams(window.location.search);
        var round = parseInt(urlParams.get('round')) || 1;
        round++;
        urlParams.set('round', round);
        ratings.push(selectedRating);

        history.pushState(null, null, '?' + urlParams.toString());

        if(fileName && ratings){
        let key1="fileName";
        let value1=fileName;

        let key2="ratings";
        let value2=ratings;

        setCookie(key1,value1,5);
        setCookie(key2,value2,5);

    }
    if (round > 4) {
      var all_ratings = JSON.stringify({
          "ratings":ratings

      });
      console.log(Object.prototype.toString.call(ratings));
      console.log(ratings);
      fetch('/api/save_rating?user=' + encodeURIComponent(username), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: all_ratings
      })
        .then(response => response.text())
        .catch(error => {
          console.error('request error:', error);
        });
        window.location.href = 'task_finished.html';
    } else {
      location.reload();
    }
    }
    else{
        document.getElementById("errorMessage").textContent = "Please choose rating.";
    }
    });




