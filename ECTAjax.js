'strict mode';

// AJAX Request
export function makeAjaxRequest(id, input1, input2, callback) {
    let url = id + '?english=' + input1;
    let xhr = new XMLHttpRequest();
    console.log(url);
    switch (id) {
        case 'translate':
            console.log(url);
            xhr.open('GET', url, true);
            xhr.onload = function() {
                callback(xhr.responseText);
            };
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
    }

    xhr.send(); // sends the request to the server.
}