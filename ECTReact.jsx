// Reminder: JSX MUST BE COMPILED BEFORE RUNNING NODE.JS ON SERVER.
// To compile, enter command: npx babel ECTReact.jsx --presets react-app/prod > ECTReact.js
// Auto-compile (any .jsx files in the src directory) command: npx babel --watch src --out-dir . --presets react-app/prod&

"strict mode";

import { makeAjaxRequest } from './ECTAjax.js';

// Main Componnets - used for condition rendering between Card Creation and Card Database pages.

// global function - to update the state of Main Component.
function updateMainState() {
    // switching from creation to review.
    if (this.state.page == 'creation') {
        // checks save before rendering review page
        if (document.getElementById('save').disabled == false) {
            if (confirm("You have not saved this data into the database. Continue anyway?")) {
                this.setState({page: 'review'});
            }

            else {
                return;
            }
        }
        this.setState({page: 'review'});
    }

    else if (this.state.page == 'login') {
        // assume all users gets redirected to card creation page after logging in for now.
        this.setState({isLoggedIn: true});
        this.setState({page: 'creation'}); 
    }

    // goes back to creation
    else {
        if ((document.body.contains(document.getElementById('next'))) && (document.getElementById('next').disabled != true)) {
            if (confirm("You have not completed your review session. Exiting this page will lose your progress. Continue anyway?")) {
                this.setState({page: 'creation'});
            }
            else {
                return;
            }
        }
        this.setState({page: 'creation'});
    }
}

// global function - to log users out.
function logout() {
    //TODO: More code needed after Google Login API is set up.

    this.setState({isLoggedIn: false});
    this.setState({page: 'login'}); 
}

class MainComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'login' ,
            isLoggedIn: false
        }
        updateMainState = updateMainState.bind(this);
        logout = logout.bind(this);
    }

    render() {
        if (this.state.page == 'creation') {
            return (
                <CreateCardMain/>
            );
        }

        else if (this.state.page == 'review') {
            return (
                <ReviewCardMain/>
            );
        }

        else if (this.state.page == 'login') {
            return (
                <Login/>
            );
        }

        else return (
            <p> Error 404: Page not found. </p>
        );
    }
}

// Login Page Components
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
    }

    render() {
        return (
			<div id="wrapper">
                <section class="intro">
                    <header>
                    </header>
                </section>

            <section id="first">
                <header>
                    <h1>Welcome to ECTranslator!</h1>
                    <h2>Customize your vocabulary</h2>
                </header>
                <div class="content">
                    <script src="https://apis.google.com/js/platform.js" async defer></script>
                    <div class="g-signin2" data-onsuccess="onSignIn"></div>
                    <img src="assets/btn_google_signin_dark_normal_web@2x.png" alt="" onClick = {this.login}/>
                </div>
            </section>
			</div>
        );
    }

    login() {
        updateMainState();

        //TODO: More code needed after Google Login API is set up.
    }
}

// Logout Components
function LogoutButton() {
    return (
        <footer>
            <button id = 'logout' onClick = {logout}>
                Log Out
            </button>
        </footer>
    )
}

// Card Creation Children Components
// Header component
function CCheader() {
    return (
        <header>
            <h1> English to Chinese (Traditional) Card Creation Page </h1>
        </header>
    );
}

// Translated text component
function OutText(props) {
    if (props.phrase == undefined) {
	    return <p>Text missing</p>;
	    }
	else return (
        <textarea id = 'output' value = {props.phrase} placeholder = 'Translation goes here.' disabled/>
     );
}

// The main component for the card creation page.
class CreateCardMain extends React.Component {
    // state initializes here - default input and output text.
    constructor(props) {
        super(props);
        this.state = {
            output: '',
            input: '',
            buttonDisabledState: true
        }
        this.checkReturn = this.checkReturn.bind(this);
        this.translateAjaxHandler = this.translateAjaxHandler.bind(this);
        this.store = this.store.bind(this);
    }

    render() {
        return (
            <div>
                <main>
                    <CCheader/>
                    <p> Hit Enter/Return Key to translate.</p>
                    <div>
                        <button onClick = {this.store} id = 'save' disabled = {this.state.buttonDisabledState}>
                            Save
                        </button>
                        <button onClick = {updateMainState} id = 'review' disabled = {false}>
                            Review
                        </button>
                    </div>
                    <textarea id = 'textfield' onKeyPress = {this.checkReturn} placeholder = 'Input goes here.'/>
                    <OutText phrase = {this.state.output}/>
                </main>
                <LogoutButton/>
            </div>
        );
    }

