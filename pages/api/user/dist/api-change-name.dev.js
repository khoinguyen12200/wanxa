"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;
exports.config = void 0;

var _connection = _interopRequireDefault(require("../const/connection"));

var _form = _interopRequireDefault(require("../const/form"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var config = {
  api: {
    bodyParser: false
  }
};
exports.config = config;

function _callee(req, res) {
  var _ref, name, userid, changeRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _form["default"])(req));

        case 2:
          _ref = _context.sent;
          name = _ref.name;
          userid = req.headers.userid;
          _context.next = 7;
          return regeneratorRuntime.awrap((0, _connection["default"])("update `user` set `name`=? where id =?", [name, userid]));

        case 7:
          changeRes = _context.sent;

          if (!changeRes) {
            _context.next = 11;
            break;
          }

          res.status(200).json({
            message: "Thay đổi thành công"
          });
          return _context.abrupt("return");

        case 11:
          res.status(202).json({
            message: "Có lỗi xảy ra"
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
}