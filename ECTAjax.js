'strict mode';

// AJAX Request
export function makeAjaxRequest(id, input1, input2, callback) {
    let url = id;
    let xhr = new XMLHttpRequest();
    console.log(url);
    switch (id) {
        case 'translate':
            url += '?english=' + input1;
            console.log(url);
            xhr.open('GET', url, true);
            xhr.onload = function() {
                callback(xhr.responseText);
            };
        break;

        case 'store':
            url += '?english=' + input1 + '&chinese=' + input2;
            console.log(url);
            xhr.open('GET', url, true);
            xhr.onload = function() {
                alert(input1 + " <-> " + input2 + " has been successfully stored into the database.");
            }
        break;

        case 'print':
            console.log(url);
            xhr.open('GET', url, true);
            xhr.onload = function() {
                callback(xhr.responseText);
            };
        break;

        default:
            xhr.onerror = function() {
                alert('Woops, there was an error making the request.');
            }
    }

    xhr.send(); // sends the request to the server.
}