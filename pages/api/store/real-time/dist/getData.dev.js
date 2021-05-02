"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$headers, privileges, userid, storeid, tableGroups, arr, i, tableGroup, groupid, tables;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$headers = req.headers, privileges = _req$headers.privileges, userid = _req$headers.userid, storeid = _req$headers.storeid;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `store-table-group` WHERE storeid = ?", storeid));

        case 3:
          tableGroups = _context.sent;
          arr = [];
          _context.t0 = regeneratorRuntime.keys(tableGroups);

        case 6:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 17;
            break;
          }

          i = _context.t1.value;
          tableGroup = tableGroups[i];
          groupid = tableGroup.id;
          _context.next = 12;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `store-table` WHERE groupid =?", groupid));

        case 12:
          tables = _context.sent;
          tableGroup.tables = tables;
          arr.push(tableGroup);
          _context.next = 6;
          break;

        case 17:
          res.status(200).json(arr);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  });
}