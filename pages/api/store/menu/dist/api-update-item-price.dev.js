"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _querySample = require("../../const/querySample");

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

var _jwt = require("../../const/jwt");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$body, id, price, _req$headers, privileges, userid, storeid, checked, udpateRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, id = _req$body.id, price = _req$body.price;
          _req$headers = req.headers, privileges = _req$headers.privileges, userid = _req$headers.userid, storeid = _req$headers.storeid;
          checked = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.MENU]);

          if (!checked) {
            _context.next = 10;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap((0, _connection["default"])("update `menu-item` set price = ? where id = ?", [price, id]));

        case 6:
          udpateRes = _context.sent;
          res.status(200).json({
            message: 'Thay đổi thành công'
          });
          _context.next = 11;
          break;

        case 10:
          res.status(202).json({
            message: 'Bạn không có quyền thực hiện'
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
}