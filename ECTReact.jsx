// Reminder: JSX MUST BE COMPLILED BEFORE RUNNING NODE.JS ON SERVER.
// To compile, enter command: npx babel ECTReact.jsx --presets react-app/prod > ECTReact.js
// Auto-compile command: npx babel --watch src --out-dir . --presets react-app/prod&

"strict mode";

import { makeAjaxRequest } from './ECTAjax.js';

// Create Card Header component
function CCheader() {
    return (
        <header>
            <h1> English to Chinese (Traditional) Card Creation Page </h1>
        </header>
    );
}

function OutText(props) {
    if (props.phrase == undefined) {
	    return <p>Text missing</p>;
	    }
	 else return <p>{props.phrase}</p>;
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
    }
    render() {
        return (
            <main>
                <CCheader/>
                <p> Hit Enter/Return Key to translate.</p>
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
        document.getElementById('textfield').value = '';
    }

    // method - to listen for enter key to begin translation.
    checkReturn(event) {
        if (event.charCode == 13) {
            let engInput = document.getElementById('textfield').value;

            // AJAX request
            makeAjaxRequest('translate',engInput, null, this.ajaxCallBack);
        }
    }
}

ReactDOM.render(
    <CreateCardMain/>,
    document.getElementById('root')
);