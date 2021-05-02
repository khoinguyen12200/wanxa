"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$body, menu_item_id, bill_id, _req$headers, privileges, userid, storeid, checked, addRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, menu_item_id = _req$body.menu_item_id, bill_id = _req$body.bill_id;
          _req$headers = req.headers, privileges = _req$headers.privileges, userid = _req$headers.userid, storeid = _req$headers.storeid;
          checked = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.WAITER]);

          if (!checked) {
            _context.next = 10;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap((0, _connection["default"])("INSERT INTO `bill-row`(`bill-id`, `menu-item-id`) VALUES (?,?)", [bill_id, menu_item_id]));

        case 6:
          addRes = _context.sent;
          res.status(200).end();
          _context.next = 11;
          break;

        case 10:
          res.status(401).send(_Privileges["default"].ErrorMessage(_Privileges["default"].Content.WAITER));

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
}