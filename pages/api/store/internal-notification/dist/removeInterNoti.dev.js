"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _jwt = require("../../const/jwt");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var id, _req$headers, storeid, privileges, userid, InterNoti, resu;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.body.id;
          _req$headers = req.headers, storeid = _req$headers.storeid, privileges = _req$headers.privileges, userid = _req$headers.userid;
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _connection["default"])("Select * from `internal-notification` where executor = ? and id = ?", [userid, id]));

        case 4:
          InterNoti = _context.sent;

          if (!(InterNoti.length > 0)) {
            _context.next = 12;
            break;
          }

          _context.next = 8;
          return regeneratorRuntime.awrap((0, _connection["default"])("DELETE FROM `internal-notification` WHERE id = ?", [id]));

        case 8:
          resu = _context.sent;
          res.status(200).json({
            message: "Lưu lại thành công"
          });
          _context.next = 13;
          break;

        case 12:
          res.status(202).json({
            message: "Bạn không phải người tạo thông báo này"
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
}