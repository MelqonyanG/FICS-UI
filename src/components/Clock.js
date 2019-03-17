import React from 'react';

class Clock extends React.Component {
  constructor(props) {
    super(props);
    var data = this.props.data;
    var dataList = data.split(" ");
    this.state = {
          whiteTime: this.secondsToTime(parseInt(dataList[24],10)),
          whiteSeconds: parseInt(dataList[24],10),
          blackTime: this.secondsToTime(parseInt(dataList[25],10)),
          blackSeconds: parseInt(dataList[25],10)
        };
    this.whiteTimer = 0;
    this.blackTimer = 0;
    this.countDownWhite = this.countDownWhite.bind(this);
    this.countDownBlack = this.countDownBlack.bind(this);
  }

  componentWillReceiveProps(nextProps){
    var data = nextProps.data;
    var dataList = data.split(" ");
    var turn = dataList[9];
    if(turn === "W"){
      //set white clock
      clearInterval(this.whiteTimer);
      clearInterval(this.blackTimer);
      this.setState({
        whiteTime: this.secondsToTime(parseInt(dataList[24],10)),
        whiteSeconds: parseInt(dataList[24],10),
        blackTime: this.secondsToTime(parseInt(dataList[25],10)),
        blackSeconds: parseInt(dataList[25],10)
      });
      this.whiteTimer = setInterval(this.countDownWhite, 1000);
    }else if(turn === "B"){
      //set black clock
      clearInterval(this.whiteTimer);
      clearInterval(this.blackTimer);
      this.setState({
        whiteTime: this.secondsToTime(parseInt(dataList[24],10)),
        whiteSeconds: parseInt(dataList[24],10),
        blackTime: this.secondsToTime(parseInt(dataList[25],10)),
        blackSeconds: parseInt(dataList[25],10)
      });
      this.blackTimer = setInterval(this.countDownBlack, 1000);
    }
  }

  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);
    let divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
    if(seconds < 10){
      seconds  = "0" + seconds;
    }
    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  countDownWhite() {
    let seconds = this.state.whiteSeconds - 1;
    if (seconds >= 0) {
      this.setState({
        whiteTime: this.secondsToTime(seconds),
        whiteSeconds: seconds,
      });
    }
    if (seconds === 0) {
      clearInterval(this.whiteTimer);
    }
  }

  countDownBlack() {
    let seconds = this.state.blackSeconds - 1;
    if(seconds >= 0){
      this.setState({
        blackTime: this.secondsToTime(seconds),
        blackSeconds: seconds,
      });
    }
    if (seconds === 0) {
      clearInterval(this.blackTimer);
    }
  }

  render() {
    var data = this.props.data;
    var dataList = data.split(" ");
    var whitePlayer = dataList[17];
    var blackPlayer = dataList[18];
    var whiteTime = this.state.whiteTime;
    var blackTime = this.state.blackTime;
    let whiteClock = <button  className="btn-sm bg-light text-black" disabled>{whitePlayer}  {whiteTime.m} : {whiteTime.s}</button>
    let blackClock = <button  className="btn-sm bg-dark text-white" disabled>{blackPlayer}  {blackTime.m} : {blackTime.s}</button>
    return(
      <div className="row" id="clockDIV" style={{width: '100%'}}>
        <div className="col-md-6">
          {whiteClock}
        </div>
        <div className="col-md-6">
          {blackClock}
        </div>
      </div>
    );
  }
}

export default Clock;
