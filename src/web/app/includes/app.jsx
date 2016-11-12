const React = require('react');
const ReactDOM = require('react-dom');
const Modal = require('react-modal');

// Components
const Navbar = require('./navbar.jsx');

// App component
class App extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div>
        <Navbar/>
      </div>
    );
  }
}

module.exports = App;
