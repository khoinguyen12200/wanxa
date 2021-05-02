"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _querySample = require("../../const/querySample");

var _jwt = require("../../const/jwt");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var message, _req$headers, privileges, userid, storeid, insertRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          message = req.body.message;
          _req$headers = req.headers, privileges = _req$headers.privileges, userid = _req$headers.userid, storeid = _req$headers.storeid;
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _connection["default"])("INSERT INTO `store-message`(`storeid`, `userid`, `message`) VALUES (?,?,?)", [storeid, userid, message]));

        case 4:
          insertRes = _context.sent;
          res.status(200).end();

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}