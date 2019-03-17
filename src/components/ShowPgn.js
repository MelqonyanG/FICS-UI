import React from "react";
import Chess from "../../node_modules/chess.js/chess";
import ReactDOM from 'react-dom';
import ChessBoard from "chessboardjs";
import ShowSoughtGame from "./ShowSoughtGame"

class ShowPgn extends React.Component {
    render() {
      let pgnSan = this.props.pgn;
      let pgnStr = [];
      const data = this.props.property;
      var dataList = data["data"].split(" ");
      var myRelation = dataList[19];
      var moveCount = dataList[26];
      let num = (myRelation === "0") ? (parseInt(moveCount, 10) - pgnSan.length) : 1;
      let uKey = 1;
      for (let g = 0; g < pgnSan.length - 1; g += 2) {
        pgnStr.push(<span key = {uKey++}>
          <span onClick={(step) => this.setStep(g)}>{(num++)  + ". " +pgnSan[g]}</span>{'\u00A0'}
        <span onClick={(step) => this.setStep(g+1)}>{pgnSan[g + 1] + " "}</span>  </span>);
    }
    if (pgnSan.length % 2 === 1) {
      pgnStr.push(<span key = {uKey++}>
        <span onClick={(step) => this.setStep(pgnSan.length - 1)}>{(num++)  + ". " + pgnSan[pgnSan.length - 1]}</span></span>)
    }
        return (
          <div className="container">
                {pgnStr}
          </div>
      )
    }
    setStep(num){
      const pgn = this.props.pgn;
      const data = this.props.property;
      var dataList = data["data"].split(" ");
      var turn = dataList[9];
      console.log(this.props.turn);
      const step = ((turn === "B" && pgn.length % 2 ===1) ||
            (turn === "W" && pgn.length % 2 === 0)) ? true : false;
      if((num === pgn.length - 1) && step){
        ReactDOM.render(<div><ShowSoughtGame data={data["data"]} name={data["name"]}
        /></div>, document.getElementById("root"));
      }else{
        const chessSelect = new Chess(this.props.startFen);
        for (var i = 0; i <= num; i++) {
          chessSelect.move(pgn[i]);
        }
        var cfg = {
          orientation: this.props.turn,
          position:chessSelect.fen()
        };
        ChessBoard('chessboard', cfg);
      }
    }
}

export default ShowPgn;
