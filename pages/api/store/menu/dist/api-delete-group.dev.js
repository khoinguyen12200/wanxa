"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var id, _req$headers, storeid, privileges, userid, checked, deleteRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.body.id;
          _req$headers = req.headers, storeid = _req$headers.storeid, privileges = _req$headers.privileges, userid = _req$headers.userid;
          checked = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.MENU]);

          if (!checked) {
            _context.next = 10;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap((0, _connection["default"])("DELETE FROM `menu-group` WHERE id = ?", [id]));

        case 6:
          deleteRes = _context.sent;
          res.status(200).json({
            message: "Xóa nhóm thành công"
          });
          _context.next = 11;
          break;

        case 10:
          res.status(202).json({
            message: "Bạn không đủ quyền để thực hiện yêu cầu"
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
}