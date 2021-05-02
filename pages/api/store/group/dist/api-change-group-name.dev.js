"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$body, newName, groupid, _req$headers, storeid, privileges, userid, accepted, updateRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, newName = _req$body.newName, groupid = _req$body.groupid;
          _req$headers = req.headers, storeid = _req$headers.storeid, privileges = _req$headers.privileges, userid = _req$headers.userid;
          accepted = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.FACILITY]);

          if (!accepted) {
            _context.next = 10;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap((0, _connection["default"])("UPDATE `store-table-group` SET `name`=? WHERE id =?", [newName, groupid]));

        case 6:
          updateRes = _context.sent;

          if (updateRes) {
            res.status(200).json({
              message: "Chỉnh sửa thành công"
            });
          } else {
            res.status(202).json({
              message: "Lỗi không rõ xảy ra"
            });
          }

          _context.next = 11;
          break;

        case 10:
          res.status(202).json({
            message: "Yêu cầu quyền cơ sở vật chất hoặc cao hơn"
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
}