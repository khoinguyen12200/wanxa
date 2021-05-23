"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;
exports.getNotifications = getNotifications;
exports.getStaffs = getStaffs;
exports.getMenus = getMenus;
exports.getFacilities = getFacilities;

var _connection = _interopRequireDefault(require("../../const/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _req$headers, userid, storeid, privileges, info, bills, internalNotifications, messages, lastSeenMessage, staffs, menus, facilities, data;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$headers = req.headers, userid = _req$headers.userid, storeid = _req$headers.storeid, privileges = _req$headers.privileges;

          if (!(privileges < 0 || privileges == null)) {
            _context.next = 4;
            break;
          }

          res.status(200).json({
            error: true,
            message: "Không thể định danh"
          });
          return _context.abrupt("return");

        case 4:
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(getInfo(storeid));

        case 7:
          info = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(getBills(storeid));

        case 10:
          bills = _context.sent;
          _context.next = 13;
          return regeneratorRuntime.awrap(getNotifications(storeid));

        case 13:
          internalNotifications = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(getMessages(storeid));

        case 16:
          messages = _context.sent;
          _context.next = 19;
          return regeneratorRuntime.awrap(getLastSeenMessage(storeid, userid));

        case 19:
          lastSeenMessage = _context.sent;
          _context.next = 22;
          return regeneratorRuntime.awrap(getStaffs(storeid));

        case 22:
          staffs = _context.sent;
          _context.next = 25;
          return regeneratorRuntime.awrap(getMenus(storeid));

        case 25:
          menus = _context.sent;
          _context.next = 28;
          return regeneratorRuntime.awrap(getFacilities(storeid));

        case 28:
          facilities = _context.sent;
          data = {
            info: info,
            bills: bills,
            internalNotifications: internalNotifications,
            messages: messages,
            lastSeenMessage: lastSeenMessage,
            staffs: staffs,
            menus: menus,
            facilities: facilities
          };
          res.status(200).json({
            message: "Đã tải xong dữ liệu",
            data: data
          });
          _context.next = 36;
          break;

        case 33:
          _context.prev = 33;
          _context.t0 = _context["catch"](4);
          res.status(200).json({
            message: "Có lỗi khi tải dữ liệu",
            error: true
          });

        case 36:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 33]]);
}

function getInfo(storeid) {
  var result;
  return regeneratorRuntime.async(function getInfo$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap((0, _connection["default"])("select * from store where id = ?", [storeid]));

        case 2:
          result = _context2.sent;
          return _context2.abrupt("return", result.length > 0 ? result[0] : null);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function getBills(storeid) {
  var bills, rows, i, bill, row;
  return regeneratorRuntime.async(function getBills$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap((0, _connection["default"])("select * from bill where storeid =? and state = 0", [storeid]));

        case 2:
          bills = _context3.sent;
          rows = [];
          _context3.t0 = regeneratorRuntime.keys(bills);

        case 5:
          if ((_context3.t1 = _context3.t0()).done) {
            _context3.next = 14;
            break;
          }

          i = _context3.t1.value;
          bill = bills[i];
          _context3.next = 10;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `bill-row` WHERE `bill-id` = ?", [bill.id]));

        case 10:
          row = _context3.sent;
          rows.push(row);
          _context3.next = 5;
          break;

        case 14:
          bills.rows = rows;
          return _context3.abrupt("return", bills);

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function getNotifications(storeid) {
  var resu;
  return regeneratorRuntime.async(function getNotifications$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap((0, _connection["default"])("select `internal-notification`.*,user.avatar,user.name as username" + "  from `internal-notification` left join `user` on user.id = `internal-notification`.executor" + " where storeid = ?  order by `internal-notification`.date desc limit ?,?  ", [storeid, 0, 10]));

        case 2:
          resu = _context4.sent;
          return _context4.abrupt("return", resu);

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function getMessages(storeid) {
  var result;
  return regeneratorRuntime.async(function getMessages$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `store-message` WHERE storeid = ? order by time desc limit 50", [storeid]));

        case 2:
          result = _context5.sent;
          return _context5.abrupt("return", result);

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
}

function getLastSeenMessage(storeid, userid) {
  var lastSeens;
  return regeneratorRuntime.async(function getLastSeenMessage$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `last-seen-message` WHERE userid = ? and storeid = ?", [userid, storeid]));

        case 2:
          lastSeens = _context6.sent;

          if (!(lastSeens.length > 0)) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", lastSeens[0]);

        case 5:
          return _context6.abrupt("return", null);

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function getStaffs(storeid) {
  var staffs;
  return regeneratorRuntime.async(function getStaffs$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT USER.id,USER.name,USER.avatar,USER.description,PRIVILEGES.value as privilege" + " FROM privileges RIGHT JOIN USER ON USER.ID = privileges.USERID WHERE STOREID = ?", [storeid]));

        case 2:
          staffs = _context7.sent;
          return _context7.abrupt("return", staffs);

        case 4:
        case "end":
          return _context7.stop();
      }
    }
  });
}

function getMenus(storeid) {
  var groups, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, group;

  return regeneratorRuntime.async(function getMenus$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `menu-group` WHERE storeid = ?", storeid));

        case 2:
          groups = _context8.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context8.prev = 6;
          _iterator = groups[Symbol.iterator]();

        case 8:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context8.next = 16;
            break;
          }

          group = _step.value;
          _context8.next = 12;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `menu-item` WHERE groupid = ?", [group.id]));

        case 12:
          group.list = _context8.sent;

        case 13:
          _iteratorNormalCompletion = true;
          _context8.next = 8;
          break;

        case 16:
          _context8.next = 22;
          break;

        case 18:
          _context8.prev = 18;
          _context8.t0 = _context8["catch"](6);
          _didIteratorError = true;
          _iteratorError = _context8.t0;

        case 22:
          _context8.prev = 22;
          _context8.prev = 23;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 25:
          _context8.prev = 25;

          if (!_didIteratorError) {
            _context8.next = 28;
            break;
          }

          throw _iteratorError;

        case 28:
          return _context8.finish(25);

        case 29:
          return _context8.finish(22);

        case 30:
          return _context8.abrupt("return", groups);

        case 31:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[6, 18, 22, 30], [23,, 25, 29]]);
}

function getFacilities(storeid) {
  var groups, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, group;

  return regeneratorRuntime.async(function getFacilities$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `store-table-group` WHERE storeid = ?", storeid));

        case 2:
          groups = _context9.sent;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context9.prev = 6;
          _iterator2 = groups[Symbol.iterator]();

        case 8:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context9.next = 16;
            break;
          }

          group = _step2.value;
          _context9.next = 12;
          return regeneratorRuntime.awrap((0, _connection["default"])("SELECT * FROM `store-table` WHERE groupid = ?", group.id));

        case 12:
          group.list = _context9.sent;

        case 13:
          _iteratorNormalCompletion2 = true;
          _context9.next = 8;
          break;

        case 16:
          _context9.next = 22;
          break;

        case 18:
          _context9.prev = 18;
          _context9.t0 = _context9["catch"](6);
          _didIteratorError2 = true;
          _iteratorError2 = _context9.t0;

        case 22:
          _context9.prev = 22;
          _context9.prev = 23;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 25:
          _context9.prev = 25;

          if (!_didIteratorError2) {
            _context9.next = 28;
            break;
          }

          throw _iteratorError2;

        case 28:
          return _context9.finish(25);

        case 29:
          return _context9.finish(22);

        case 30:
          return _context9.abrupt("return", groups);

        case 31:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[6, 18, 22, 30], [23,, 25, 29]]);
}