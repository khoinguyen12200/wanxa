"use strict";

var express = require("express");

var http = require("http");

var next = require("next");

var bodyParser = require("body-parser");

var port = parseInt(process.env.PORT || "3000", 10);
var dev = process.env.NODE_ENV !== "production";
var nextApp = next({
  dev: dev
});
var nextHandler = nextApp.getRequestHandler();

var myJsonWebToken = require("./server-jwt");

var app = express();
var server = http.createServer(app);

var connection = require("./server-connection");

var query = connection.query;
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var io = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
});

function emitToRoom(room, path, data) {
  io.to(room).emit(path, data);
}

function StoreRoom(storeid) {
  return "room/".concat(storeid, "/");
}

nextApp.prepare().then(function _callee2() {
  var clientsMap;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          clientsMap = new Map();
          io.on("connection", function (socket) {
            socket.on("update-bills", function (_ref) {
              var storeid = _ref.storeid,
                  notification = _ref.notification;

              if (storeid) {
                GetBills(storeid).then(function (bills) {
                  io.to(StoreRoom(storeid)).emit('request-update-bills', {
                    bills: bills,
                    notification: notification
                  });
                });
              }
            });
            socket.on('setInfo', function (data) {
              clientsMap.set(socket.id, data);
            });
            socket.on("join", function (room) {
              console.log("".concat(socket.id, " has joined ").concat(room));
              emitToRoom(room, "hello", "world");
              socket.join(room);
            });
            socket.on("disconnect", function () {
              clientsMap["delete"](socket.id);
              console.log("Client disconnected");
            });
            socket.on("leave all", function () {
              var arr = findRooms(socket.id);
              arr.forEach(function (room) {
                socket.leave(room);
              });
            });
          });
          io.of("/").adapter.on("create-room", function (room) {
            console.log("room ".concat(room, " was created"));
          });
          app.post("/api/socket/send-message", protectedMiddleware, function _callee(req, res) {
            var _req$headers, userid, storeid, privileges, message, insertRes, messageRes;

            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _req$headers = req.headers, userid = _req$headers.userid, storeid = _req$headers.storeid, privileges = _req$headers.privileges;
                    message = req.body.message;

                    if (!(privileges > 0)) {
                      _context.next = 13;
                      break;
                    }

                    _context.next = 5;
                    return regeneratorRuntime.awrap(query("INSERT INTO `store-message`(`storeid`, `userid`, `message`) VALUES (?,?,?)", [storeid, userid, message]));

                  case 5:
                    insertRes = _context.sent;
                    _context.next = 8;
                    return regeneratorRuntime.awrap(query("SELECT * FROM `store-message` where id = ?", [insertRes.insertId]));

                  case 8:
                    messageRes = _context.sent;
                    io.to(StoreRoom(storeid)).emit("new-message", messageRes[0]);
                    res.status(200).end();
                    _context.next = 14;
                    break;

                  case 13:
                    res.status(202).end();

                  case 14:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });
          app.post("/api/socket/get-current-staffs", function (req, res) {
            var storeid = req.body.storeid;
            var staffs = findStaffs(StoreRoom(storeid));
            staffs = staffs.map(function (socketid) {
              return clientsMap.get(socketid);
            });
            res.status(200).json(staffs);
          });
          app.post("/api/socket/update-bill", function (req, res) {
            var _req$body = req.body,
                storeid = _req$body.storeid,
                message = _req$body.message;
            emitToRoom(StoreRoom(storeid), "update bills", message);
            res.status(200).end();
          });
          app.all("*", protectedMiddleware, function (req, res) {
            return nextHandler(req, res);
          });
          server.listen(port, function () {
            console.log("> Ready on http://localhost:".concat(port));
          });

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
});

function protectedMiddleware(req, res, nextHandler) {
  var token, storeid, userid, privileges, url;
  return regeneratorRuntime.async(function protectedMiddleware$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          token = req.headers['authorization'];
          storeid = req.headers['storeid'];
          userid = myJsonWebToken.getUserId(req);
          req.headers.userid = userid;
          privileges = myJsonWebToken.getPrivileges(req, storeid);
          req.headers.privileges = privileges;
          url = req.url;

          if (!(url.includes('/api/store/') && storeid != null && token != null)) {
            _context3.next = 13;
            break;
          }

          if (!(privileges < 0 || privileges == null)) {
            _context3.next = 13;
            break;
          }

          console.log(req.headers);
          res.status(202).json({
            error: true,
            message: 'Invalid call'
          });
          return _context3.abrupt("return");

        case 13:
          nextHandler();
          return _context3.abrupt("return");

        case 17:
          _context3.prev = 17;
          _context3.t0 = _context3["catch"](0);
          res.status(401).send({
            message: 'Invalid call'
          });
          return _context3.abrupt("return");

        case 21:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 17]]);
}

function getAllRooms() {
  var rooms = io.sockets.adapter.rooms.entries();
  return rooms;
}

function findStaffs(name) {
  var rooms = getAllRooms();
  var arr = [];
  var result = rooms.next();

  while (!result.done) {
    var entry = result.value;
    var roomName = entry[0];
    var clients = entry[1];
    console.log(roomName, name);

    if (roomName == name) {
      console.log("into if", clients);
      clients.forEach(function (client) {
        arr.push(client);
      });
    }

    ;
    result = rooms.next();
  }

  return arr;
}

function findRooms(socketId) {
  var rooms = getAllRooms();
  var arr = [];
  var result = rooms.next();

  while (!result.done) {
    var entry = result.value;
    var roomName = entry[0];
    var clients = entry[1];

    if (roomName != socketId && clients.has(socketId)) {
      arr.push(roomName);
    }

    ;
    result = rooms.next();
  }

  return arr;
}

function GetBills(storeid) {
  var bills, i, items;
  return regeneratorRuntime.async(function GetBills$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(query("SELECT * FROM `bill` WHERE storeid =? and state = 0 order by time DESC ", [storeid]));

        case 2:
          bills = _context4.sent;
          _context4.t0 = regeneratorRuntime.keys(bills);

        case 4:
          if ((_context4.t1 = _context4.t0()).done) {
            _context4.next = 12;
            break;
          }

          i = _context4.t1.value;
          _context4.next = 8;
          return regeneratorRuntime.awrap(query("SELECT * FROM `bill-row` WHERE `bill-id` = ?", [bills[i].id]));

        case 8:
          items = _context4.sent;
          bills[i].items = items;
          _context4.next = 4;
          break;

        case 12:
          return _context4.abrupt("return", bills);

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  });
}