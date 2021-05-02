"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var md5 = require('md5');

function _callee(req, res) {
  var _req$body, oldPassword, newPassword, userid, isExisting, update;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, oldPassword = _req$body.oldPassword, newPassword = _req$body.newPassword;
          userid = req.headers.userid;
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _connection["default"])("Select * from user where id = ? and password = ?", [userid, md5(oldPassword)]));

        case 4:
          isExisting = _context.sent;

          if (!(isExisting.length > 0)) {
            _context.next = 12;
            break;
          }

          _context.next = 8;
          return regeneratorRuntime.awrap((0, _connection["default"])("update user set password = ? where id =?", [md5(newPassword), userid]));

        case 8:
          update = _context.sent;
          res.status(200).json({
            message: "Thay đổi thành công"
          });
          _context.next = 13;
          break;

        case 12:
          res.status(202).json({
            message: 'Mật khẩu cũ không khớp'
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
}