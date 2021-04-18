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
		console.log("New client connected");

		socket.on("join", (room) => {
			socket.join(room);
			emitToRoom(room, "hello", "world");
		});
		socket.on("disconnect", () => {
			console.log("Client disconnected");
		});
	});
	io.of("/").adapter.on("create-room", (room) => {
		console.log(`room ${room} was created`);
	});

	app.post("/api/socket/update-bill", (req, res) => {
		const { storeid,message } = req.body;
        console.log('fire')
		emitToRoom(`room/${storeid}/`, "update bills", message);
		res.status(200).end();
	});

	app.all("*", (req, res) => nextHandler(req, res));

	server.listen(port, () => {
		console.log(`> Ready on http://localhost:${port}`);
	});
});
