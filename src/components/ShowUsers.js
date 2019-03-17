import React from "react";

class ShowUsers extends React.Component {
    render() {
      let uKey = 0;
      const users = this.props.users;
      let userStr = users.split("\n");
      userStr = userStr.slice(1, userStr.length-3);
      var userList = [];
      for(let i = 0; i < userStr.length; i++){
        var user = userStr[i].split(/\s+/);
        for(var j = 0; j < user.length; j++){
          if(!user[j].includes(".") && user[j] !== ""){
            userList.push(user[j]);
          }
        }
      }
      var userData = [];
      var num = 1;
      for(var k = 0; k < userList.length - 1; k+=2){
        userData.push((num++) + ". " + userList[k] + " " + userList[k+1])
      }
      var rows = userData.map((user) => {
          let rowID = `row${userData.indexOf(user)}`;
          return <li key = {uKey++} id={rowID}
          onClick={(usr) => this.getUser(user)}>
                      <a style={{textAlign: 'left'}}>{user}</a>
                  </li>
    });
        return (
          <div className="container">
            <input type="text" id="myInput" onKeyUp={this.handleUserSearchKeyUp}
                  placeholder="Search for names.." title="Type in a name"/>
                  <div className="scrollmenu" style={{height: '380px',weight: '70%'}}>
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

  getUser(user){
    var userData = user.split(" ");
    var userName = userData[userData.length - 1];
    if(userName.indexOf("(") !== -1){
      userName = userName.substring(0, userName.indexOf("("));
    }
    if(document.getElementById("user") !== null){
      document.getElementById("user").value = userName;
    }
  }
}

export default ShowUsers;
