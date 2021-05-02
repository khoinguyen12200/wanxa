"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$headers, privileges, userid, storeid, result;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$headers = req.headers, privileges = _req$headers.privileges, userid = _req$headers.userid, storeid = _req$headers.storeid;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `store-message` WHERE storeid = ? order by time desc limit 50", [storeid]));

        case 3:
          result = _context.sent;
          res.status(200).json(result);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}