const RB = require('react-bootstrap');
const React = require('react');
const ReactDOM = require('react-dom');
const DatePicker = require('react-datepicker');
const TimePicker = require('rc-time-picker');
const Moment = require('moment');
const Api = require('../../includes/api');

class AddSlot extends React.Component{
  /* CONSTRUCTOR */
  constructor(props){
    super(props)
    this.state = {
      date: Moment(),
      start: Moment().seconds(0),
      finish: Moment().seconds(0).add(1, 'h')
    };
  }

  /* SET START DATE */
  setStartDate(date){
    const start = this.state.start;
    this.setState({date: date});
  }

  /* SET START TIME */
  setStartTime(time){
    this.setState({start: time});
  }

  /* SET FINISH TIME */
  setFinishTime(time){
    this.setState({finish: time});
  }

  /* PREPARE DATA */
  prepareData(){
    const date = this.state.date;
    const start = this.state.start;
    const finish = this.state.finish;

    // Set start
    start.date(date.date());
    start.month(date.month());
    start.year(date.year());

    // Set finish
    finish.date(date.date());
    finish.month(date.month());
    finish.year(date.year());

    if(start.unix() > finish.unix()){
      finish.date(finish.date() + 1);
    }

    return {
      start: start.unix(),
      finish: finish.unix(),
      accessToken: this.props.accessToken
    };
  }

  /* SUBMIT HANDLER */
  onSubmit(){
    const data = this.prepareData();

    return Api.createSlot(data)
    .then(function(data){
      if(data.status != 200){
        return alert(data.message);
      }

      alert("Slot succesfully created");
    });
  }

  /* RENDER */
  render(){
    return(
      <RB.Row className={"addSlot"}>
        <RB.Col xs={12}>
          <h1>Add Slot</h1>
          <div>
            <RB.Col md={6}>
              <DatePicker selected={this.state.date} onChange={(d)=>this.setStartDate(d)}/>
              <TimePicker showSecond={false} onChange={(t)=>this.setStartTime(t)}/>
            </RB.Col>
            <RB.Col md={6}>
              <TimePicker showSecond={false} onChange={(t)=>this.setFinishTime(t)}/>
            </RB.Col>
            <RB.Button bsClass="btn pull-right" onClick={()=>this.onSubmit()}>Add</RB.Button>
          </div>
        </RB.Col>
      </RB.Row>
    );
  }
}

module.exports = AddSlot;
