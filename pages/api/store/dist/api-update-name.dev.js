"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../const/connection"));

var _querySample = require("../const/querySample");

var _Privileges = _interopRequireDefault(require("../../../components/Privileges"));

var _Notification = _interopRequireDefault(require("../../../components/Notification"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _callee(req, res) {
  var name, _req$headers, storeid, userid, privileges, check, oldStore, oldName, changeRes, executor, notification, allStaff, i, staff, para;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          name = req.body.name;
          _req$headers = req.headers, storeid = _req$headers.storeid, userid = _req$headers.userid, privileges = _req$headers.privileges;
          check = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER]);

          if (check) {
            _context.next = 6;
            break;
          }

          res.status(200).send({
            error: true,
            message: _Privileges["default"].ErrorMessage(_Privileges["default"].Content.OWNER)
          });
          return _context.abrupt("return");

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap((0, _connection["default"])("Select * from store where id = ?", [storeid]));

        case 8:
          oldStore = _context.sent;
          oldName = oldStore.length != 0 ? oldStore[0].name : "";
          _context.next = 12;
          return regeneratorRuntime.awrap((0, _connection["default"])("update `store` set `name`=? where id =?", [name, storeid]));

        case 12:
          changeRes = _context.sent;

          if (!changeRes) {
            _context.next = 33;
            break;
          }

          _context.next = 16;
          return regeneratorRuntime.awrap((0, _querySample.getUserById)(userid));

        case 16:
          executor = _context.sent;
          notification = new _Notification["default"]({
            type: _Notification["default"].TYPE.UPDATE_STORE_NAME,
            content: {
              ExecutorId: parseInt(executor.id),
              ExecutorName: executor.name,
              StoreId: parseInt(storeid),
              OldName: oldName,
              NewName: name
            }
          });
          _context.next = 20;
          return regeneratorRuntime.awrap((0, _querySample.getAllStaff)(storeid));

        case 20:
          allStaff = _context.sent;
          _context.t0 = regeneratorRuntime.keys(allStaff);

        case 22:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 31;
            break;
          }

          i = _context.t1.value;
          staff = allStaff[i];
          notification.destination = staff.id;
          para = notification.getInsertParameter();
          _context.next = 29;
          return regeneratorRuntime.awrap(_connection["default"].apply(void 0, _toConsumableArray(para)));

        case 29:
          _context.next = 22;
          break;

        case 31:
          res.status(200).json({
            message: "Thay đổi thành công"
          });
          return _context.abrupt("return");

        case 33:
          res.status(202).json({
            error: true,
            message: "Có lỗi xảy ra"
          });

        case 34:
        case "end":
          return _context.stop();
      }
    }
  });
}