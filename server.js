const express = require("express");
const http = require("http");
const next = require("next");
const bodyParser = require("body-parser");
const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();
const myJsonWebToken = require("./server-jwt");

const app = express();
const server = http.createServer(app);

const connection = require("./server-connection");
const query = connection.query;

app.use(express.json());

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);


const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

function emitToRoom(room, path, data) {
	io.to(room).emit(path, data);
}
function StoreRoom(storeid){
	return `room/${storeid}/`
}

nextApp.prepare().then(async () => {
	var clientsMap = new Map();

	io.on("connection", (socket) => {

		socket.on("update-bills", ({storeid,message}) => {
			if(storeid){
				GetBills(storeid).then(bills => {
					io.to(StoreRoom(storeid)).emit('request-update-bills',{bills:bills,message:message});
				})
			}
		})

		socket.on('setInfo', function (data) {
			clientsMap.set(socket.id,data)
        });

		socket.on("join", (room) => {
			console.log(`${socket.id} has joined ${room}`);
			emitToRoom(room, "hello", "world");
			socket.join(room);
		});
		socket.on("disconnect", () => {
			clientsMap.delete(socket.id)
			console.log("Client disconnected");
		});

		socket.on("leave all", () => {
			const arr = findRooms(socket.id);
			arr.forEach((room) => {
				socket.leave(room);
			})
			
		});
	});
	io.of("/").adapter.on("create-room", (room) => {
		console.log(`room ${room} was created`);
	});


	app.post("/api/socket/send-message",async (req, res) => {
		const {message,storeid,token} = req.body;
		const user = await query("SELECT * FROM `user-token` WHERE token = ?",[token]);
		const userid = user.length > 0 ? user[0].userid : null;
		const pri = await query("SELECT * FROM `privileges` WHERE userid = ? and storeid = ?",[userid,storeid]);
		const privileges = pri.length > 0 ? pri[0].value : -1;

		if(privileges > 0){
			const insertRes = await query("INSERT INTO `store-message`(`storeid`, `userid`, `message`) VALUES (?,?,?)",[storeid,userid,message]);
			const messageRes = await query("SELECT * FROM `store-message` where id = ?",[insertRes.insertId]);
			io.to(StoreRoom(storeid)).emit("new-message",messageRes[0])
			res.status(200).end();
		} else{ 
			res.status(202).end();
		}
	})

	app.post("/api/socket/get-current-staffs", (req, res) => {
		const { storeid } = req.body;
		var staffs = findStaffs(StoreRoom(storeid));
		staffs = staffs.map((socketid) => {return clientsMap.get(socketid)})
		res.status(200).json(staffs);
	
	});

	app.post("/api/socket/update-bill", (req, res) => {
		const { storeid, message } = req.body;
		emitToRoom(StoreRoom(storeid), "update bills", message);
		res.status(200).end();
	});

	app.all("*",protectedMiddleware, (req, res) => nextHandler(req, res));

	server.listen(port, () => {
		console.log(`> Ready on http://localhost:${port}`);
	});
});
async function protectedMiddleware(req, res, nextHandler) {

	try{
		const token = req.headers['authorization'];
		const storeid = req.headers['storeid'];
	
		const url = req.url;
		if(url.includes('/api/store/') && storeid != null && token != null){
			const privileges = myJsonWebToken.getPrivileges(req,storeid);
			const userid = myJsonWebToken.getUserId(req)
			req.headers.userid = userid;
			req.headers.privileges = privileges;
			console.log(req.headers);
			if(privileges < 0 || privileges == null){
				res.status(202).json({message: 'Invalid call'})
				return;
			}
		}
		nextHandler();
		return;
	}catch(e) {
		res.status(401).send({message: 'Invalid call'});
		return;
	}
	
	
	
}
function getAllRooms() {
	const rooms = io.sockets.adapter.rooms.entries();
	return rooms;
}

function findStaffs(name){
	const rooms = getAllRooms();
	var arr = [];
	let result = rooms.next();
	while (!result.done) {
		
		const entry = result.value;
		const roomName = entry[0];
		const clients = entry[1]; 

		console.log(roomName,name);
		if(roomName == name) {
			console.log("into if",clients)
			clients.forEach(client => {
				arr.push(client);
			})
		};

		result = rooms.next();

	}

	return arr;
}

function findRooms(socketId) {
	const rooms = getAllRooms();
	var arr = [];
	let result = rooms.next();
	while (!result.done) {
		
		const entry = result.value;
		const roomName = entry[0];
		const clients = entry[1]; 

		if(roomName != socketId && clients.has(socketId)) {
			arr.push(roomName);
		};

		result = rooms.next();

	}

	return arr;
}

async function GetBills (storeid) {

	var bills = await query(
		"SELECT * FROM `bill` WHERE storeid =? and state = 0 order by time DESC ",
		[storeid]
	);

	for (let i in bills) {
		const items = await query(
			"SELECT * FROM `bill-row` WHERE `bill-id` = ?",
			[bills[i].id]
		);
		bills[i].items = items;
	}

	return bills
}
