"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$body, tableid, note, list, _req$headers, privileges, userid, storeid, checked, selectRes, insertRes, i, billId, item, insertItem;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, tableid = _req$body.tableid, note = _req$body.note, list = _req$body.list;
          _req$headers = req.headers, privileges = _req$headers.privileges, userid = _req$headers.userid, storeid = _req$headers.storeid;
          checked = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.WAITER]);

          if (!checked) {
            _context.next = 26;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap((0, _connection["default"])("Select * from `bill` where tableid = ? and state != 1", [tableid]));

        case 6:
          selectRes = _context.sent;

          if (!(selectRes.length > 0)) {
            _context.next = 10;
            break;
          }

          res.status(202).json({
            message: "Bàn đang có hóa đơn chưa thanh toán"
          });
          return _context.abrupt("return");

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap((0, _connection["default"])("INSERT INTO `bill`(`storeid`, `tableid`, `note`) VALUES (?,?,?)", [storeid, tableid, note]));

        case 12:
          insertRes = _context.sent;
          _context.t0 = regeneratorRuntime.keys(list);

        case 14:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 23;
            break;
          }

          i = _context.t1.value;
          billId = insertRes.insertId;
          item = list[i];
          _context.next = 20;
          return regeneratorRuntime.awrap((0, _connection["default"])("INSERT INTO `bill-row`(`bill-id`, `menu-item-id`) VALUES (?,?)", [billId, item]));

        case 20:
          insertItem = _context.sent;
          _context.next = 14;
          break;

        case 23:
          res.status(200).json({
            message: "Đã thêm thành công"
          });
          _context.next = 27;
          break;

        case 26:
          res.status(401).send(_Privileges["default"].ErrorMessage(_Privileges["default"].Content.WAITER));

        case 27:
        case "end":
          return _context.stop();
      }
    }
  });
}