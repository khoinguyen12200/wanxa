"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$body, limit, offset, options, storeid, fromTime, toTime, queryRes, i, rows;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, limit = _req$body.limit, offset = _req$body.offset, options = _req$body.options;
          storeid = req.headers.storeid;
          fromTime = options ? options.fromTime || new Date(0) : new Date(0);
          toTime = options ? options.toTime || new Date() : new Date();
          _context.next = 6;
          return regeneratorRuntime.awrap((0, _connection["default"])("select * from bill where storeid = ? and paytime>? and paytime<? order by time desc limit ?,?", [storeid, fromTime, toTime, offset, limit]));

        case 6:
          queryRes = _context.sent;
          i = 0;

        case 8:
          if (!(i < queryRes.length)) {
            _context.next = 16;
            break;
          }

          _context.next = 11;
          return regeneratorRuntime.awrap((0, _connection["default"])("select * from `static-bill-row` where `bill-id` = ?", queryRes[i].id));

        case 11:
          rows = _context.sent;
          queryRes[i].rows = rows;

        case 13:
          i++;
          _context.next = 8;
          break;

        case 16:
          res.status(200).json(queryRes);

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
}