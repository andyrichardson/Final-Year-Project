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
      start: Moment().seconds(0),
      finish: Moment().add(1, 'd').seconds(0)
    };
  }

  /* SET START DATE */
  setStartDate(date){
    const start = this.state.start;

    date.hour(start.hour());
    date.minute(start.minute());

    this.setState({start: date});
  }

  /* SET FINISH DATE */
  setFinishDate(date){
    const finish = this.state.finish;

    date.hour(finish.hour());
    date.minute(finish.minute());

    this.setState({finish: date});
  }

  /* SET START TIME */
  setStartTime(time){
    const start = this.state.start;

    time.date(start.date());
    time.month(start.month());
    time.year(start.year());

    this.setState({start: time});
  }

  /* SET FINISH TIME */
  setFinishTime(time){
    const finish = this.state.finish;

    time.date(finish.date());
    time.month(finish.month());
    time.year(finish.year());

    this.setState({finish: time});
  }

  /* SUBMIT HANDLER */
  onSubmit(){
    const data = {
      start: this.state.start.unix(),
      finish: this.state.finish.unix(),
      accessToken: this.props.accessToken
    };

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
              <DatePicker selected={this.state.start} onChange={(d)=>this.setStartDate(d)}/>
              <TimePicker showSecond={false} onChange={(t)=>this.setStartTime(t)}/>
            </RB.Col>
            <RB.Col md={6}>
              <DatePicker selected={this.state.finish} onChange={(d)=>this.setFinishDate(d)}/>
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
