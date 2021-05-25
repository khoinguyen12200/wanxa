"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

var _Notification = _interopRequireDefault(require("../../../../components/Notification"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _callee(req, res) {
  var value, _req$headers, storeid, privileges, userid, hasNotiRights, insertRes, allStaff, executor, i, staff, notification, para, resAdd;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          value = req.body.value;
          _req$headers = req.headers, storeid = _req$headers.storeid, privileges = _req$headers.privileges, userid = _req$headers.userid;
          hasNotiRights = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER, _Privileges["default"].Content.Notification]);

          if (!hasNotiRights) {
            _context.next = 27;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap((0, _connection["default"])("INSERT INTO `internal-notification`(`executor`, `content`,`storeid`) VALUES (?,?,?)", [userid, value, storeid]));

        case 6:
          insertRes = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap((0, _connection["default"])("select * from privileges where storeid = ?", [storeid]));

        case 9:
          allStaff = _context.sent;
          _context.next = 12;
          return regeneratorRuntime.awrap((0, _connection["default"])("select name from user where id = ?", [userid]));

        case 12:
          executor = _context.sent;
          _context.t0 = regeneratorRuntime.keys(allStaff);

        case 14:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 24;
            break;
          }

          i = _context.t1.value;
          staff = allStaff[i];
          notification = new _Notification["default"]({
            type: _Notification["default"].TYPE.INTERNAL_NOTIFICATION,
            content: {
              ExecutorId: parseInt(userid),
              ExecutorName: executor[0].name,
              StoreId: parseInt(storeid),
              Message: value,
              id: insertRes.insertId
            },
            destination: staff.userid
          });
          para = notification.getInsertParameter();
          _context.next = 21;
          return regeneratorRuntime.awrap(_connection["default"].apply(void 0, _toConsumableArray(para)));

        case 21:
          resAdd = _context.sent;
          _context.next = 14;
          break;

        case 24:
          res.status(200).json({
            message: "Thành công"
          });
          _context.next = 28;
          break;

        case 27:
          res.status(202).json({
            error: true,
            message: "Bạn không đủ quyền để tạo thông báo"
          });

        case 28:
        case "end":
          return _context.stop();
      }
    }
  });
}