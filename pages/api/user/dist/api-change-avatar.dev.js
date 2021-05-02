"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;
exports.config = void 0;

var _connection = _interopRequireDefault(require("../const/connection"));

var _form = _interopRequireDefault(require("../const/form"));

var _file = require("../const/file");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var config = {
  api: {
    bodyParser: false
  }
};
exports.config = config;

function _callee(req, res) {
  var _ref, files, avatar, userid, user, oldPath, delRes, uploadDir, changeRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _form["default"])(req));

        case 2:
          _ref = _context.sent;
          files = _ref.files;
          avatar = files != null ? files.avatar : "";
          userid = req.headers.userid;
          _context.next = 8;
          return regeneratorRuntime.awrap((0, _connection["default"])("select `avatar` from user where id = ?", userid));

        case 8:
          user = _context.sent;
          oldPath = user[0].avatar;
          _context.next = 12;
          return regeneratorRuntime.awrap((0, _file.deleteFile)(oldPath));

        case 12:
          delRes = _context.sent;

          if (!avatar) {
            _context.next = 19;
            break;
          }

          _context.next = 16;
          return regeneratorRuntime.awrap((0, _file.upLoadAvatar)(avatar, _file.userAvatarDir));

        case 16:
          _context.t0 = _context.sent;
          _context.next = 20;
          break;

        case 19:
          _context.t0 = "";

        case 20:
          uploadDir = _context.t0;

          if (!(uploadDir != "")) {
            _context.next = 28;
            break;
          }

          _context.next = 24;
          return regeneratorRuntime.awrap((0, _connection["default"])("update `user` set `avatar`=? where id =?", [uploadDir, userid]));

        case 24:
          changeRes = _context.sent;

          if (!changeRes) {
            _context.next = 28;
            break;
          }

          res.status(200).json({
            message: "Thay đổi thành công"
          });
          return _context.abrupt("return");

        case 28:
          res.status(202).json({
            message: "Có lỗi xảy ra"
          });

        case 29:
        case "end":
          return _context.stop();
      }
    }
  });
}