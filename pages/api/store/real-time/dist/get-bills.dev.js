"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$headers, privileges, userid, storeid, bills, i, items;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$headers = req.headers, privileges = _req$headers.privileges, userid = _req$headers.userid, storeid = _req$headers.storeid;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `bill` WHERE storeid =? and state = 0", [storeid]));

        case 3:
          bills = _context.sent;
          _context.t0 = regeneratorRuntime.keys(bills);

        case 5:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 13;
            break;
          }

          i = _context.t1.value;
          _context.next = 9;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `bill-row` WHERE `bill-id` = ?", [bills[i].id]));

        case 9:
          items = _context.sent;
          bills[i].items = items;
          _context.next = 5;
          break;

        case 13:
          res.status(200).json(bills);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  });
}