"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

var _file = require("../../const/file");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$body, id, groupid, _req$headers, storeid, privileges, userid, checked, item, path, udpateRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, id = _req$body.id, groupid = _req$body.groupid;
          _req$headers = req.headers, storeid = _req$headers.storeid, privileges = _req$headers.privileges, userid = _req$headers.userid;
          checked = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.MENU]);
          _context.next = 5;
          return regeneratorRuntime.awrap((0, _connection["default"])("select * from `menu-item` where id = ?", [id]));

        case 5:
          item = _context.sent;
          path = item[0].picture;

          if (!checked) {
            _context.next = 15;
            break;
          }

          _context.next = 10;
          return regeneratorRuntime.awrap((0, _connection["default"])("delete from `menu-item` where id = ?", [id]));

        case 10:
          udpateRes = _context.sent;

          if (path != null && path != "") {
            (0, _file.deleteFile)(path);
          }

          res.status(200).json({
            message: 'Xóa thành công'
          });
          _context.next = 16;
          break;

        case 15:
          res.status(202).json({
            message: 'Bạn không có quyền thực hiện'
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
}