"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$headers, storeid, privileges, arr, i, group, tables;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$headers = req.headers, storeid = _req$headers.storeid, privileges = _req$headers.privileges;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `store-table-group` WHERE storeid = ?", storeid));

        case 3:
          arr = _context.sent;
          _context.t0 = regeneratorRuntime.keys(arr);

        case 5:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 14;
            break;
          }

          i = _context.t1.value;
          group = arr[i];
          _context.next = 10;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `store-table` WHERE groupid = ?", group.id));

        case 10:
          tables = _context.sent;
          group.tables = tables;
          _context.next = 5;
          break;

        case 14:
          res.status(200).json(arr);

        case 15:
        case "end":
          return _context.stop();
      }
    }
  });
}