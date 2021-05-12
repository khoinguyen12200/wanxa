"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$headers, userid, storeid, privileges, result, info;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$headers = req.headers, userid = _req$headers.userid, storeid = _req$headers.storeid, privileges = _req$headers.privileges;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _connection["default"])("select * from store where id = ?", [storeid]));

        case 3:
          result = _context.sent;
          info = result.length > 0 ? result[0] : null;

          if (info) {
            res.status(200).json({
              data: info
            });
          } else {
            res.status(200).json({
              error: true,
              data: info
            });
          }

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}