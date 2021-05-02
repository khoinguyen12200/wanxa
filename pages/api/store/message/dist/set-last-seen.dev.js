"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$headers, privileges, userid, storeid, newTime, lastSeens, updateRes, insertRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$headers = req.headers, privileges = _req$headers.privileges, userid = _req$headers.userid, storeid = _req$headers.storeid;
          newTime = new Date();
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `last-seen-message` WHERE userid = ? and storeid = ?", [userid, storeid]));

        case 4:
          lastSeens = _context.sent;

          if (!(lastSeens.length > 0)) {
            _context.next = 13;
            break;
          }

          _context.next = 8;
          return regeneratorRuntime.awrap((0, _connection["default"])("UPDATE `last-seen-message` SET `time`=? WHERE id =?", [newTime, lastSeens[0].id]));

        case 8:
          updateRes = _context.sent;
          res.status(200).end();
          return _context.abrupt("return");

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap((0, _connection["default"])("INSERT INTO `last-seen-message`(`userid`, `storeid`, `time`) VALUES (?,?,?)", [userid, storeid, newTime]));

        case 15:
          insertRes = _context.sent;
          res.status(200).end();
          return _context.abrupt("return");

        case 18:
          res.status(202).end();

        case 19:
        case "end":
          return _context.stop();
      }
    }
  });
}