// Reminder: JSX MUST BE COMPILED BEFORE RUNNING NODE.JS ON SERVER.
// To compile, enter command: npx babel ECTReact.jsx --presets react-app/prod > ECTReact.js
// Auto-compile (any .jsx files in the src directory) command: npx babel --watch src --out-dir . --presets react-app/prod&
// minify js: npx terser -c -m -o ECTReact.min.js -- ECTReact.js

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
    document.getElementById('info').style.display = 'none';
    this.setState({page: 'logout'});
    this.setState({isLoggedIn: false});
    makeAjaxRequest('logout');
}

// Logout Components
function UserInfo(props) {
    return (
        <footer id = 'info'>
            <p>
                You are now logging in as {props.user}.
            </p>
            <button id = 'logout' onClick = {logout}>
                Log Out
            </button>
        </footer>
    )
}

class MainComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'creation' ,
            isLoggedIn: true,
            userName: 'First Last'
        }
        updateMainState = updateMainState.bind(this);
        logout = logout.bind(this);
        this.printUserHandler = this.printUserHandler.bind(this);
    }

    // make the request before the DOM is loaded.
    componentDidMount() {
        // sends AJAX request to the server to fetch user info
        makeAjaxRequest('info', null, null, this.printUserHandler);
    }

    printUserHandler(response) {
        let user = JSON.parse(response);
        this.setState({userName: user.Name});
    }

    render() {
        if (this.state.page == 'creation') {
            return (
                <main>
                    <CreateCardMain/>
                    <UserInfo user = {this.state.userName}/>
                </main>
            );
        }

        else if (this.state.page == 'review') {
            return (
                <main>
                    <ReviewCardMain/>
                    <UserInfo user = {this.state.userName}/>
                </main>
            );
        }

        else if (this.state.page == 'logout') {
            return (
                <p> You are logged out. Please refresh this page. </p>
            );
        }

        else return (
            <p> Error 404: Page not found. </p>
        );
    }
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
                <CCheader/>
                <h2> Hit Enter/Return Key to translate.</h2>
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
            </div>
        );
    }

    // AJAX callback function
    translateAjaxHandler(response) {
        console.log("TranslateAJAX responded.");

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
            console.log("Sending TranslateAJAX...");
            makeAjaxRequest('translate',engInput, null, this.translateAjaxHandler);
        }
    }

    // method - store into database.
    store() {
        let enInput = this.state.input;
        let en = enInput.toLowerCase();
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
                <textarea id = 'chinese' value = {props.text} disabled />
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
            en: '',
            saved: false,
            data: [],
            index: 0,
            message: 'Message goes here.',
            showMessage: false,
            score: 0,
            nextDisabled: false
        }
    }

    // make the request before the DOM is loaded.
    componentDidMount() {
        // sends AJAX request to the server to fetch database
        makeAjaxRequest('print', null, null, this.printAjaxHandler);
    }

    // render() is called first before making the AJAX request so we have to reload the DOM.
    componentDidUpdate(prevProps, prevState) {
        if ((this.state.index !== prevState.index)||(this.state.data !== prevState.data)) {
            this.loadCnText(); // load the content now.
            if (this.state.data[this.state.index] != undefined) {
                this.setState({en: this.state.data[this.state.index].Eng});
            }
        }
    }

    render() {
        if (!this.state.saved) {
            return (
                <div>
                    <Rheader greeting = "Uh-oh! Looks like your database is empty."/>
                    <h2> Go back and start translating words. </h2>
                    <button onClick = {updateMainState}> Add Words </button>
                </div>
            );
        }

        else {
            console.log("rendering...");
            console.log("new cn: " + this.state.cn);
            return (
                <div>
                    <Rheader greeting = "Let's Review Chinese!"/>
                    <h2> Translate the following words in English. </h2>
                    <p id = 'nextText'> Click on Next after inserting your answer (all lowercase) in the textfield. </p>
                    <Message message = {"Score: " + this.state.score} id = 'score' />
                    <TextBox text = {this.state.cn}/>
                    <div>
                        <input id = 'english' type = 'text' placeholder = 'Input English here' disabled = {this.state.nextDisabled}/>
                    </div>
                    <Message message = {this.state.message} style = {{display: this.state.showMessage ? 'block': 'none'}} id = 'message'/>
                    <button onClick = {this.checkAnswer} id = 'next' disabled = {this.state.nextDisabled}> Next </button> 
                    <button onClick = {updateMainState}> Add Words </button>
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
            // store the data.
            this.setState({saved: true});
            console.log("receiving data");
            this.setState({data: dataEntries}); //calls render() right away
        }
    }

    // call this function to load Chinese text into the textbox.
    loadCnText() {

        if (this.state.data[this.state.index] != undefined) {
            console.log("loading cn...");
            this.setState({cn: this.state.data[this.state.index].Cn});
        }

        else {
            this.setState({cn: "Congratulations! You are done."});
            document.getElementById('english').value = "";
            document.getElementById('nextText').style.display = 'none';
            this.setState({nextDisabled: true});
        }
    }

    // call this function after user clicked on the next button
    checkAnswer() {
        let answer = document.getElementById('english').value;
        document.getElementById('english').value = "";

        if (answer != this.state.en) {
            this.setState({showMessage: true});
            this.setState({message: 'Answer is incorrect.'});
        }

        else {
            this.setState({showMessage: false});
            let i = this.state.index;
            i++ ; // index increment.

            let s = this.state.score;
            s++ ; // correct increment. - TODO: Needs to be changed later.

            this.setState({index: i});
            this.setState({score: s});
        }
    }
}

ReactDOM.render(
    <MainComponent/>,
    document.getElementById('root')
);