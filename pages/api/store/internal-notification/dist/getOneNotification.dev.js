"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var id, resu;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.body.id;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _connection["default"])("select `internal-notification`.*,user.avatar,user.name as username" + "  from `internal-notification` left join `user` on user.id = `internal-notification`.executor" + " where `internal-notification`.id = ?  ", [id]));

        case 3:
          resu = _context.sent;
          res.status(200).json(resu);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}