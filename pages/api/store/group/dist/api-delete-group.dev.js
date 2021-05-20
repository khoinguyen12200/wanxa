"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var id, _req$headers, storeid, privileges, userid, accepted, delRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.body.id;
          _req$headers = req.headers, storeid = _req$headers.storeid, privileges = _req$headers.privileges, userid = _req$headers.userid;
          accepted = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.FACILITY]);

          if (!accepted) {
            _context.next = 11;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap((0, _connection["default"])("DELETE FROM `store-table-group` where id = ?", [id]));

        case 6:
          delRes = _context.sent;
          console.log(groupid);

          if (delRes) {
            res.status(200).json({
              message: "Xóa nhóm bàn thành công"
            });
          } else {
            res.status(202).json({
              error: true,
              message: "Lỗi không rõ xảy ra"
            });
          }

          _context.next = 12;
          break;

        case 11:
          res.status(202).json({
            error: true,
            message: "Yêu cầu quyền cơ sở vật chất hoặc cao hơn"
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
}