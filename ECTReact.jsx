// Reminder: JSX MUST BE COMPLILED BEFORE RUNNING NODE.JS ON SERVER.
// To compile, enter command: npx babel ECTReact.jsx --presets react-app/prod > ECTReact.js
// Auto-compile command: npx babel --watch src --out-dir . --presets react-app/prod&

"strict mode";

import { makeAjaxRequest } from './ECTAjax.js';

// Create Card Children Components
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
	 else return <p>{props.phrase}</p>;
}

// Buttons component
function CCbutton(props) {
    return (
        <div>
            <button onClick = {props.oc}  id = {props.id}>
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
            output: ''
        }
        this.checkReturn = this.checkReturn.bind(this);
        this.ajaxCallBack = this.ajaxCallBack.bind(this);
        this.store = this.store.bind(this);
    }

    render() {
        return (
            <main>
                <CCheader/>
                <p> Hit Enter/Return Key to translate.</p>
                <CCbutton oc = {this.store} buttonName = "Save" id = 'save'/>
                <CCbutton oc = {null} buttonName = "Review" id = 'review'/>
                <textarea id = 'textfield' rows = '25' cols = '50' placeholder = 'Input goes here.' onKeyPress = {this.checkReturn}/>
                <OutText phrase = {this.state.output}/>
            </main>
        );
    }

    // AJAX callback function
    ajaxCallBack(response) {
        // parse JSON
        let object = JSON.parse(response);
        let chOutput;
        // output translation
        chOutput = object.ChineseTraditional;
        console.log("Chinese output is " + chOutput);
        this.setState({output: chOutput});
    }

    // method - to listen for enter key to begin translation.
    checkReturn(event) {
        if (event.charCode == 13) {
            let engInput = document.getElementById('textfield').value;

            // AJAX request
            makeAjaxRequest('translate',engInput, null, this.ajaxCallBack);

            // enable save button.
            document.getElementById('save').disabled = false;
        }
    }

    // method - store into database.
    store() {
        console.log("Storing...");
        let en = document.getElementById('textfield').value;
        let cn = this.state.output;
        makeAjaxRequest('store',en,cn, null);

        // only save once.
        document.getElementById('save').disabled = true;
    }
}

ReactDOM.render(
    <CreateCardMain/>,
    document.getElementById('root')
);

// disable save button by default.
document.getElementById('save').disabled = true;