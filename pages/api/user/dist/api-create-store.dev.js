"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;
exports.config = void 0;

var _connection = _interopRequireDefault(require("../const/connection"));

var _Privileges = _interopRequireDefault(require("../../../components/Privileges"));

var _form = _interopRequireDefault(require("../const/form"));

var _file = require("../const/file");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var config = {
  api: {
    bodyParser: false
  }
};
exports.config = config;

function _callee(req, res) {
  var _ref, name, des, files, userid, logo, uploadDir, sqlInsertStore, storeRes, storeId, addSql, addRes, priSql, priValue, priRes;

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
          files = _ref.files;
          userid = req.headers.userid;
          logo = files != null ? files.logo : "";

          if (!logo) {
            _context.next = 14;
            break;
          }

          _context.next = 11;
          return regeneratorRuntime.awrap((0, _file.upLoadAvatar)(logo, _file.userStoreDir));

        case 11:
          _context.t0 = _context.sent;
          _context.next = 15;
          break;

        case 14:
          _context.t0 = "";

        case 15:
          uploadDir = _context.t0;
          sqlInsertStore = 'INSERT INTO `store`(`name`, `logo`, `description`) VALUES (?,?,?)';
          _context.next = 19;
          return regeneratorRuntime.awrap((0, _connection["default"])(sqlInsertStore, [name, uploadDir, des]));

        case 19:
          storeRes = _context.sent;

          if (storeRes) {
            _context.next = 23;
            break;
          }

          res.status(202).json({
            message: "Có lỗi truy xuất xảy ra"
          });
          return _context.abrupt("return");

        case 23:
          storeId = storeRes.insertId;
          console.log("1");
          addSql = "INSERT INTO `store-table-group`(`storeid`, `name`) VALUES (?,?)";
          _context.next = 28;
          return regeneratorRuntime.awrap((0, _connection["default"])(addSql, [storeId, "Trung tâm"]));

        case 28:
          addRes = _context.sent;
          priSql = "INSERT INTO `privileges`(`storeid`, `userid`, `value`) VALUES (?,?,?)";
          priValue = _Privileges["default"].arrToValue([_Privileges["default"].Content.OWNER]);
          _context.next = 33;
          return regeneratorRuntime.awrap((0, _connection["default"])(priSql, [storeId, userid, priValue]));

        case 33:
          priRes = _context.sent;

          if (priRes) {
            _context.next = 37;
            break;
          }

          res.status(202).json({
            message: "Có lỗi truy xuất xảy ra"
          });
          return _context.abrupt("return");

        case 37:
          res.status(200).json({
            message: "Tạo lập doanh nghiệp thành công"
          });

        case 38:
        case "end":
          return _context.stop();
      }
    }
  });
}