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

var md5 = require("md5");

var config = {
  api: {
    bodyParser: false
  }
};
exports.config = config;

function _callee(req, res) {
  var _ref, name, account, password, files, avatar, uploadDir, isExisting, result;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _form["default"])(req));

        case 2:
          _ref = _context.sent;
          name = _ref.name;
          account = _ref.account;
          password = _ref.password;
          files = _ref.files;
          avatar = files != null ? files.avatar : "";

          if (!avatar) {
            _context.next = 14;
            break;
          }

          _context.next = 11;
          return regeneratorRuntime.awrap((0, _file.upLoadAvatar)(avatar, _file.userAvatarDir));

        case 11:
          _context.t0 = _context.sent;
          _context.next = 15;
          break;

        case 14:
          _context.t0 = "";

        case 15:
          uploadDir = _context.t0;
          _context.next = 18;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT `id` FROM USER where account = ?", account));

        case 18:
          isExisting = _context.sent;

          if (!(isExisting.length > 0)) {
            _context.next = 22;
            break;
          }

          res.json({
            error: true,
            message: 'User đã tồn tại'
          });
          return _context.abrupt("return");

        case 22:
          _context.next = 24;
          return regeneratorRuntime.awrap((0, _connection["default"])("INSERT INTO `user`(`account`, `password`, `name`, `avatar`) VALUES (?,?,?,?)", [account, md5(password), name, uploadDir]));

        case 24:
          result = _context.sent;

          if (result) {
            res.status(200).json({
              message: "Tạo tài khoản thành công"
            });
          } else {
            res.json({
              message: "Lỗi không rõ"
            });
          }

        case 26:
        case "end":
          return _context.stop();
      }
    }
  });
}