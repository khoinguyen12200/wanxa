"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = index;

var _connection = _interopRequireDefault(require("../../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function index(req, res) {
  var _req$headers, privileges, userid, storeid, staffs;

  return regeneratorRuntime.async(function index$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$headers = req.headers, privileges = _req$headers.privileges, userid = _req$headers.userid, storeid = _req$headers.storeid;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT USER.id,USER.name,USER.avatar,USER.description,PRIVILEGES.value as privilege" + " FROM privileges RIGHT JOIN USER ON USER.ID = privileges.USERID WHERE STOREID = ?", [storeid]));

        case 3:
          staffs = _context.sent;
          res.status(200).json(staffs);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}