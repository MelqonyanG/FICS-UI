import React from "react";

class MsgDuringGame extends React.Component {
    render() {
      var msg = this.props.msg;
      let msgList = msg.split("\n");
        return (
          <div className="container">
          <span>{msgList[1]}</span>
          <br/>
          <span>{msgList[3]}</span>
        </div>
      )}
}

export default MsgDuringGame;