    // AJAX callback function
    translateAjaxHandler(response) {
        // parse JSON
        let object = JSON.parse(response);
        let chOutput;
        // output translation
        chOutput = object.ChineseTraditional;
        
        // blank check
        if (chOutput == '') {
            alert("Please insert valid English text for translation.");
            this.setState({buttonDisabledState: true});
            this.setState({output: chOutput});
        }

        else {
            console.log("Chinese output is " + chOutput);
            this.setState({output: chOutput});

            // enable save button.
            this.setState({buttonDisabledState: false});
        }
    }

    // method - to listen for enter key to begin translation.
    checkReturn(event) {
        let engInput = document.getElementById('textfield').value;
        this.setState({input: engInput});

        if (event.charCode == 13) {
            // AJAX request
            makeAjaxRequest('translate',engInput, null, this.translateAjaxHandler);
        }
    }

    // method - store into database.
    store() {
        let en = this.state.input;
        let cn = this.state.output;
        makeAjaxRequest('store',en,cn, null);

        // only save once.
        this.setState({buttonDisabledState: true});
    }
}

// Card Database/Review Children Components.

function Rheader(props) {
    return (
        <header>
            <h1> {props.greeting} </h1>
        </header>
    );
}

function TextBox(props) {
    if (props.text == undefined) {
        return (
            <p> Error loading database. </p>
        );
    }

    else {
        return (
            <div>
                <textarea id = 'chinese' rows = '25' cols = '100' value = {props.text} disabled />
            </div>
        );
    }
}

function Message(props) {
    if (props.message == undefined) {
        return (
            <p> undefined message. </p>
        );
    }
    else {
        return (
            <div style = {props.style}>
                <p id = {props.id}> {props.message} </p>
            </div>
        )
    }
}

class ReviewCardMain extends React.Component {
    constructor(props) {
        super(props);
        this.printAjaxHandler = this.printAjaxHandler.bind(this);
        this.loadCnText = this.loadCnText.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.state = {
            cn: 'Chinese goes here.',
            saved: true,
            data: [],
            index: 0,
            message: 'Message goes here.',
            showMessage: false,
            score: 0
        }
    }

    render() {
        // sends AJAX request to the server to fetch database.
        makeAjaxRequest('print', null, null, this.printAjaxHandler);

        if (!this.state.saved) {
            return (
                <div>
                    <main>
                        <Rheader greeting = "Uh-oh! Looks like your database is empty. Go back and hit save after translating more words."/>
                        <button onClick = {updateMainState}> Back </button>
                    </main>
                    <LogoutButton/>
                </div>
            );
        }

        else {
            return ( 
                <div>
                    <main>
                        <Rheader greeting = "Let's Review Chinese!"/>
                        <h2> Translate the following words in English. </h2>
                        <p> Click on Next after inserting your answer in the textfield. </p>
                        <Message message = {"Score: " + this.state.score} id = 'score' />
                        <TextBox text = {this.state.cn}/>
                        <div>
                            <input id = 'english' type = 'text' placeholder = 'Input English here' required/>
                        </div>
                        <Message message = {this.state.message} style = {{display: this.state.showMessage ? 'block': 'none'}} id = 'message'/>
                        <button onClick = {this.checkAnswer} id = 'next'> Next </button> 
                        <button onClick = {updateMainState}> Back </button>
                    </main>
                    <LogoutButton/>
                </div>
            );
        }
    }

    printAjaxHandler(response) {
        let dataEntries = JSON.parse(response);
        if (dataEntries === undefined || dataEntries.length == 0) {
            this.setState({saved: false});
        }
        else {
            this.setState({data: dataEntries});
            this.loadCnText(); // load the content now.
        }
    }

    // call this function to load Chinese text into the textbox.
    loadCnText() {
        if (this.state.data[this.state.index] != undefined) {
            this.state.cn = this.state.data[this.state.index].Cn;
        }

        else {
            this.state.cn = "Congratulations! You are done.";
            document.getElementById('next').disabled = true;
            document.getElementById('english').style.display = 'none';
        }
    }

    // call this function after user clicked on the next button
    checkAnswer() {
        this.setState({showMessage: true});
        let answer = document.getElementById('english').value;
        if (answer != this.state.data[this.state.index].Eng) {
            this.setState({message: 'Answer is incorrect.'});
        }

        else {
            let i = this.state.index;
            i++ ; // index increment.

            let s = this.state.score;
            s++ ; // correct increment.

            this.setState({showMessage: false});
            this.setState({index: i});
            this.setState({score: s});
            this.loadCnText();
            document.getElementById('english').value = ''; // clear input.
        }
    }
}

ReactDOM.render(
    <MainComponent/>,
    document.getElementById('root')
);