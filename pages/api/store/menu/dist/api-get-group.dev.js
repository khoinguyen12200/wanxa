"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$headers, storeid, privileges, userid, groups, newArr, i, group, items;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$headers = req.headers, storeid = _req$headers.storeid, privileges = _req$headers.privileges, userid = _req$headers.userid;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `menu-group` WHERE storeid = ?", storeid));

        case 3:
          groups = _context.sent;
          newArr = [];
          _context.t0 = regeneratorRuntime.keys(groups);

        case 6:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 16;
            break;
          }

          i = _context.t1.value;
          group = groups[i];
          _context.next = 11;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `menu-item` WHERE groupid = ?", [group.id]));

        case 11:
          items = _context.sent;
          group.items = items;
          newArr.push(group);
          _context.next = 6;
          break;

        case 16:
          res.status(200).json(newArr);

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
}