"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;
exports.config = void 0;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _form = _interopRequireDefault(require("../../const/form"));

var _file = require("../../const/file");

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
  var _ref, files, id, picture, _req$headers, privileges, userid, storeid, accepted, oldItem, oldPath, uploadDir, updateRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _form["default"])(req));

        case 2:
          _ref = _context.sent;
          files = _ref.files;
          id = _ref.id;
          picture = files != null ? files.picture : "";
          _req$headers = req.headers, privileges = _req$headers.privileges, userid = _req$headers.userid, storeid = _req$headers.storeid;
          accepted = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.MENU]);

          if (!accepted) {
            _context.next = 29;
            break;
          }

          _context.next = 11;
          return regeneratorRuntime.awrap((0, _connection["default"])("select * from `menu-item` where id =?", id));

        case 11:
          oldItem = _context.sent;
          oldPath = oldItem.length > 0 ? oldItem[0].path : null;
          _context.next = 15;
          return regeneratorRuntime.awrap((0, _file.deleteFile)(oldPath));

        case 15:
          if (!picture) {
            _context.next = 21;
            break;
          }

          _context.next = 18;
          return regeneratorRuntime.awrap((0, _file.upLoadAvatar)(picture, _file.UploadDir.Menu));

        case 18:
          _context.t0 = _context.sent;
          _context.next = 22;
          break;

        case 21:
          _context.t0 = "";

        case 22:
          uploadDir = _context.t0;
          _context.next = 25;
          return regeneratorRuntime.awrap((0, _connection["default"])("UPDATE `menu-item` set picture = ? where id = ?", [uploadDir, id]));

        case 25:
          updateRes = _context.sent;
          res.status(200).json({
            message: "Chỉnh sửa thành công"
          });
          _context.next = 30;
          break;

        case 29:
          res.status(202).json({
            error: true,
            message: "Bạn không đủ quyền để thực hiện yêu cầu"
          });

        case 30:
        case "end":
          return _context.stop();
      }
    }
  });
}