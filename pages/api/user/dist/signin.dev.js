"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../const/connection"));

var _uuid = require("uuid");

var _querySample = require("../const/querySample");

var _jwt = require("../const/jwt");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var md5 = require("md5");

function _callee(req, res) {
  var _req$body, account, password, validation, user, privileges, token, sampleUser;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, account = _req$body.account, password = _req$body.password;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT `id` from user WHERE account = ? and password = ?", [account, md5(password)]));

        case 3:
          validation = _context.sent;

          if (!(validation.length > 0)) {
            _context.next = 17;
            break;
          }

          user = validation[0];
          _context.next = 8;
          return regeneratorRuntime.awrap((0, _connection["default"])("select * from privileges where userid = ?", user.id));

        case 8:
          privileges = _context.sent;
          token = (0, _jwt.signToken)(user.id, privileges);
          console.log(token);
          _context.next = 13;
          return regeneratorRuntime.awrap((0, _querySample.getUserById)(user.id));

        case 13:
          sampleUser = _context.sent;
          res.status(200).json({
            message: "Đăng nhập thành công",
            token: token,
            user: sampleUser
          });
          _context.next = 18;
          break;

        case 17:
          res.status(202).json({
            message: "Account and password doesn't matches"
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  });
}