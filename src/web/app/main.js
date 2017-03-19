const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./components/app.jsx');
const Router = require('./components/router.jsx');

$(document).ready(function () {
  ReactDOM.render(React.createElement(Router), document.getElementById('react-container'));
});
