"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;
exports.config = void 0;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _file = require("../../const/file");

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

var _form = _interopRequireDefault(require("../../const/form"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var config = {
  api: {
    bodyParser: false
  }
};
exports.config = config;

function _callee(req, res) {
  var _ref, name, des, price, files, groupid, picture, _req$headers, storeid, privileges, userid, accepted, uploadDir, insertRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _form["default"])(req));

        case 2:
          _ref = _context.sent;
          name = _ref.name;
          des = _ref.des;
          price = _ref.price;
          files = _ref.files;
          groupid = _ref.groupid;
          console.log("this is first line");
          console.log(name, des, price, files, groupid);
          picture = files != null ? files.picture : "";
          _req$headers = req.headers, storeid = _req$headers.storeid, privileges = _req$headers.privileges, userid = _req$headers.userid;
          accepted = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.MENU]);

          if (!accepted) {
            _context.next = 28;
            break;
          }

          if (!picture) {
            _context.next = 20;
            break;
          }

          _context.next = 17;
          return regeneratorRuntime.awrap((0, _file.upLoadAvatar)(picture, _file.UploadDir.Menu));

        case 17:
          _context.t0 = _context.sent;
          _context.next = 21;
          break;

        case 20:
          _context.t0 = "";

        case 21:
          uploadDir = _context.t0;
          _context.next = 24;
          return regeneratorRuntime.awrap((0, _connection["default"])("INSERT INTO `menu-item`( `groupid`, `name`, `des`, `picture`, `price`) VALUES (?,?,?,?,?)", [groupid, name, des, uploadDir, price]));

        case 24:
          insertRes = _context.sent;
          res.status(200).json({
            message: "Thêm món thành công"
          });
          _context.next = 29;
          break;

        case 28:
          res.status(202).json({
            error: true,
            message: "Bạn không đủ quyền để thực hiện yêu cầu"
          });

        case 29:
        case "end":
          return _context.stop();
      }
    }
  });
}