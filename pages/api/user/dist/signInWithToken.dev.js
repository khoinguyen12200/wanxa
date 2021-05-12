"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../const/connection"));

var _form = _interopRequireDefault(require("../const/form"));

var _uuid = require("uuid");

var _querySample = require("../const/querySample");

var _jwt = require("../const/jwt");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var MyJsonWebToken = require('../../../server-jwt');

function _callee(req, res) {
  var userid, user, privileges, token;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userid = (0, _jwt.getUserId)(req);

          if (!userid) {
            _context.next = 12;
            break;
          }

          _context.next = 4;
          return regeneratorRuntime.awrap((0, _querySample.getUserById)(userid));

        case 4:
          user = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap((0, _connection["default"])("Select * from privileges where userid = ?", userid));

        case 7:
          privileges = _context.sent;
          token = MyJsonWebToken.signToken(userid, privileges);
          res.status(200).json({
            message: "Đăng nhập tự động thành công",
            user: user,
            token: token
          });
          _context.next = 13;
          break;

        case 12:
          res.status(200).json({
            error: true,
            message: "Token đã hết hạn, hãy đăng nhập lại"
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
}