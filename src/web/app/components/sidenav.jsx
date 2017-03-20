const React = require('react');
const Link = require('react-router').Link;
const History = require('react-router').browserHistory;

// Components
const RB = require('react-bootstrap');

/* SIDE NAVIGATION */
class SideNav extends React.Component{
  constructor(props) {
    super(props);
    this.state = { activeKey: '/home' };
  }

  handleSelect(selectedKey) {
    this.setState({ activeKey: selectedKey });
    History.push(selectedKey);
  }

  hiddenClass() {
    if (this.props.visible) {
      return 'sidenav-visible';
    }

    return 'sidenav-hidden';
  }
  render() {
    if (!this.props.auth) {
      return <div></div>;
    }

    return (
      <RB.Col id={'sideNav'} className={this.hiddenClass()} xs={7} lg={2}>
        <RB.Nav
          bsStyle="pills"
          stacked
          activeKey={this.state.activeKey}
          onSelect={(k)=>this.handleSelect(k)}
        >
          <RB.NavItem eventKey={'/home'}>Home</RB.NavItem>
          <RB.NavItem eventKey={'/meetings'}>Meetings</RB.NavItem>
          <RB.NavItem eventKey={'/notifications'}>Notifications</RB.NavItem>
        </RB.Nav>
      </RB.Col>
    );
  }
}

module.exports = SideNav;
