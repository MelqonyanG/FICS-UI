import React from "react";
import ReactDOM from 'react-dom';
import {socket} from "../index";
import PlayOnline from "./PlayOnline"
import CreateGame from "./CreateGame"
import CreateChallenge from "./CreateChallenge"

class MainPage extends React.Component {
    render() {
        return (
          <div className="container">
            <div id="mainDiv">
              <h3 id="userName">Welcome {this.props.name}</h3>
                <div className="row">
                <div className="col-md-4" id="buttonDIV">
                  <button type="button" className="btn btn-default" id="createGameBTN" onClick={this.displayCrateGame}>Create Game</button>
                  <br/>
                  <button type="button" className="btn btn-default" id="soughtBTN" onClick={this.displaySought}>Sought</button>
                  <br/>
                  <button type="button" className="btn btn-default" id="challengeBTN" onClick={this.sendChallenge}>Challenge</button>
                  <br/>
                  <button type="button" className="btn btn-default" id="getGameBTN" onClick={this.getRandomGame}>Get Random Game</button>
                  <br/>
                  <button type="button" className="btn btn-default" id="gamesBTN" onClick={this.displayOnlineGames}>Games</button>
                  <br/>
                  <button type="button" className="btn btn-default" id="mainPageBTN" onClick={this.goToMainPage}>Main Page</button>
                </div>
                <div className="col-md-8">
                  <div id="displayData" style={{height: '500px'}}>
                  </div>
                </div>
              </div>
            </div>
        </div>

      )
    }
    displayCrateGame(){
      ReactDOM.render(<div><CreateGame/></div>, document.getElementById("displayData"));
    }

    displaySought(){
      socket.emit("command", {"cmd" : "sought", "sid" : socket.id});
    }

    displayOnlineGames(){
      socket.emit("command", {"cmd" : "games", "sid" : socket.id});
    }

    getRandomGame(){
      socket.emit("command", {"cmd" : "getgame", "sid" : socket.id});
    }

    sendChallenge(){
      ReactDOM.render(<div><CreateChallenge/></div>, document.getElementById("displayData"));
    }

    goToMainPage(){
      ReactDOM.render(<div><PlayOnline /></div>, document.getElementById("root"));
    }
}

export default MainPage;
