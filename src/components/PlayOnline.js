import React from "react";
import {socket} from "../index";

class PlayOnline extends React.Component {
    render() {
        return (
          <div className="container">
                <button type="button" className="btn btn-default" id="playOnlineBTN" onClick={this.playOnline}>Play Online</button>
          </div>
      )
    }
    playOnline(){
          socket.emit('connection', socket.id);
          document.getElementById("playOnlineBTN").style.disabled = 'disabled';
    }
}

export default PlayOnline;
