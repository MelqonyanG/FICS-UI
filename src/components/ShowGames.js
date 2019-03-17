import React from "react";
import {socket} from "../index";

class ShowGames extends React.Component {
    render() {
      let uKey = 0;
      const games = this.props.games;
      let gameStr = games.split("\n");
      gameStr = gameStr.slice(1,gameStr.length-2);
      var gameList = []
      for (let i = 0; i < gameStr.length; i++){
        if(!gameStr[i].includes("Exam.")){
          gameList.push(gameStr[i])
        }
      }
      var rows = gameList.map((game) => {
          let rowID = `row${gameList.indexOf(game)}`;
          return <li key = {uKey++} id={rowID}
          onClick={(numGame, gamesList) => this.getGame(gameList.indexOf(game), gameList)}>
                      <a style={{textAlign: 'left'}}>{game}</a>
                  </li>
    });
        return (
          <div className="container">
            <input type="text" id="myInput" onKeyUp={this.handleUserSearchKeyUp}
                  placeholder="Search for names.." title="Type in a name"/>
          <div className="scrollmenu" style={{height: "400px",weight: '70%'}}>
            <ul id="myUL">
              {rows}
            </ul>
            </div>
        </div>
      )}

      handleUserSearchKeyUp(){
        var input, filter, ul, li, a, i;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        ul = document.getElementById("myUL");
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
      }

    getGame(num, games){
        let selectedGame = games[num];
        var gamenum = selectedGame.slice(0,4).replace(/\s/g, '');
        socket.emit('command', {"cmd": 'observe ' + gamenum, "sid": socket.id});
      }
}

export default ShowGames;
