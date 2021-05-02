"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var tableid, _req$headers, storeid, userid, privileges, accepted, deleteRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          tableid = req.body.tableid;
          _req$headers = req.headers, storeid = _req$headers.storeid, userid = _req$headers.userid, privileges = _req$headers.privileges;
          accepted = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.FACILITY]);

          if (!accepted) {
            _context.next = 10;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap((0, _connection["default"])("delete from `store-table`  WHERE id=?", [tableid]));

        case 6:
          deleteRes = _context.sent;

          if (deleteRes) {
            res.status(200).json({
              message: "Xóa bàn thành công"
            });
          } else {
            res.status(202).json({
              message: "Lỗi không rõ xảy ra"
            });
          }

          _context.next = 11;
          break;

        case 10:
          res.status(202).send({
            message: _Privileges["default"].ErrorMessage(_Privileges["default"].Content.FACILITY)
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
}