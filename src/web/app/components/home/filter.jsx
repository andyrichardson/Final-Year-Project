const RB = require('react-bootstrap');
const React = require('react');
const ReactDOM = require('react-dom');
const DatePicker = require('react-datepicker');
const TimePicker = require('rc-time-picker');
const Moment = require('moment');

class Filter extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      day: Moment().startOf('day'),
      start: null,
      finish: null
    }
  }

  // Setting day
  dateChange(d){
    this.setState({day: d});
  }

  // Setting start time
  startChange(time){
    this.setState({start: time});
  }

  // Setting end time
  endChange(time){
    this.setState({finish: time});
  }

  // Apply filter
  applyFilter(){
    let start = this.state.start;
    let finish = this.state.finish;
    const day = this.state.day;

    if(start === null || finish === null){
      start = Moment().startOf('day');
      finish = Moment().endOf('day');
    }

    start.date(day.date());
    start.month(day.month());
    start.year(day.year());

    finish.date(day.date());
    finish.month(day.month());
    finish.year(day.year());

    return this.props.applyFilter(start, finish);
  }

  // Clear filter
  clearFilter(){
    this.props.clearFilter();
    this.setState({
      day: Moment().startOf('day'),
      start: null,
      finish: null
    })
  }

  render(){
    return (
      <div>
        <h2>Filter</h2>

        <RB.Row>
          <DatePicker inline selected={this.state.day} onChange={(d) => this.dateChange(d)}/>
        </RB.Row>

        <RB.Row>
          <TimePicker showSecond={false} value={this.state.start} onChange={(d) => this.startChange(d)} />
          {" - "}
          <TimePicker showSecond={false} value={this.state.finish} onChange={(d) => this.endChange(d)} />
        </RB.Row>

        <RB.Row>
          <RB.Button onClick={()=>this.applyFilter()}>Apply</RB.Button>
          <RB.Button onClick={() => this.clearFilter()}>Reset</RB.Button>
        </RB.Row>
      </div>
    );
  }
}

module.exports = Filter;
