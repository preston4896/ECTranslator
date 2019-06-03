"strict mode";

const express = require('express');
const port = 53754;

// Initialize database.
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const dbFileName = "ECUsers.db";
const db = new sqlite3.Database(dbFileName);

// The API request functions that allows our server to commmunicate directly with Google Cloud.
function talkToGoogle(input, resInput) {
    const APIrequest = require('request');
    const http = require('http');
    const APIkey = "AIzaSyATOeTMHkeAzNdg0PJ7zp0xCZqOpBo_Ebs";
    const url = "https://translation.googleapis.com/language/translate/v2?key="+APIkey

    // An object containing the data expressing the query to the
    // translate API. 
    let requestObject = 
    {
        "source": "en",
        "target": "zh-TW",
        "q": [
            input
        ]
    }

    console.log("English phrase: ", requestObject.q[0]);
            
    // The call that makes a request to the API
    // Uses the Node request module, which packs up and sends off
    // an HTTP message containing the request to the API server
    APIrequest(
        { // HTTP header stuff
            url: url,
            method: "POST",
            headers: {"content-type": "application/json"},
            // will turn the given object into JSON
            json: requestObject	
        },
        // callback function for API request
        APIcallback
        );

    // callback function, called when data is received from API
    function APIcallback(err, APIresHead, APIresBody) {
        // gets three objects as input
        if ((err) || (APIresHead.statusCode != 200)) {
            // API is not working
            console.log("Got API error");
            console.log(APIresBody);
        } else {
            if (APIresHead.error) {
                // API worked but is not giving you data
                console.log(APIresHead.error);
                } 
            else {
                console.log("In Chinese (Traditional): ", 
                    APIresBody.data.translations[0].translatedText);
                console.log("\n\nJSON was:");
                console.log(JSON.stringify(APIresBody, undefined, 2));
                // print it out as a string, nicely formatted

                // now return the json object
                resInput.json(
                    {
                        "English": input,
                        "ChineseTraditional": APIresBody.data.translations[0].translatedText
                    }
                )
            }
        }
     } // end callback function
}

// Initialize table in our server.
function initDBTable() {
    function tableCreationCallback(err) {
        if (err) {
        console.log("Table creation error",err);
        } else {
        console.log("Database initialized successfully");
        db.close();
        }
    }

    const cmdStr = 'CREATE TABLE IF NOT EXISTS Users (EntryID INTEGER PRIMARY KEY, Eng TEXT, Cn TEXT, Shown INT, Correct INT)';

    db.run(cmdStr, tableCreationCallback);
}

// Store translation into table in database.
function storeEC(eng, cn) {
    function insertionCallback(err) {
        if (err) {
        console.log("Data insertion error",err);
        } else {
        console.log("Data inserted");
        db.close();
        }
    }
    let db = new sqlite3.Database(dbFileName); //open the database.
    const cmdStr = 'INSERT INTO Users (Eng, Cn, Shown, Correct) VALUES (@0,@1,0,0)';
    db.run(cmdStr, eng, cn, insertionCallback);
}

// print database
function dumpDB() {
    let db = new sqlite3.Database(dbFileName); //open the database.
    db.all ( 'SELECT * FROM flashcards', dataCallback);
    function dataCallback( err, data ) {console.log(data)}
    db.close();
}

// This handler takes in the translation query and makes the API Request.
function translateHandler(req, res, next) {
    let url = req.url;
    let Obj = req.query;
    console.log(Obj);
    if (Obj.english != undefined) {
        talkToGoogle(Obj.english, res);
    }
    else {
        console.log("I don't understand this query, next query please!");
        next();
    }
}

// This handler stores English and Chinese texts into the database.
function storeHandler(req, res, next) {
    let url = req.url;
    let Obj = req.query;
    console.log(Obj);
    if ((Obj.english != undefined) && (Obj.chinese != undefined)) {
        storeEC(Obj.english, Obj.chinese);
        res.send("Data successfully stored into the database.");
    }
    else {
        console.log("I don't understand this query, next query please!");
        next();
    }
}

// Returns a 404 error if the HTML file requested can not be found and all queires are invalid.
function fileNotFound(req, res) {
    let url = req.url;
    res.type('text/plain');
    res.status(404);
    res.send('Cannot find '+url);
}

// put together the server pipeline
const app = express()
app.use(express.static('public'));  // can I find a static file in the public sub-directory? 
app.get('/translate', translateHandler );   // if not, is it a valid query for translation?
app.get('/store', storeHandler); // store query handler.
app.use( fileNotFound );            // otherwise not found
app.listen(port, function (){console.log('Listening...');} );
initDBTable();

// Node.js does not support ES6 Syntax
exports.dumpDB = dumpDB;