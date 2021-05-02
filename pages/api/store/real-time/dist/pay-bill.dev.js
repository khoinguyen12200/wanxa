"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$body, id, note, _req$headers, privileges, userid, storeid, checked, sum, billRows, i, row, menu, menuName, menuPrice, barista, baristaName, insertRes, updateRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, id = _req$body.id, note = _req$body.note;
          _req$headers = req.headers, privileges = _req$headers.privileges, userid = _req$headers.userid, storeid = _req$headers.storeid;
          checked = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.WAITER]);

          if (!checked) {
            _context.next = 33;
            break;
          }

          sum = 0;
          _context.next = 7;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `bill-row` WHERE `bill-id` = ?", [id]));

        case 7:
          billRows = _context.sent;
          _context.t0 = regeneratorRuntime.keys(billRows);

        case 9:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 27;
            break;
          }

          i = _context.t1.value;
          row = billRows[i];
          _context.next = 14;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `menu-item` WHERE id = ?", [row['menu-item-id']]));

        case 14:
          menu = _context.sent;
          menuName = menu[0].name;
          menuPrice = menu[0].price;
          _context.next = 19;
          return regeneratorRuntime.awrap((0, _connection["default"])("select name from user where id = ?", [row.barista]));

        case 19:
          barista = _context.sent;
          baristaName = barista[0].name;
          _context.next = 23;
          return regeneratorRuntime.awrap((0, _connection["default"])("INSERT INTO `static-bill-row`(`bill-id`, `menu-name`, `barista-name`, `price`) VALUES (?,?,?,?)", [id, menuName, baristaName, menuPrice]));

        case 23:
          insertRes = _context.sent;
          sum += menuPrice;
          _context.next = 9;
          break;

        case 27:
          _context.next = 29;
          return regeneratorRuntime.awrap((0, _connection["default"])("update `bill`set state = 1,note =?,paytime=?,price=? where id = ?", [note, new Date(), sum, id]));

        case 29:
          updateRes = _context.sent;
          res.status(200).end();
          _context.next = 34;
          break;

        case 33:
          res.status(401).send(_Privileges["default"].ErrorMessage(_Privileges["default"].Content.WAITER));

        case 34:
        case "end":
          return _context.stop();
      }
    }
  });
}