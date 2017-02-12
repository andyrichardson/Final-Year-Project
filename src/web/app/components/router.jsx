const React = require('react');
const ReactRouter = require('react-router');
const ReactDOM = require('react-dom');

const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const History = ReactRouter.browserHistory;

/* COMPONENTS */
const App = require('./app.jsx');
const SignIn = require('./signIn.jsx');
const SignUp = require('./signUp.jsx');
const Home = require('./home.jsx');
const Notifications = require('./notifications.jsx');
const Meetings = require('./meetings.jsx');
const User = require('./user.jsx');
const NotFound = require('./notFound.jsx');

class RouterComponent extends React.Component {
  render(){
    return(
      <Router history={History}>
        <Route path="/" component={App}>
          <Route path="/login" component={SignIn}/>
          <Route path="/register" component={SignUp}/>
          <Route path="/home" component={Home}/>
          <Route path="/notifications" component={Notifications}/>
          <Route path="/meetings" component={Meetings}/>
          <Route path="/user/:username" component={User}/>
          <Route path="*" component={NotFound}/>
        </Route>
      </Router>
    );
  }
}

module.exports = RouterComponent;
