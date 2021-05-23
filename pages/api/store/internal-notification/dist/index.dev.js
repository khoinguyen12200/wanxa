"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _data = require("../data");

function _callee(req, res) {
  var storeid, resu;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          storeid = req.headers.storeid;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _data.getNotifications)(storeid));

        case 3:
          resu = _context.sent;
          res.json(resu);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}