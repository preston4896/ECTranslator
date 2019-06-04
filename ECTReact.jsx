// Reminder: JSX MUST BE COMPILED BEFORE RUNNING NODE.JS ON SERVER.
// To compile, enter command: npx babel ECTReact.jsx --presets react-app/prod > ECTReact.js
// Auto-compile (any .jsx files in the src directory) command: npx babel --watch src --out-dir . --presets react-app/prod&

"strict mode";

import { makeAjaxRequest } from './ECTAjax.js'; // ES6 Syntax

// Main Componnets - used for condition rendering between Card Creation and Card Database pages.

// global function to update the state of Main Component.
function updateMainState() {
    // switching from creation to review.
    if (this.state.page == 'creation') {
        // checks save before rendering review page
        if (document.getElementById('save').disabled == false) {
            if (confirm("You have not saved data into the database. Continue anyway?")) {
                this.setState({page: 'review'});
            }

            else {
                // do nothing.
            }
        }

        else {
            this.setState({page: 'review'});
        }
    }

    // goes back to creation
    else {
        this.setState({page: 'creation'});
    }
}

class MainComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // assume all users land on card creation page for now.
            page: 'creation' 
        }
        updateMainState = updateMainState.bind(this);
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
        <textarea id = 'output' rows = '25' cols = '50' value = {props.phrase} placeholder = 'Translation goes here.' disabled/>
     );
}

// Buttons component
function CCbutton(props) {
    return (
        <div>
            <button onClick = {props.oc}  id = {props.id} disabled = {props.disabled}>
                {props.buttonName}
            </button>
        </div>
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
            <main>
                <CCheader/>
                <p> Hit Enter/Return Key to translate.</p>
                <CCbutton oc = {this.store} buttonName = "Save" id = 'save' disabled = {this.state.buttonDisabledState}/>
                <CCbutton oc = {updateMainState} buttonName = "Review" id = 'review' disabled = {false}/>
                <textarea id = 'textfield' rows = '25' cols = '50' onKeyPress = {this.checkReturn} placeholder = 'Input goes here.'/>
                <OutText phrase = {this.state.output}/>
            </main>
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
            alert("Please insert English text for translation.");
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
class ReviewCardMain extends React.Component {
    constructor(props) {
        super(props);
        this.printAjaxHandler = this.printAjaxHandler.bind(this);
    }

    render() {
        // sends AJAX request to the server to fetch database.
        makeAjaxRequest('print', null, null, this.printAjaxHandler);

        return ( 
            <main>
                <p> Check console to see database output. </p>
                <button onClick = {updateMainState}> Back </button>
            </main>
        );
    }

    printAjaxHandler(response) {
        let object = JSON.parse(response);

        // debug
        let dbString = JSON.stringify(object);
        console.log("Database object: ");
        console.log(dbString);

        // TODO: add code

    }
}

ReactDOM.render(
    <MainComponent/>,
    document.getElementById('root')
);