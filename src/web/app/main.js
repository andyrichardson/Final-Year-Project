const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./includes/app.jsx')

$(document).ready(function() {
  ReactDOM.render(React.createElement(App), document.getElementById("react-container"));
});
