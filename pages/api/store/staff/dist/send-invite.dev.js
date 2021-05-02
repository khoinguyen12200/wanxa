"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _Notification = _interopRequireDefault(require("../../../../components/Notification"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _callee(req, res) {
  var destination, _req$headers, storeid, userid, privileges, executorId, executor, store, desResults, desIsInStore, inviteRes, insertId, notification, para, notify;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          destination = req.body.destination;
          _req$headers = req.headers, storeid = _req$headers.storeid, userid = _req$headers.userid, privileges = _req$headers.privileges;
          executorId = userid;
          _context.next = 5;
          return regeneratorRuntime.awrap((0, _connection["default"])("select name from user where id = ?", [executorId]));

        case 5:
          executor = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap((0, _connection["default"])("select * from store where id = ?", [storeid]));

        case 8:
          store = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap((0, _connection["default"])("Select id from user where id = ?", destination));

        case 11:
          desResults = _context.sent;

          if (!(desResults.length == 0)) {
            _context.next = 15;
            break;
          }

          res.status(202).json({
            message: "Không tồn tại người dùng này"
          });
          return _context.abrupt("return");

        case 15:
          _context.next = 17;
          return regeneratorRuntime.awrap((0, _connection["default"])("Select * from privileges where storeid = ? and userid = ?", [storeid, destination]));

        case 17:
          desIsInStore = _context.sent;

          if (!(desIsInStore.length > 0)) {
            _context.next = 21;
            break;
          }

          res.status(202).json({
            message: "Người dùng này đã là thành viên của cửa hàng"
          });
          return _context.abrupt("return");

        case 21:
          _context.next = 23;
          return regeneratorRuntime.awrap((0, _connection["default"])("INSERT INTO `staff-invitation`(`executor`, `storeid`, `destination`) VALUES (?,?,?)", [executorId, storeid, destination]));

        case 23:
          inviteRes = _context.sent;
          insertId = inviteRes.insertId;
          notification = new _Notification["default"]({
            type: _Notification["default"].TYPE.INVITE_TO_STORE,
            content: {
              id: insertId,
              ExecutorId: executorId,
              ExecutorName: executor[0].name,
              StoreId: parseInt(storeid),
              StoreName: store[0].name,
              Message: "string"
            },
            destination: destination
          });
          para = notification.getInsertParameter();

          if (!(para.length > 0)) {
            _context.next = 31;
            break;
          }

          _context.next = 30;
          return regeneratorRuntime.awrap(_connection["default"].apply(void 0, _toConsumableArray(para)));

        case 30:
          notify = _context.sent;

        case 31:
          res.status(200).json({
            message: "Gửi thành công"
          });

        case 32:
        case "end":
          return _context.stop();
      }
    }
  });
}