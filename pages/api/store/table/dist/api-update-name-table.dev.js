"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;
exports.config = void 0;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _form = _interopRequireDefault(require("../../const/form"));

var _querySample = require("../../const/querySample");

var _jwt = require("../../const/jwt");

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var config = {
  api: {
    bodyParser: false
  }
};
exports.config = config;

function _callee(req, res) {
  var _ref, name, tableid, userid, groupRes, groupid, storeRes, storeid, priValue, accepted, updateRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _form["default"])(req));

        case 2:
          _ref = _context.sent;
          name = _ref.name;
          tableid = _ref.tableid;
          console.log(req.headers);
          userid = (0, _jwt.getUserId)(req);
          _context.next = 9;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT `groupid` from `store-table` where id = ? ", tableid));

        case 9:
          groupRes = _context.sent;
          groupid = groupRes.length != 0 ? groupRes[0].groupid : -1;
          _context.next = 13;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT `storeid` from `store-table-group` where id = ?", groupid));

        case 13:
          storeRes = _context.sent;
          storeid = storeRes.length != 0 ? storeRes[0].storeid : -1;
          _context.next = 17;
          return regeneratorRuntime.awrap((0, _querySample.getPrivileges)(userid, storeid));

        case 17:
          priValue = _context.sent;
          accepted = _Privileges["default"].isValueIncluded(priValue, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.FACILITY]);

          if (!accepted) {
            _context.next = 26;
            break;
          }

          _context.next = 22;
          return regeneratorRuntime.awrap((0, _connection["default"])("UPDATE `store-table` SET `name`=? WHERE id=?", [name, tableid]));

        case 22:
          updateRes = _context.sent;

          if (updateRes) {
            res.status(200).json({
              message: "Thay đổi tên bàn thành công"
            });
          } else {
            res.status(202).json({
              message: "Lỗi không rõ xảy ra"
            });
          }

          _context.next = 27;
          break;

        case 26:
          res.status(202).json({
            message: "Yêu cầu quyền cơ sở vật chất hoặc cao hơn"
          });

        case 27:
        case "end":
          return _context.stop();
      }
    }
  });
}