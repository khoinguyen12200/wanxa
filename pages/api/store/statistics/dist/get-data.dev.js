"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$headers, storeid, userid, privileges, _req$body, fromTime, toTime, unit, type, queryRes, query2Res;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$headers = req.headers, storeid = _req$headers.storeid, userid = _req$headers.userid, privileges = _req$headers.privileges;

          if (_Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.STATISTICS])) {
            _context.next = 4;
            break;
          }

          res.status(401).send({
            message: _Privileges["default"].ErrorMessage(_Privileges["default"].Content.STATISTICS)
          });
          return _context.abrupt("return");

        case 4:
          _req$body = req.body, fromTime = _req$body.fromTime, toTime = _req$body.toTime, unit = _req$body.unit, type = _req$body.type;
          fromTime = fromTime || new Date(0);
          toTime = toTime || new Date();

          if (!(type == 1)) {
            _context.next = 14;
            break;
          }

          _context.next = 10;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT " + unit + "(paytime) as unit,sum(price) as sum" + " FROM `bill` WHERE storeid =? and paytime >= ? and paytime <= ? group by unit ", [storeid, fromTime, toTime]));

        case 10:
          queryRes = _context.sent;
          res.status(200).json(queryRes);
          _context.next = 18;
          break;

        case 14:
          _context.next = 16;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT static.`menu-name` as name,count(static.`menu-name`) as count,static.price" + " FROM `static-bill-row` static left join bill on bill.id = static.`bill-id`" + " where bill.storeid = ? and bill.paytime >= ? and bill.paytime<=? group by name", [storeid, fromTime, toTime]));

        case 16:
          query2Res = _context.sent;
          res.status(200).json(query2Res);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  });
}