"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$headers, storeid, privileges, userid, store, groups, newGroups, i, group, tables;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$headers = req.headers, storeid = _req$headers.storeid, privileges = _req$headers.privileges, userid = _req$headers.userid;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT `storeid` FROM `privileges` WHERE `userid`=? and `storeid`=?", [userid, storeid]));

        case 3:
          store = _context.sent;

          if (!(store.length > 0)) {
            _context.next = 23;
            break;
          }

          _context.next = 7;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `store-table-group` WHERE `storeid`=?", storeid));

        case 7:
          groups = _context.sent;
          newGroups = [];
          _context.t0 = regeneratorRuntime.keys(groups);

        case 10:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 20;
            break;
          }

          i = _context.t1.value;
          group = groups[i];
          _context.next = 15;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `store-table` WHERE `groupid`=?", group.id));

        case 15:
          tables = _context.sent;
          group.tables = tables;
          newGroups.push(group);
          _context.next = 10;
          break;

        case 20:
          res.status(200).json({
            group: newGroups
          });
          _context.next = 24;
          break;

        case 23:
          res.status(202).json({
            message: 'Bạn không có quyền để vào đây'
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  });
}