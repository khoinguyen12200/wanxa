"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;
exports.config = void 0;

var _connection = _interopRequireDefault(require("../const/connection"));

var _form = _interopRequireDefault(require("../const/form"));

var _file = require("../const/file");

var _Privileges = _interopRequireDefault(require("../../../components/Privileges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var config = {
  api: {
    bodyParser: false
  }
};
exports.config = config;

function _callee(req, res) {
  var _ref, files, _req$headers, storeid, userid, privileges, logo, check, storeRes, oldPath, delRes, uploadDir, changeRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _form["default"])(req));

        case 2:
          _ref = _context.sent;
          files = _ref.files;
          _req$headers = req.headers, storeid = _req$headers.storeid, userid = _req$headers.userid, privileges = _req$headers.privileges;
          logo = files != null ? files.logo : "";
          check = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER]);

          if (check) {
            _context.next = 10;
            break;
          }

          res.status(401).send({
            message: _Privileges["default"].ErrorMessage(_Privileges["default"].Content.OWNER)
          });
          return _context.abrupt("return");

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap((0, _connection["default"])("select `logo` from store where id = ?", storeid));

        case 12:
          storeRes = _context.sent;
          oldPath = storeRes[0].logo;
          _context.next = 16;
          return regeneratorRuntime.awrap((0, _file.deleteFile)(oldPath));

        case 16:
          delRes = _context.sent;

          if (!logo) {
            _context.next = 23;
            break;
          }

          _context.next = 20;
          return regeneratorRuntime.awrap((0, _file.upLoadAvatar)(logo, _file.userStoreDir));

        case 20:
          _context.t0 = _context.sent;
          _context.next = 24;
          break;

        case 23:
          _context.t0 = "";

        case 24:
          uploadDir = _context.t0;

          if (!(uploadDir != "")) {
            _context.next = 32;
            break;
          }

          _context.next = 28;
          return regeneratorRuntime.awrap((0, _connection["default"])("update `store` set `logo`=? where id =?", [uploadDir, storeid]));

        case 28:
          changeRes = _context.sent;

          if (!changeRes) {
            _context.next = 32;
            break;
          }

          res.status(200).json({
            message: "Thay đổi thành công"
          });
          return _context.abrupt("return");

        case 32:
          res.status(202).json({
            message: "Có lỗi xảy ra"
          });

        case 33:
        case "end":
          return _context.stop();
      }
    }
  });
}