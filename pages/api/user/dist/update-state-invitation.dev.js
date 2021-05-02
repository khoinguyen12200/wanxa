"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$body, state, id, userid, invitation, updateRes, storeid, insertRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, state = _req$body.state, id = _req$body.id;
          userid = req.headers.userid;
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `staff-invitation` WHERE id =?", id));

        case 4:
          invitation = _context.sent;
          invitation = invitation.length > 0 ? invitation[0] : null;
          _context.next = 8;
          return regeneratorRuntime.awrap((0, _connection["default"])("UPDATE `staff-invitation` SET `state`=? where id =? and destination =?", [state, id, userid]));

        case 8:
          updateRes = _context.sent;

          if (!updateRes) {
            _context.next = 18;
            break;
          }

          if (!(state == 1)) {
            _context.next = 15;
            break;
          }

          storeid = invitation ? invitation.storeid : null;
          _context.next = 14;
          return regeneratorRuntime.awrap((0, _connection["default"])("INSERT INTO `privileges`(`storeid`, `userid`, `value`) VALUES (?,?,?)", [storeid, userid, 0]));

        case 14:
          insertRes = _context.sent;

        case 15:
          res.status(200).json({
            message: "Đã lưu lại"
          });
          _context.next = 19;
          break;

        case 18:
          res.status(202).json({
            message: "Có lỗi xảy ra"
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  });
}