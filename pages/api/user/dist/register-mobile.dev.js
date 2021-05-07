"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _connection = _interopRequireDefault(require("../const/connection"));

var _form = _interopRequireDefault(require("../const/form"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _callee(req, res) {
  var _ref, name, account, password, avatar, body;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _form["default"])(req));

        case 2:
          _ref = _context.sent;
          name = _ref.name;
          account = _ref.account;
          password = _ref.password;
          avatar = _ref.avatar;
          _context.next = 9;
          return regeneratorRuntime.awrap((0, _form["default"])(req));

        case 9:
          body = _context.sent;
          console.log(body);
          res.status(200).send("test"); // var avatar = files != null ? files.avatar : "";
          // console.log("avatar",avatar)
          // const uploadDir = avatar ? await upLoadAvatar(avatar,userAvatarDir) : "";
          // const isExisting = await query("SELECT `id` FROM USER where account = ?", account) || true;
          // if(isExisting.length > 0) {
          //     res.status(202).json({message:"User existed"});
          //     return;
          // }
          // const result = await query("INSERT INTO `user`(`account`, `password`, `name`, `avatar`) VALUES (?,?,?,?)",
          // [account,md5(password),name,uploadDir]);
          // if(result){
          //     res.status(200).json({message:"Your account has been created successfully"});
          // }else{
          //     res.status(202).json({message:"Unknow error"});
          // }

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
}