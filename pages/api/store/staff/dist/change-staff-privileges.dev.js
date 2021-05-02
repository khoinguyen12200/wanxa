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
  var _req$body, staffid, staffPrivileges, _req$headers, privileges, userid, storeid, destinationPri, isPrivilegesOwnerChange, accepted, rejected;

  return regeneratorRuntime.async(function index$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          rejected = function _ref2() {
            res.status(401).send({
              message: "Bạn không đủ quyền để thay đổi"
            });
            return;
          };

          accepted = function _ref() {
            var changeResult = (0, _connection["default"])("UPDATE `privileges` SET `value`=? WHERE storeid =? and userid =?", [staffPrivileges, storeid, staffid]);
            res.status(200).json({
              message: "Thay đổi quyền nhân viên hoàn tất"
            });
            return;
          };

          _req$body = req.body, staffid = _req$body.staffid, staffPrivileges = _req$body.staffPrivileges;
          _req$headers = req.headers, privileges = _req$headers.privileges, userid = _req$headers.userid, storeid = _req$headers.storeid;
          _context.next = 6;
          return regeneratorRuntime.awrap((0, _querySample.getPrivileges)(staffid, storeid));

        case 6:
          destinationPri = _context.sent;
          isPrivilegesOwnerChange = _Privileges["default"].isValueIncluded(staffPrivileges, [_Privileges["default"].Content.OWNER]) != _Privileges["default"].isValueIncluded(destinationPri, [_Privileges["default"].Content.OWNER]);

          if (_Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER])) {
            accepted();
          } else if (_Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.FACILITY])) {
            if (!isPrivilegesOwnerChange) {
              accepted();
            } else {
              rejected();
            }
          } else {
            rejected();
          }

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}