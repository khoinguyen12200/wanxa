const express = require("express");
const http = require("http");
const next = require("next");
const bodyParser = require("body-parser");
const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

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

nextApp.prepare().then(async () => {
	io.on("connection", (socket) => {

		socket.on("update-bills", ({storeid,message}) => {
			if(storeid){
				GetBills(storeid).then(bills => {
					io.to(`room/${storeid}/`).emit('request-update-bills',{bills:bills,message:message});
				})
			}
			
		})

		socket.on("join", (room) => {
			console.log(`${socket.id} has joined ${room}`);
			emitToRoom(room, "hello", "world");
			socket.join(room);
		});
		socket.on("disconnect", () => {
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

	app.post("/api/socket/update-bill", (req, res) => {
		const { storeid, message } = req.body;
		console.log("fire");
		emitToRoom(`room/${storeid}/`, "update bills", message);
		res.status(200).end();
	});

	app.all("*", (req, res) => nextHandler(req, res));

	server.listen(port, () => {
		console.log(`> Ready on http://localhost:${port}`);
	});
});

function getAllRooms() {
	const rooms = io.sockets.adapter.rooms.entries();
	return rooms;
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
