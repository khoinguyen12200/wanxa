"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$headers, privileges, userid, storeid, lastSeens;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$headers = req.headers, privileges = _req$headers.privileges, userid = _req$headers.userid, storeid = _req$headers.storeid;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `last-seen-message` WHERE userid = ? and storeid = ?", [userid, storeid]));

        case 3:
          lastSeens = _context.sent;

          if (!(lastSeens.length > 0)) {
            _context.next = 7;
            break;
          }

          res.status(200).json(lastSeens[0]);
          return _context.abrupt("return");

        case 7:
          res.status(202).end();

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}