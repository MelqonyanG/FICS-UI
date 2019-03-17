import React from 'react';
import ReactDOM from 'react-dom';
import {socket} from "../index";
import Chess from "../../node_modules/chess.js/chess";
import ChessBoard from "chessboardjs";
import ShowPgn from './ShowPgn.js'
import Clock from './Clock.js'
import MainPage from "./MainPage"

class ShowSoughtGame extends React.Component {
  constructor(props) {
    super(props);
    var data = this.props.data;
    var dataList = data.split(" ");
    var myName = this.props.name;
    var whitePlayer = dataList[17];
    this.state = {
      startFen: this.getFen(),
      flip : (dataList[19] === "0") ? "white" : (myName === whitePlayer) ? "white" : "black",
      pgn: (dataList[29] === "none") ? [] : [dataList[29]]
    }
    this.removeGame = this.removeGame.bind(this);
    this.flipBoard = this.flipBoard.bind(this);
    this.resignGame = this.resignGame.bind(this);
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

    componentWillReceiveProps(nextProps){
      var data = nextProps.data;
      if(document.getElementById('clockDIV') !== null){
        ReactDOM.render(<Clock data={data}/>,
          document.getElementById("clockDIV"));
      }
      var dataList = data.split(" ");
      var san = dataList[29];
      var oldPgn = this.state.pgn;
      if(san !== "none"){
        oldPgn.push(san);
        this.setState({
          pgn: oldPgn,
        });
      }
    }

    getFen(){
      var data = this.props.data;
      var dataList = data.split(" ");
      var turn = dataList[9];
      var shortCastlingWhite = dataList[11];
      var longCastlingWhite = dataList[12];
      var shortCastlingWBlack = dataList[13];
      var longCastlingBlack = dataList[14];
      var fenList = dataList.slice(1,9);
      var fen = fenList.join("/");
      var s = "--------"
      for(var i = 0; i < 8; i++){
        for(var j = 0; j < fen.length; j++){
          fen = fen.replace(s, s.length);
        }
        s = s.slice(0, s.length - 1);
      }
      fen += (turn === "W") ? " w" : " b";
      if(parseInt(shortCastlingWhite, 10)+parseInt(longCastlingWhite, 10)+
      parseInt(shortCastlingWBlack,10)+parseInt(longCastlingBlack,10) === 0){
        fen += " -";
      }else{
        fen += " ";
        fen += (shortCastlingWhite === "1") ? "K" : "";
        fen += (longCastlingWhite === "1") ? "Q" : "";
        fen += (shortCastlingWBlack === "1") ? "k" : "";
        fen += (longCastlingBlack === "1") ? "q" : "";
      }
      fen += " - 0 1"
      return fen;
    }
    render() {
      var myName = this.props.name;
      var data = this.props.data;
      var dataList = data.split(" ");
      var gameNumber = dataList[16];
      var whitePlayer = dataList[17];
      var blackPlayer = dataList[18];
      var myRelation = dataList[19];
      var whitePow = dataList[22];
      var blackPow = dataList[23];
      var myTurn = (myName === whitePlayer) ? "white" : "black";
      var whiteTime = this.secondsToTime(parseInt(dataList[24],10));
      var blackTime = this.secondsToTime(parseInt(dataList[25],10));
      let whiteClock = <button  className="btn-sm bg-light text-black" disabled>{whitePlayer}  {whiteTime.m} : {whiteTime.s}</button>
      let blackClock = <button  className="btn-sm bg-dark text-white" disabled>{blackPlayer}  {blackTime.m} : {blackTime.s}</button>
      if(document.getElementById('pgnList') !== null){
        ReactDOM.render(<div><ShowPgn property={this.props} pgn={this.state.pgn}
          startFen={this.state.startFen} turn={myTurn}/></div>, document.getElementById("pgnList"));
      }
      var relation = (myRelation === "0") ? "observing" : "playing";
      var msg = (<div>
            <span><b>{myName}</b> you are now {relation} game {gameNumber}</span>
            <br/>
            <span>{whitePlayer}: White material strength is {whitePow}</span>
            <br/>
            <span>{blackPlayer}: Black material strength is {blackPow}</span>
        </div>);
        return (
          <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className="row" id="clockDIV">
                    <div className="col-md-6">
                      {whiteClock}
                    </div>
                    <div className="col-md-6">
                      {blackClock}
                    </div>
                  </div>
                  <div className="row">
                  <div id="chessboard" style={{"width": "500px"}}></div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="container">
                    <div className="scrollmenu" id="displayPGN" style={{height: '500px',weight: '70%'}}>
                      <h1 style={{textAlign: 'center'}}>PGN</h1>
                      <hr/>
                      <div id="pgnList"></div>
                    </div>
                  </div>
                </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-md-8">
                  <div className="scrollmenu" id="displayMSG" style={{height: '100%',weight: '100%'}}>
                      {msg}
                  </div>
                </div>
                <div className="col-md-4">
                  <button type="button" className="btn btn-default btn-sm" id="flipBoardBTN" onClick={this.flipBoard}>Flip Board</button>
                  <br/>
                  <button type="button" className="btn btn-default btn-sm" id="removeGameBTN" onClick={this.removeGame}>Remove</button>
                  <br/>
                  <button type="button" className="btn btn-default btn-sm" id="resignGameBTN" onClick={this.resignGame}>{(myRelation === "0") ? "Unobserve Game" : "Resign"}</button>
                  <br/>
                </div>
              </div>
          </div>
      )}
    resignGame(){
        var data = this.props.data;
        var dataList = data.split(" ");
        var myRelation = dataList[19];
        if(myRelation === "0"){
          socket.emit('command',{"cmd" : 'unobserve', "sid" : socket.id});
        }else{
          socket.emit('command',{"cmd" : 'resign', "sid" : socket.id});
        }
      }

    removeGame(){
        var data = this.props.data;
        var dataList = data.split(" ");
        var myRelation = dataList[19];
        if(myRelation === "0"){
          socket.emit('command',{"cmd" : 'unobserve', "sid" : socket.id});
        }else{
          socket.emit('command',{"cmd" : 'resign', "sid" : socket.id});
        }
        ReactDOM.render(<div><MainPage name={this.props.name}/></div>, document.getElementById("root"));
      }

    flipBoard(){
      const flip = this.state.flip;
        if(flip === "white"){
          this.setState({flip : "black"});
        }else{
          this.setState({flip : "white"});
        }
      }

    componentDidUpdate(prevProps){
      this.updateComponent();
     }

    componentDidMount() {
      this.updateComponent()
      }

    updateComponent(){
        var data = this.props.data;
        var dataList = data.split(" ");
        var fen = this.getFen();
        const PropsList = this.props;
        var turn = this.state.flip;
        var oldPgn = this.state.pgn;
        var sFen = this.state.startFen;
        var myTurn = (this.props.name === dataList[17]) ? "white" : "black";
        var draggable = (dataList[19] === "0") ? false : true;
        var board,
        move,
        game = new Chess(fen);
        var onDragStart = function(source, piece, position, orientation) {
          if(turn.charAt(0) === 'w'){
            if (game.in_checkmate() === true || game.in_draw() === true ||
            piece.search(/^b/) !== -1) {
              return false;
            }
          }else{
            if (game.in_checkmate() === true || game.in_draw() === true ||
            piece.search(/^w/) !== -1) {
            return false;
            }
          }
        };

        var onDrop = function(source, target) {
          move = game.move({
          from: source,
          to: target,
          promotion: 'q'
          });

          if (move === null) return 'snapback';
        };

        var onSnapEnd = function() {
          board.position(game.fen());
          var lastMove = game.history()[(game.history()).length - 1];
          oldPgn.push(lastMove);
          ReactDOM.render(<div><ShowPgn property={PropsList} pgn={oldPgn}
            startFen={sFen} turn={myTurn}/></div>,
            document.getElementById("pgnList"));
          socket.emit('command', {"cmd":move.from + '-' + move.to, "sid" : socket.id});
        };

        var cfg = {
          draggable: draggable,
          orientation: turn,
          position:fen,
          onDragStart: onDragStart,
          onDrop: onDrop,
          onSnapEnd: onSnapEnd
        };
        board = ChessBoard('chessboard', cfg);
    }
}

export default ShowSoughtGame;
