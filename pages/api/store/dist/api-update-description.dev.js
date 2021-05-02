"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;
exports.config = void 0;

var _connection = _interopRequireDefault(require("../const/connection"));

var _form = _interopRequireDefault(require("../const/form"));

var _querySample = require("../const/querySample");

var _jwt = require("../const/jwt");

var _Privileges = _interopRequireDefault(require("../../../components/Privileges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var config = {
  api: {
    bodyParser: false
  }
};
exports.config = config;

function _callee(req, res) {
  var _ref, description, _req$headers, storeid, userid, privileges, check, changeRes;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _form["default"])(req));

        case 2:
          _ref = _context.sent;
          description = _ref.description;
          _req$headers = req.headers, storeid = _req$headers.storeid, userid = _req$headers.userid, privileges = _req$headers.privileges;
          check = _Privileges["default"].isValueIncluded(privileges, [_Privileges["default"].Content.OWNER]);

          if (check) {
            _context.next = 9;
            break;
          }

          res.status(401).send({
            message: _Privileges["default"].ErrorMessage(_Privileges["default"].Content.OWNER)
          });
          return _context.abrupt("return");

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap((0, _connection["default"])("update `store` set `description`=? where id =?", [description, storeid]));

        case 11:
          changeRes = _context.sent;

          if (!changeRes) {
            _context.next = 15;
            break;
          }

          res.status(200).json({
            message: "Thay đổi thành công"
          });
          return _context.abrupt("return");

        case 15:
          res.status(202).json({
            message: "Có lỗi xảy ra"
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
}