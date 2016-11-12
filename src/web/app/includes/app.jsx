const React = require('react');
const Navbar = require('./navbar.jsx')

class App extends React.Component {
  constructor(){
    super();
  }

  render(){
    return (
      <Navbar/>
    );
  }
}

module.exports = App;
