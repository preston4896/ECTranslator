'strict mode';

// AJAX Request

function makeAjaxRequest(inputWord) {
    let url = 'translate?english=' + inputWord;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        // parse JSON
        let object = JSON.parse(xhr.responseText);

        // output translation
        document.getElementById('output').style.display = "block";
        document.getElementById('output').textContent = object.ChineseTraditional;
        console.log("Chinese output is " + object.ChineseTraditional);
    }
    xhr.onerror = function() {
        alert('Woops, there was an error making the request.');
    }
    xhr.send(); // sends the request to the server.
}

// translate button
document.getElementById('translate').addEventListener('click', function() {
    let input = document.getElementById('textfield').value;
    makeAjaxRequest(input);
  });

// do not show output when page just loaded.
document.getElementById('output').style.display = "none";