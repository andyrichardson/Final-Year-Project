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

  /* GET FEED */
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

  /* APPLY FILTER */
  applyFilter(start, finish){
    this.setState({start: start, finish: finish}, () => this.getFeed());
  }

  /* CLEAR FILTER */
  clearFilter(){
    this.setState({start: undefined, finish: undefined}, () => this.getFeed());
  }

  showFeed(){
    if(this.state.feed === undefined){
      return <div className="homeFeed">No feed</div>
    }

    const feed = this.state.feed.map((el) => {
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
    });

    return (
      <div className="homeFeed">
        {feed}
      </div>
    );
  }

  render(){
    return(
      <RB.Grid fluid>
          <RB.Col md={8}>
            <RB.Row>
              <AddSlot accessToken={this.props.accessToken}/>
            </RB.Row>
            <RB.Row>
              {this.showFeed()}
            </RB.Row>
          </RB.Col>

          <RB.Col md={4}>
            <Filter applyFilter={(s, f)=>this.applyFilter(s, f)} clearFilter={()=>this.clearFilter()}/>
          </RB.Col>
      </RB.Grid>
    );
  }
}

module.exports = Home;
