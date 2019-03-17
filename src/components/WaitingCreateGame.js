import React from 'react';
import ReactDOM from 'react-dom';
import {socket} from "../index";
import MainPage from "./MainPage"

class WaitingCreateGame extends React.Component {
  constructor(props) {
    super(props);
    this.unseekGame = this.unseekGame.bind(this);
  }
  render() {
    let uKey = 1;
    var msg = this.props.msg;
    let msgList = msg.split("\n");
    var rows = msgList.map((msg) => {
        let rowID = `row${msgList.indexOf(msg)}`;
        return <tr key = {uKey++} id={rowID}>
                    <td>{msg}</td>
                </tr>
  });
      return (
        <div className="container">
          <div id="mainDiv">
            <h3 id="userName">Welcome {this.props.name}</h3>
              <div className="row">
              <div className="col-md-4" id="buttonDIV">
                <button type="button" className="btn btn-default" id="unseekBTN" onClick={this.unseekGame}>{this.props.subject}</button>
                <br/>
              </div>
              <div className="col-md-8">
                <div className="scrollmenu" id="displayData" style={{height: '500px'}}>
                <table id="simple-board">
                  <tbody>
                  {rows}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </div>
      </div>

    )
  }
      unseekGame(){
        const subject = this.props.subject;
        if(subject === "Main Page"){
          ReactDOM.render(<div><MainPage name={this.props.name}/></div>, document.getElementById("root"));
        }else{
          socket.emit('command', {"cmd": subject, "sid": socket.id});
        }
      }
}

export default WaitingCreateGame;
