"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$body, from, len, _req$headers, storeid, privileges, userid, resu;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, from = _req$body.from, len = _req$body.len;
          _req$headers = req.headers, storeid = _req$headers.storeid, privileges = _req$headers.privileges, userid = _req$headers.userid;
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _connection["default"])("select `internal-notification`.*,user.avatar,user.name as username" + "  from `internal-notification` left join `user` on user.id = `internal-notification`.executor" + " where storeid = ?  order by `internal-notification`.date desc limit ?,?  ", [storeid, from, len]));

        case 4:
          resu = _context.sent;
          res.status(200).json(resu);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}