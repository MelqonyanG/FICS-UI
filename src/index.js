import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.css'
import * as $ from 'jquery';
import '../node_modules/chessboardjs/www/css/chessboard.css'
import PlayOnline from "./components/PlayOnline"
import MainPage from "./components/MainPage"
import ShowSought from "./components/ShowSought"
import ShowGames from "./components/ShowGames.js"
import ShowUsers from "./components/ShowUsers"
import AviableGame from "./components/AviableGame"
import ShowSoughtGame from "./components/ShowSoughtGame"
import WaitingCreateGame from "./components/WaitingCreateGame"
import MsgDuringGame from "./components/MsgDuringGame"
import AcceptOrDeclineChallange from "./components/AcceptOrDeclineChallange"
import Clock from "./components/Clock"
import data from './clientConfig.json';
import './app.css';


window.jQuery = window.$ = $;

var socket = io.connect(data.server.host + ':' + data.server.port);

// Show first: Play Online page
socket.on('connect', function () {
  ReactDOM.render(<div><PlayOnline /></div>, document.getElementById("root"));
});

// After connection with server show Main page with buttons:
// Creat game, Sought, Games and Main Page
socket.on('mainPage', function (data) {
    ReactDOM.render(<div><MainPage name={data}/></div>,
      document.getElementById("root"));
});

//Show list of sought games
socket.on('showSought', function (data) {
  if(document.getElementById("displayData") !== null){
    ReactDOM.render(<div><ShowSought sought={data}/></div>,
      document.getElementById("displayData"));
  }
});

//Show list of online games
socket.on('showGames', function (data) {
  if(document.getElementById("displayData") !== null){
    ReactDOM.render(<div><ShowGames games={data}/></div>,
      document.getElementById("displayData"));
  }
});

//Show list of online users
socket.on('showOnlineUsers', function (data) {
  if(document.getElementById("displayUsers") !== null){
    ReactDOM.render(<div><ShowUsers users={data}/></div>,
       document.getElementById("displayUsers"));
  }
});

//Display created game board before start game
socket.on('waitCreateGame', function (data) {
  ReactDOM.render(<div><WaitingCreateGame msg={data["msg"]}
    name={data["name"]} subject={data["subject"]}/></div>,
    document.getElementById("root"));
});

socket.on('thereIsChallange', function (data) {
  if(data === "deleteChallenge"){
    ReactDOM.render(<div></div>, document.getElementById("forChallange"));
  }else{
    ReactDOM.render(<div><AcceptOrDeclineChallange msg={data}
      /></div>, document.getElementById("forChallange"));
  }
});

//Display chosen sought game
socket.on('showSoughtGame', function (data) {
  ReactDOM.render(<div><ShowSoughtGame data={data["fen"]}
  name={data["name"]}/></div>, document.getElementById("root"));
});

socket.on('setMyTime', function (data) {
    if(document.getElementById('clockDIV') !== null){
      ReactDOM.render(<Clock data={data}/>,
        document.getElementById("clockDIV"));
    }
});


//Inform user that the game is not available
socket.on('aviableGame', function (data) {
  if(document.getElementById("displayData") !== null){
    ReactDOM.render(<div><AviableGame msg={data} /></div>,
      document.getElementById("displayData"));
  }
});

//Send Messages user during game
socket.on('msgDuringGame', function (data) {
  if(document.getElementById("displayMSG") !== null){
    ReactDOM.render(<div><MsgDuringGame msg={data} /></div>,
      document.getElementById("displayMSG"));
  }
});

export {socket};
