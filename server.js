"strict mode";

const express = require('express');
const port = 53754;

// Initialize database.
const sqlite3 = require("sqlite3").verbose();
const dbFileName = "ECT.db";

// Google Authentication Modules
const cookieSession = require('cookie-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

// OAuth2 API Access Identification
const googleLoginData = {
    clientID: '104738630252-kq2m40914op28f5c0c921hha33ns6ae6.apps.googleusercontent.com',
    clientSecret: 'ya09fkMWgVlqI-gtSVpYV9fg',
    callbackURL: '/auth/redirect'
};

// store login information
passport.use(new GoogleStrategy(googleLoginData, gotProfile));

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
function initDB() {
    function tableCreationCallback(err) {
        if (err) {
        console.log("Init error",err);
        } else {
        console.log("Database Tables initialized successfully");
        }
    }

    const db = new sqlite3.Database(dbFileName);

    // initialize Google User table
    const cmdStrUsers = 'CREATE TABLE IF NOT EXISTS Users (UserID INTEGER PRIMARY KEY, FirstName TEXT, LastName, TEXT)';

    // initialize words table
    const cmdStrWords = 'CREATE TABLE IF NOT EXISTS Words (EntryID INTEGER PRIMARY KEY, GoogleUserID INTEGER, Eng TEXT, Cn TEXT, Shown INT, Correct INT)';

    db.run(cmdStrUsers, tableCreationCallback);
    db.run(cmdStrWords, tableCreationCallback);
    db.close();
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
    const cmdStr = 'INSERT INTO Words (Eng, Cn, Shown, Correct) VALUES (@0,@1,0,0)';
    db.run(cmdStr, eng, cn, insertionCallback);
}

// print database
function printWords(resInput) {
    function dataCallback( err, data ) {
        if (err) {
            console.log("Error printing data...");
            resInput.send("Error printing data...");
        }
        else {
            console.log("Database is being printed out succesfully.");
            resInput.send(data);
            db.close();
        }
    }
    let db = new sqlite3.Database(dbFileName); //open the database.
    db.all ( 'SELECT * FROM Words', dataCallback);
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

// This handler returns the database as JSON.
function printWordsHandler(req, res) {
    printWords(res);
}

// Returns a 404 error if the HTML file requested can not be found and all queires are invalid.
function fileNotFound(req, res) {
    let url = req.url;
    res.type('text/plain');
    res.status(404);
    res.send('Cannot find '+url);
}

// print url from incoming HTTP requests.
function printURL (req, res, next) {
    console.log("server echoes url: "+req.url);
    next();
}

// function check whether users are logged in.
function isAuthenticated(req, res, next) {
    if (req.user) {
	console.log("Req.session:",req.session);
    console.log("Req.user:",req.user);
	next();
    } else {
	res.redirect('/ECTlogin.html');  // send response telling
	// Browser to go to login page
    }
}

// process logging out.
function logoutHandler(req, res) {
    console.log("Attempt to destroy: ", req.session);
    req.user = null;
    req.session = null;
    res.redirect('/ECTlogin.html'); 
}

// this function checks if the user exists in the database and returns the userID, otherwise inserts new users into the database.
// returns -1 if there's an error.
function getUserID(first, last) {
    let db = new sqlite3.Database(dbFileName); //open the database.
    let cmd = 'SELECT UserID FROM Users WHERE FirstName = ' + '"' + first + '"' + ' AND LastName = ' + '"' + last + '"' ;
    console.log('cmd: ' + cmd);
    let id = -1;
    db.get(cmd, function(err, data) {
        if (err) {
            console.log("Error locating user.");
        }
        else {
            if (data === undefined) {
            let insertCMD = 'INSERT INTO Users (FirstName, LastName) VALUES (@0, @1)';
            db.run(insertCMD, first, last, function (err) {
                if (err) {
                    console.log("User insertion error",err);
                } 
                else {
                    console.log("User inserted");
                }
            });
            }

            else {
                console.log("Existing User output: ", data);
                id = data.UserID;
            }
        }
        db.close();
    });
    return id;
}

// --------------------------------------

// Some functions Passport calls, that we can use to specialize.
// This is where we get to write our own code, not just boilerplate. 
// The callback "done" at the end of each one resumes Passport's
// internal process. 

// function called during login, the second time passport.authenticate
// is called (in /auth/redirect/),
// once we actually have the profile data from Google. 
function gotProfile(accessToken, refreshToken, profile, done) {
    console.log("Google profile",profile);

    // here is a good place to check if user is in DB,
    // and to store him in DB if not already there. 
    // Second arg to "done" will be passed into serializeUser,
    // should be key to get user out of database.
    let first = profile.name.givenName;
    let last = profile.name.familyName;
    
    let dbRowID = getUserID(first, last);

    console.log("dbRow: " + dbRowID);

    done(null, first + ' ' + last); 
}

// Part of Server's sesssion set-up.  
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie. 
passport.serializeUser((dbRowID, done) => {
    console.log("SerializeUser. Input is ", dbRowID);
    done(null, dbRowID);
});

// Called by passport.session pipeline stage on every HTTP request with
// a current session cookie. 
// Where we should lookup user database info. 
// Whatever we pass in the "done" callback becomes req.user
// and can be used by subsequent middleware.
passport.deserializeUser((dbRowID, done) => {
    console.log("deserializeUser. Input is ", dbRowID);
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object. 
    let userData = {userData: dbRowID};
    done(null, userData);
});

// --------------------------------------
// put together the server pipeline
const app = express()

// echo url for debugging
app.use('/', printURL);

// begin checking for cookies to see if user is already logged in
app.use(cookieSession({
    maxAge: 1 * 1000 * 60 * 30, // 30 mins
    keys: ['willBeRandomizedLater']
}));

// Initializes request object for further handling by passport
app.use(passport.initialize()); 

// If there is a valid cookie, will call deserializeUser() - attaches user information to req.
app.use(passport.session()); 

// public static file. - if users are not logged in.
app.use(express.static('public'));

// The server redirects user to Google's login page here -- beginning the login process.
app.get('/auth/google', 
passport.authenticate('google',{ scope: ['profile'] }));

// After successfully logged in, call this function.
app.get('/auth/redirect',
passport.authenticate('google'),
function (req, res) {
    console.log('Logged in and using cookies!')
    res.redirect('/users/ECTranslator.html');
});

// static file - for logged in users only.
app.get('/users/*',
isAuthenticated,
express.static('.'));

// API queries.
app.get('/users/translate', translateHandler );   // translate.
app.get('/users/store', storeHandler); // store query handler.
app.get('/users/print', printWordsHandler); // print database handler.

// logout - invalidate the cookie.
app.get('/users/logout', logoutHandler);

// user info.
app.get('/users/info',
function (req, res) {
    console.log("loading user info to browser...");
    res.json(
        {
            Name: req.user.userData
        }
    )
})

//404 error for invalid URL
app.use( fileNotFound );

//Pipeline done.
app.listen(port, function (){console.log('Listening...');} );

// load db here.
initDB();