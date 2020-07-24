window.addEventListener("load", bindFunctions);

//global variables
var searchButton = document.querySelector("#btn-search");
var inputField = document.querySelector("#transcript");
var micButton = document.querySelector("#mic");

//binding clicks to events
function bindFunctions() {
  searchButton.addEventListener("click", ajaxCallWithFetch);
  micButton.addEventListener("click", startDictation);
  inputField.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      ajaxCallWithFetch();
    }
  });
}

//to make ajax calls to giphy server --Old Method
function ajaxCallWithoutFetch() {
  if (inputField.value) {
    document.querySelector("#loading").classList.toggle("hidden");
    let query = inputField.value;
    let apiKey = "ms6y8EvjVy37YCYFq7DqU7Al9C0ljKLP";
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=10`;
    console.log(url);
    let http = new XMLHttpRequest();
    //Bind Ready state Event
    http.onreadystatechange = function () {
      if (http.readyState === 4 && http.status === 200) {
        document.querySelector("#loading").classList.toggle("hidden");
        let obj = JSON.parse(http.responseText);
        addResultsToScreen(obj);
      }
    };

    http.open("GET", url);
    http.send();
  }
}
//to make ajax calls to giphy server --New Method
function ajaxCallWithFetch() {
  if (inputField.value) {
    let query = inputField.value;
    let apiKey = "ms6y8EvjVy37YCYFq7DqU7Al9C0ljKLP";
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=12`;
    //console.log(url);
    if (window.fetch) {
      document.querySelector("#loading").classList.toggle("hidden");
      //options can also be configured for fetch
      var obj = { id: 1001, name: 'Ram', salary: 9999 };
      const options = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      }
      //return a promise
      var promise = fetch(url);
      promise.then(response => {
        response.json().then(data => {
          addResultsToScreen(data);
          document.querySelector("#loading").classList.toggle("hidden");
        }).catch(err => console.error('Inavlid JSON!'))
      }).catch(err => console.error('Serve is not responding!'))
        .finally(() => {
          console.log('I always run');
        })
    } else {
      console.log('Fetch is not supported.');
    }

  }
}


//add fetched results to the client window
function addResultsToScreen(obj) {
  let arr = obj.data;
  let result = document.querySelector(".result");
  result.innerHTML = "";
  arr.forEach((item) => {
    result.appendChild(createImage(item.images.original.url));
  });
}

//Create separate image elements
function createImage(url) {
  let image = document.createElement("img");
  image.src = url;
  image.className = "size";
  return image;
}

// HTML5 Speech Recognition API
function startDictation() {
  if (window.hasOwnProperty("webkitSpeechRecognition")) {
    document.querySelector("#speak").classList.toggle("hidden");
    var recognition = new webkitSpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function (e) {
      document.querySelector("#speak").classList.toggle("hidden");
      let query = e.results[0][0].transcript;
      inputField.value = query;
      recognition.stop();
      ajaxCallWithFetch();
      console.log("Reached end");
    };

    recognition.onerror = function (e) {
      recognition.stop();
    };
  }
}
