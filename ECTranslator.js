'strict mode';

// AJAX Request
function makeAjaxRequest(id, input1, input2) {
    let url = id + '?english=' + input1;
    let xhr = new XMLHttpRequest();
    console.log(url);
    switch (id) {
        case 'translate':
            console.log(url);
            xhr.open('GET', url, true);
            xhr.onload = function() {
                // parse JSON
                let object = JSON.parse(xhr.responseText);
        
                // output translation
                document.getElementById('output').style.display = "block";
                document.getElementById('output').textContent = object.ChineseTraditional;
                console.log("Chinese output is " + object.ChineseTraditional);
            }
        break;

        case 'store':
            url += '&chinese=' + input2;
            console.log(url);
            xhr.open('GET', url, true);
            xhr.onload = function() {
                alert("Data successfully stored into the database.");
            }
        break;

        default:
            xhr.onerror = function() {
                alert('Woops, there was an error making the request.');
            }
        break;
    }

    xhr.send(); // sends the request to the server.
}

// hit "enter" to translate.
document.getElementById('textfield').addEventListener('keypress', function(e) {
    let key = e.which || e.keyCode;
    if (key === 13) {
        let input = document.getElementById('textfield').value;
        makeAjaxRequest('translate',input);
    }
});

// click on save to run insertion query.
document.getElementById('store').addEventListener('click', function() {
    let en = document.getElementById('textfield').value;
    let cn = document.getElementById('output').textContent;
    makeAjaxRequest('store',en,cn);
});

// do not show output when page just loaded.
document.getElementById('output').style.display = "none";