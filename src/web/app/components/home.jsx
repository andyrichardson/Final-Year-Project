const RB = require('react-bootstrap');
const React = require('react');
const ReactDOM = require('react-dom');
const Api = require('../includes/api');

const AddSlot = require('./home/addSlot.jsx');
const SlotListing = require('./home/slotListing.jsx');
const Filter = require('./home/filter.jsx');

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
    let start, finish;

    if(this.state.start !== undefined && this.state.finish !== undefined){
      start = this.state.start.unix();
      finish = this.state.finish.unix();
    }

    return Api.getFeed({accessToken: this.props.accessToken, start: start, finish: finish})
    .then((data) => {
      this.setState({feed: data.message});
    })
  }

  applyFilter(start, finish){
    this.setState({start: start, finish: finish});
  }

  clearFilter(){
    this.setState({start: undefined, finish: undefined});
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
      <RB.Grid>
        <RB.Row>
          <RB.Col md={8} mdOffset={2}>
            <AddSlot accessToken={this.props.accessToken}/>
          </RB.Col>
        </RB.Row>

        <RB.Row>
          <RB.Col md={4}>
            <Filter applyFilter={(s, f)=>this.applyFilter(s, f)} clearFilter={()=>this.clearFilter()}/>
          </RB.Col>

          <RB.Col md={8}>
            {this.showFeed()}
          </RB.Col>
        </RB.Row>
      </RB.Grid>
    );
  }
}

module.exports = Home;
