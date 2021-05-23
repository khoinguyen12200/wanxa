"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$body, name, id, _req$headers, storeid, userid, privileges, accepted, updateRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, id = _req$body.id;
          _req$headers = req.headers, storeid = _req$headers.storeid, userid = _req$headers.userid, privileges = _req$headers.privileges;
          accepted = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.FACILITY]);

          if (!accepted) {
            _context.next = 10;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap((0, _connection["default"])("UPDATE `store-table` SET `name`=? WHERE id=?", [name, id]));

        case 6:
          updateRes = _context.sent;

          if (updateRes) {
            res.status(200).json({
              message: "Thay đổi tên bàn thành công"
            });
          } else {
            res.status(202).json({
              error: true,
              message: "Lỗi không rõ xảy ra"
            });
          }

          _context.next = 11;
          break;

        case 10:
          res.status(202).json({
            error: true,
            message: _Privileges["default"].ErrorMessage(_Privileges["default"].Content.FACILITY)
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
}