const React = require('react');
const ReactRouter = require('react-router');
const ReactDOM = require('react-dom');

const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const History = ReactRouter.browserHistory;

const SignIn = require('./signIn.jsx');
const SignUp = require('./signUp.jsx');
const App = require('./app.jsx');

class RouterComponent extends React.Component {
  render(){
    return(
      <Router history={History}>
        <Route path="/" component={App}>
          <Route path="/login" component={SignIn}/>
        </Route>
      </Router>
    );
  }
}

module.exports = RouterComponent;
