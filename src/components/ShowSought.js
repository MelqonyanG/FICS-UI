import React from "react";
import {socket} from "../index";

class ShowSought extends React.Component {
    render() {
      let uKey = 0;
      const sought = this.props.sought;
      let soughtList = sought.split("\n");
      soughtList = soughtList.slice(0,soughtList.length-2);
      var newSought = []
      for (let i = 0; i < soughtList.length; i++){
        if(!soughtList[i].includes("crazyhous")){
          newSought.push(soughtList[i]);
        }
      }
      soughtList = newSought;
      var rows = soughtList.map((sought) => {
          let rowID = `row${soughtList.indexOf(sought)}`;
          return <li key = {uKey++} id={rowID} onClick={(numSought) => this.getSought(soughtList.indexOf(sought))}>
                      <a style={{textAlign: 'left'}}>{sought}</a>
                  </li>
    });
        return (
          <div className="container">
            <input type="text" id="myInput" onKeyUp={this.handleUserSearchKeyUp}
                  placeholder="Search for names.." title="Type in a name"/>
                  <div className="scrollmenu" style={{height: '400px',weight: '70%'}}>
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

    getSought(num){
        const sought = this.props.sought;
        let soughtList = sought.split("\n");
        let selectedSought = soughtList[num];
        var gamenum = selectedSought.slice(0,4).replace(/\s/g, '');
        socket.emit('command', {"cmd": 'play ' + gamenum, "sid": socket.id});
      }
}

export default ShowSought;
