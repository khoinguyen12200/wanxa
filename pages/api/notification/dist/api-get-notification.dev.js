"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$body, from, numberOfItem, userid, result;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, from = _req$body.from, numberOfItem = _req$body.numberOfItem;
          userid = req.headers.userid;
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM notification where destination = ?  order by time desc limit ?,? ", [userid, from, numberOfItem]));

        case 4:
          result = _context.sent;
          res.status(200).json(result);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}