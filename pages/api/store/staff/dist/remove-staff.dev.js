"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = index;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _querySample = require("../../const/querySample");

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function index(req, res) {
  var staffid, _req$headers, storeid, userid, privileges, isPerformerOwner, isPerformerHRM, targetPrivileges, isTargetOwner, deleteRes;

  return regeneratorRuntime.async(function index$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          staffid = req.body.staffid;
          _req$headers = req.headers, storeid = _req$headers.storeid, userid = _req$headers.userid, privileges = _req$headers.privileges;
          isPerformerOwner = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER]);
          isPerformerHRM = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.HRM]);
          _context.next = 6;
          return regeneratorRuntime.awrap((0, _querySample.getPrivileges)(staffid, storeid));

        case 6:
          targetPrivileges = _context.sent;
          // gia tri privileges cu~
          isTargetOwner = _Privileges["default"].isValueIncluded(targetPrivileges, [_Privileges["default"].Content.OWNER]);

          if (!(isPerformerOwner || isPerformerHRM && !isTargetOwner)) {
            _context.next = 16;
            break;
          }

          _context.next = 11;
          return regeneratorRuntime.awrap((0, _connection["default"])("DELETE FROM `privileges` WHERE userid = ? and storeid =?", [staffid, storeid]));

        case 11:
          deleteRes = _context.sent;
          res.status(200).json({
            message: "Xóa nhân viên thành công"
          });
          return _context.abrupt("return");

        case 16:
          res.status(202).json({
            message: "Bạn không đủ quyền để thay đổi"
          });
          return _context.abrupt("return");

        case 18:
        case "end":
          return _context.stop();
      }
    }
  });
}