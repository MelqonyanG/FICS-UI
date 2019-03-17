#!usr/bin/python3
import telnetlib
import asyncio
from aiohttp import web
import socketio
import json

sio = socketio.AsyncServer(async_mode='aiohttp')
app = web.Application()
sio.attach(app)

with open('serverConfig.json') as json_data_file:
    data = json.load(json_data_file)
serv = data['server']

async def index(request):
    with open('./public/index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')

clientDict = {}

def connectToTelnet(sid):
    global clientDict
    tn = telnetlib.Telnet('freechess.org', 5000)
    clientDict[sid] = {"telnet" : tn}
    user = 'Guest'
    tn.read_until(b'login: ')
    data = user.encode('ascii') + b'\n'
    tn.write(data)
    tn.read_until(b':')
    data = b'\n'
    tn.write(data)
    data=tn.read_until(b'fics% ')
    data = data.decode('ascii','ignore')
    name = data.split("\n")[3]
    name = name.split(" ")[-2][:-3]
    clientDict[sid]["name"] = name
    clientDict[sid]["pgn"] = []
    return tn

def setTelnetParams(tn):
    cmd = 'set seek 0'
    data = cmd.encode('ascii') + b'\n'
    tn.write(data)
    data=tn.read_until(b'fics% ')
    data = data.decode('ascii','ignore')
    while "You will not see seek ads." not in data:
        data=tn.read_until(b'fics% ')
        data = data.decode('ascii','ignore')
    style = 'style 12'
    data = style.encode('ascii') + b'\n'
    tn.write(data)
    data=tn.read_until(b'fics% ')
    data = data.decode('ascii','ignore')
    while "Style 12 set." not in data:
        data=tn.read_until(b'fics% ')
        data = data.decode('ascii','ignore')
    block = "iset block 1"
    data = block.encode('ascii') + b'\n'
    tn.write(data)
    data=tn.read_until(b'fics% ')
    data = data.decode('ascii','ignore')
    while "block set." not in data:
        data=tn.read_until(b'fics% ')
        data = data.decode('ascii','ignore')

@sio.on('connection')
async def test_message(sid, message):
    tn = connectToTelnet(message)
    setTelnetParams(tn)
    await sio.emit("mainPage", clientDict[sid]["name"], room=sid)
    sio.start_background_task(background_task, message, tn)

async def background_task(*args):
    while args[0] in clientDict:
        await sio.sleep(0.5)
        tn = args[1]
        sid = args[0]
        try:
            name = clientDict[sid]["name"]
        except:
            break
        data=tn.read_very_eager()
        data = data.decode('ascii','ignore')
        if data and data[0] == chr(21):
            cmdNum = int(data[1: data.find(chr(22))])
            cmdCode = int(data[data.find(chr(22))+1: data.rfind(chr(22))])
            data = data[data.rfind(chr(22))+1: data.rfind(chr(23))]
            if cmdCode == 157:
                #Sought Games List
                await sio.emit("showSought", data, room=sid)
            elif cmdCode == 43:
                #Online Games List
                await sio.emit("showGames", data, room=sid)
            elif cmdCode == 146:
                #Get Online Users
                await sio.emit("showOnlineUsers", data, room=sid)
            elif cmdCode == 1:
                #Your move accepted
                dataList = data.split("\n")
                fenStr = [x for x in dataList if "<12>" in x][0]
                await sio.emit("setMyTime", fenStr, room=sid)
            elif cmdCode == 155:
                # Seek/Create Game
                await sio.emit("waitCreateGame", {"msg": data, "name": name, "subject": "unseek"}, room=sid)
            elif cmdCode == 73:
                # send Challenge
                await sio.emit("waitCreateGame", {"msg": data, "name": name, "subject": "withdraw"}, room=sid)
            elif cmdCode == 158:
                #Create sought game
                if "That seek is not available." in data:
                    await sio.emit("aviableGame", "That seek is not available.", room=sid)
                else:
                    dataList = data.split("\n")
                    try:
                        fenStr = [x for x in dataList if "<12>" in x][0]
                        await sio.emit("showSoughtGame", {"fen": fenStr, "name": name}, room=sid)
                    except:
                        await sio.emit("aviableGame", "That seek is not available.", room=sid)
            elif cmdCode == 11:
                #You accept challenge
                dataList = data.split("\n")
                try:
                    fenStr = [x for x in dataList if "<12>" in x][0]
                    await sio.emit("showSoughtGame", {"fen": fenStr, "name": name}, room=sid)
                except:
                    await sio.emit("aviableGame", "Challenge Canceled", room=sid)
                await sio.emit("thereIsChallange", "deleteChallenge", room=sid)
            elif cmdCode == 164:
                #Get Random Games
                dataList = data.split("\n")
                try:
                    fenStr = [x for x in dataList if "<12>" in x][0]
                    await sio.emit("showSoughtGame", {"fen": fenStr, "name": name}, room=sid)
                except:
                    await sio.emit("aviableGame", "Game Canceled", room=sid)
            elif cmdCode == 80:
                #Observe any online game
                dataList = data.split("\n")
                try:
                    fenStr = [x for x in dataList if "<12>" in x][0]
                    await sio.emit("showSoughtGame",  {"fen": fenStr, "name": name}, room=sid)
                except:
                    await sio.emit("aviableGame", "That game is not available.", room=sid)
            elif cmdCode == 138:
                #Unobserve
                pass
            elif cmdCode == 156:
                #Unseek
                name = clientDict[sid]["name"]
                await sio.emit("mainPage", name, room=sid)
            elif cmdCode == 103:
                #Resign
                pass
            elif cmdCode == 33:
                #decline the match
                await sio.emit("thereIsChallange", "deleteChallenge", room=sid)
        elif "Challenge:" in data:
            await sio.emit("thereIsChallange", data, room=sid)
        elif "declines the match offer" in data:
            await sio.emit("waitCreateGame", {"msg": data, "name": name, "subject": "Main Page"}, room=sid)
        elif "accepts your seek" in data or "Your seek intercepts" in data:
            dataList = data.split("\n")
            fenStr = [x for x in dataList if "<12>" in x][0]
            await sio.emit("showSoughtGame", {"fen": fenStr, "name": name}, room=sid)
        elif "<12>" in data:
            dataList = data.split("\n")
            fenStr = [x for x in dataList if "<12>" in x][0]
            await sio.emit("showSoughtGame", {"fen": fenStr, "name": name}, room=sid)
        elif "Removing game" in data:
            await sio.emit("msgDuringGame", data, room=sid)
        elif "resigns}" in data:
            await sio.emit("msgDuringGame", data, room=sid)

@sio.on('command')
async def joined(sid, userCommand):
    sid = userCommand["sid"]
    global clientDict
    tn = clientDict[sid]["telnet"]
    cmd = userCommand["cmd"]
    command = '123987001 ' + cmd + '\n'
    data = command.encode('ascii')
    tn.write(data)

@sio.on('disconnect')
async def deleteClientFromClientDict(sid):
    global clientDict
    if sid in clientDict:
        clientDict[sid]["telnet"].close()
        del clientDict[sid]
        await sio.disconnect(sid)



app.router.add_static('/public','public')
app.router.add_get('/', index)


if __name__ == '__main__':
    web.run_app(app, host=serv['host'], port=serv['port'])
