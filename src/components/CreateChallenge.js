import React from 'react';
import {socket} from "../index";

class CreateChallenge extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    'turn': "white",
    'type' : "rated",
    'time': 3,
    'inc' : 0
  };
  this.createGame = this.createGame.bind(this);
}

    render() {
        return (
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h4>User: </h4>
                <input type="text" id="user"/>
                <h4>Minutes per side: </h4>
                <input type="number" id="time" min="0" defaultValue="3"/>
                <h4>Increment In seconds:</h4>
                <input type="number" id="inc" min="0" defaultValue="0"/>
                <br/>
                <h4>Color:</h4>
                <button type="button" className="btn btn-default" id="wturn" onClick={(trn) => this.selectTrn("white")} style={{backgroundColor: "#FFFFFF", border: "3px solid #28a745"}}>White</button>
                <button type="button" className="btn btn-default" id="bturn" onClick={(trn) => this.selectTrn("black")} style={{backgroundColor: "#000000", color:"#FFFFFF"}}>Black</button>
                <br/>
                <br/><br/><br/>
                <button type="button" className="btn btn-success" id="createGameBTN" onClick={this.createGame}>Send Challenge</button>
              </div>
              <div className="col-md-6">
                <button type="button" className="btn btn-success" id="getUsersBTN" onClick={this.getOnlineUsers}>Get Online Users</button>
                <br/>
                <div id="displayUsers" style={{height: '500px',weight: '70%'}}>
                </div>
              </div>
            </div>
          </div>
      )
    }

    getOnlineUsers(){
      socket.emit('command', {"cmd": "who as", "sid": socket.id});

    }

    selectTrn(trn){
      this.setState({turn: trn});
      if(trn === "white"){
        document.getElementById("bturn").style.border = "";
        document.getElementById("wturn").style.border = "3px solid #28a745";
      }
      else{
        document.getElementById("wturn").style.border = "";
        document.getElementById("bturn").style.border = "3px solid #28a745";
      }
    }

    createGame(){
      const name = document.getElementById("user").value;
      const turn = this.state.turn;
      const time = document.getElementById("time").value;
      const inc = document.getElementById("inc").value;
      socket.emit("command", {"cmd" : "match " + name + " " + time + " " + inc + " " + turn,
      "sid": socket.id})
    }
}

export default CreateChallenge;
