# FICS-UI

FICS-UI with Python and ReactJs. This application register you in FICS as guest.

#### Features*

  - Create chess game in FICS with you prefered parameters
  - Sought and select chess game from created games
  - Send game chellange to special user and get response
  - Get random chess game
  - Get list of all online users
  - See current games' list and observe your prefered game
  - Play chess, flip board, resign or remove game

 ### Tech

FICS-UI uses a number of open source projects to work properly:
**client side**
* React js
* Bootstrap
* socket.io-client
* chessboardjs
* chess.js

**server side**
* Python3
* telnetlib
* asyncio
* aiohttp
* socketio

### Installation

FICS-UI client side requires [Node.js](https://nodejs.org/) v4+ and [npm](https://www.npmjs.com/).

Install the dependencies and start the server.
```sh
$ cd FICS-UI/
$ pip install -r requirements.txt
$ python server.py
```

Install the dependencies and start the client.
```sh
$ cd real-time-chess/client
$ npm install
$ npm start
```

Or Start the server and client at the same time:
```sh
$ chmod +x run.sh
$ ./run.sh
```
Verify the deployment by navigating to your server address in your preferred browser.

```sh
127.0.0.1:3000
```
or
```sh
localhost:3000
```
**screenshots**
![screenshot](/screenshotes/create_game.png)
![screenshot](/screenshotes/chellange.png)
![screenshot](/screenshotes/game.png)
![screenshot](/screenshotes/games.png)
![screenshot](/screenshotes/sought.png)
