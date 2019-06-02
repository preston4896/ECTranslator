// Reminder: JSX MUST BE COMPLILED BEFORE RUNNING NODE.JS ON SERVER.
// To compile, enter command: npx babel ECTReact.jsx --presets react-app/prod > ECTReact.js

"strict mode";

function CreateCardMain() {
    return <main>
    <h1> English to Chinese (Traditional) Translator </h1>
    <p> Hit Enter/Return Key to translate</p>
    <input id = "textfield" type = "text" placeholder = "Input goes here."/>
    <button id = "store"> Save </button>
    <p id="output"> Output goes here. </p>
</main>;
}

ReactDOM.render(
    <CreateCardMain/>,
    document.getElementById('root')
);