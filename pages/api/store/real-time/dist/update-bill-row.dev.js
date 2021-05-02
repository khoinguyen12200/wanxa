"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$body, id, state, _req$headers, privileges, userid, storeid, checked, updateRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, id = _req$body.id, state = _req$body.state;
          _req$headers = req.headers, privileges = _req$headers.privileges, userid = _req$headers.userid, storeid = _req$headers.storeid;
          checked = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.B]);

          if (!checked) {
            _context.next = 10;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap((0, _connection["default"])("UPDATE `bill-row` set state = ?, barista = ? where id =?", [state, userid, id]));

        case 6:
          updateRes = _context.sent;
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