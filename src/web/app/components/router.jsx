const React = require('react');
const ReactRouter = require('react-router');
const ReactDOM = require('react-dom');

const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const History = ReactRouter.browserHistory;

const App = require('./app.jsx');
const User = require('./user.jsx');
const SignIn = require('./signIn.jsx');
const SignUp = require('./signUp.jsx');
const Home = require('./home.jsx');
const NotFound = require('./notFound.jsx');

class RouterComponent extends React.Component {
  render(){
    return(
      <Router history={History}>
        <Route path="/" component={App}>
          <Route path="/login" component={SignIn}/>
          <Route path="/register" component={SignUp}/>
          <Route path="/home" component={Home}/>
          <Route path="/user/:username" component={User}/>
          <Route path="*" component={NotFound}/>
        </Route>
      </Router>
    );
  }
}

module.exports = RouterComponent;
