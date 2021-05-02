"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;
exports.config = void 0;

var _connection = _interopRequireDefault(require("../../const/connection"));

var _form = _interopRequireDefault(require("../../const/form"));

var _uuid = require("uuid");

var _Notification = _interopRequireDefault(require("../../../../components/Notification"));

var _file = require("../../const/file");

var _querySample = require("../../const/querySample");

var _Privileges = _interopRequireDefault(require("../../../../components/Privileges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var md5 = require("md5");

var config = {
  api: {
    bodyParser: false
  }
};
exports.config = config;

function _callee(req, res) {
  var failed, _ref, user, files, userS, _req$headers, privileges, userid, storeid, privilegesOwner, privilegesHRM, i, _newUser, pri, isOwner, _i, newUser, file, insertId, insertToPrivileges;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          failed = [];
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _form["default"])(req));

        case 3:
          _ref = _context.sent;
          user = _ref.user;
          files = _ref.files;
          userS = JSON.parse(user);
          _req$headers = req.headers, privileges = _req$headers.privileges, userid = _req$headers.userid, storeid = _req$headers.storeid;
          privilegesOwner = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER]);
          privilegesHRM = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.HRM]);

          if (!(!privilegesOwner && !privilegesHRM)) {
            _context.next = 13;
            break;
          }

          res.status(401).send({
            message: "Bạn không có quyền thực hiện yêu cầu này"
          });
          return _context.abrupt("return");

        case 13:
          if (privilegesOwner) {
            _context.next = 25;
            break;
          }

          _context.t0 = regeneratorRuntime.keys(userS);

        case 15:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 25;
            break;
          }

          i = _context.t1.value;
          _newUser = userS[i];
          pri = _newUser.privileges;
          isOwner = _Privileges["default"].isValueIncluded(pri, [_Privileges["default"].Content.OWNER]);

          if (!isOwner) {
            _context.next = 23;
            break;
          }

          res.status(401).send({
            message: "Bạn không có quyền thực hiện yêu cầu này"
          });
          return _context.abrupt("return");

        case 23:
          _context.next = 15;
          break;

        case 25:
          _context.t2 = regeneratorRuntime.keys(userS);

        case 26:
          if ((_context.t3 = _context.t2()).done) {
            _context.next = 43;
            break;
          }

          _i = _context.t3.value;
          newUser = userS[_i];
          file = files[newUser.path];
          newUser.avatar = file;
          _context.next = 33;
          return regeneratorRuntime.awrap(createUser(newUser));

        case 33:
          insertId = _context.sent;

          if (!(insertId == -1)) {
            _context.next = 38;
            break;
          }

          failed.push(_i);
          _context.next = 41;
          break;

        case 38:
          _context.next = 40;
          return regeneratorRuntime.awrap((0, _connection["default"])("INSERT INTO `privileges`(`storeid`, `userid`, `value`) VALUES (?,?,?)", [storeid, insertId, newUser.privileges]));

        case 40:
          insertToPrivileges = _context.sent;

        case 41:
          _context.next = 26;
          break;

        case 43:
          res.status(200).json({
            failed: failed
          });
          return _context.abrupt("return");

        case 45:
        case "end":
          return _context.stop();
      }
    }
  });
}

function createUser(user) {
  var account, password, name, avatar, res1, uploadDir, res2, userid, notification, para, notify;
  return regeneratorRuntime.async(function createUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          account = user.account, password = user.password, name = user.name, avatar = user.avatar;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT `id` FROM `user` WHERE account =?", [user.account]));

        case 3:
          res1 = _context2.sent;

          if (!(res1.length > 0)) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", -1);

        case 8:
          if (!avatar) {
            _context2.next = 14;
            break;
          }

          _context2.next = 11;
          return regeneratorRuntime.awrap((0, _file.upLoadAvatar)(avatar, _file.userAvatarDir));

        case 11:
          _context2.t0 = _context2.sent;
          _context2.next = 15;
          break;

        case 14:
          _context2.t0 = "";

        case 15:
          uploadDir = _context2.t0;
          _context2.next = 18;
          return regeneratorRuntime.awrap((0, _connection["default"])("INSERT INTO `user`(`account`, `password`, `name`, `avatar`)" + " VALUES (?,?,?,?)", [account, md5(password), name, uploadDir]));

        case 18:
          res2 = _context2.sent;

          if (!res2) {
            _context2.next = 29;
            break;
          }

          userid = res2.insertId;
          notification = new _Notification["default"]({
            type: _Notification["default"].TYPE.WARNING_AUTO_CREATE,
            content: {
              StaffName: name
            },
            destination: userid
          });
          para = notification.getInsertParameter();

          if (!(para.length > 0)) {
            _context2.next = 28;
            break;
          }

          _context2.next = 26;
          return regeneratorRuntime.awrap(_connection["default"].apply(void 0, _toConsumableArray(para)));

        case 26:
          notify = _context2.sent;
          console.log(notify);

        case 28:
          return _context2.abrupt("return", res2.insertId);

        case 29:
          return _context2.abrupt("return", -1);

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  });
}