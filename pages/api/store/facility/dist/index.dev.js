"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _data = require("../data");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$headers, storeid, privileges, data;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$headers = req.headers, storeid = _req$headers.storeid, privileges = _req$headers.privileges;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _data.getFacilities)(storeid));

        case 3:
          data = _context.sent;
          res.status(200).json(data);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}