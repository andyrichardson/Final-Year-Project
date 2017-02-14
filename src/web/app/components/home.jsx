const RB = require('react-bootstrap');
const React = require('react');
const ReactDOM = require('react-dom');
const Api = require('../includes/api');

const AddSlot = require('./home/addSlot.jsx');
const SlotListing = require('./home/slotListing.jsx');

class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(){
    this.getFeed();
  }

  componentDidMount(){
    this.setState({intervalHandle: setInterval(()=>this.getFeed(), 2000)});
  }

  componentWillUnmount(){
    clearTimeout(this.state.intervalHandle);
  }

  getFeed(){
    Api.getFeed(this.props.accessToken)
    .then((data) => {
      this.setState({feed: data.message});
    })
  }

  showFeed(){
    if(this.state.feed === undefined){
      return <div>No feed</div>
    }

    return this.state.feed.map((el) => {
      return (
        <div key={el.id}>
          <SlotListing
            id={el.id}
            start={el.start}
            finish={el.finish}
            username={el.username}
            user={this.props.user}
            accessToken={this.props.accessToken}
            />
        </div>
      );
    })
  }

  render(){
    return(
      <RB.Col md={8} mdOffset={2}>
        <AddSlot accessToken={this.props.accessToken}/>
        {this.showFeed()}
      </RB.Col>
    );
  }
}

module.exports = Home;
