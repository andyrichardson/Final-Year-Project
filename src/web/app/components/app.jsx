const React = require('react');
const ReactDOM = require('react-dom');
// const Modal = require('react-modal');

// Components
const Navbar = require('./navbar.jsx');

// App component
class App extends React.Component {
  render(){
    return(
      <div>
        <Navbar/>
        {this.props.children}
      </div>
    );
  }
}

module.exports = App;
