import React from "react";
import {socket} from "../index";

class AcceptOrDeclineChallange extends React.Component {
    render() {
      var msg = this.props.msg;
      let msgList = msg.split("\n");
        return (
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <span>{msgList[1]}</span>
                <br/>
                <span>You can accept or decline</span>
              </div>
              <div className="col-md-4">
                <button type="button" className="btn btn-default btn-sm" id="acceptBTN" onClick={this.accept}>Accept</button>
                <button type="button" className="btn btn-default btn-sm" id="declineBTN" onClick={this.decline}>Decline</button>
              </div>
            </div>
        </div>
      )}

      accept(){
        socket.emit('command',{"cmd" : 'accept', "sid" : socket.id});
      }

      decline(){
        socket.emit('command',{"cmd" : 'decline', "sid" : socket.id});
      }
}

export default AcceptOrDeclineChallange;
