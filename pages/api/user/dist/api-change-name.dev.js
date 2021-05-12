"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var name, userid, changeRes;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          name = req.body.name;
          userid = req.headers.userid;
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _connection["default"])("update `user` set `name`=? where id =?", [name, userid]));

        case 4:
          changeRes = _context.sent;

          if (!changeRes) {
            _context.next = 8;
            break;
          }

          res.status(200).json({
            message: "Thay đổi thành công"
          });
          return _context.abrupt("return");

        case 8:
          res.status(202).json({
            message: "Có lỗi xảy ra"
          });

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}