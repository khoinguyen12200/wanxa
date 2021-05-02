"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _file = require("../../const/file");

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$body, name, des, price, files, groupid, picture, _req$headers, storeid, privileges, userid, accepted, uploadDir, insertRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, des = _req$body.des, price = _req$body.price, files = _req$body.files, groupid = _req$body.groupid;
          picture = files != null ? files.picture : "";
          _req$headers = req.headers, storeid = _req$headers.storeid, privileges = _req$headers.privileges, userid = _req$headers.userid;
          accepted = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.MENU]);

          if (!accepted) {
            _context.next = 19;
            break;
          }

          if (!picture) {
            _context.next = 11;
            break;
          }

          _context.next = 8;
          return regeneratorRuntime.awrap((0, _file.upLoadAvatar)(picture, _file.UploadDir.Menu));

        case 8:
          _context.t0 = _context.sent;
          _context.next = 12;
          break;

        case 11:
          _context.t0 = "";

        case 12:
          uploadDir = _context.t0;
          _context.next = 15;
          return regeneratorRuntime.awrap((0, _connection["default"])("INSERT INTO `menu-item`( `groupid`, `name`, `des`, `picture`, `price`) VALUES (?,?,?,?,?)", [groupid, name, des, uploadDir, price]));

        case 15:
          insertRes = _context.sent;
          res.status(200).json({
            message: "Thêm món thành công"
          });
          _context.next = 20;
          break;

        case 19:
          res.status(202).json({
            message: "Bạn không đủ quyền để thực hiện yêu cầu"
          });

        case 20:
        case "end":
          return _context.stop();
      }
    }
  });
}