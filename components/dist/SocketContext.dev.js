"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.socket = void 0;

var _react = _interopRequireDefault(require("react"));

var _socket = _interopRequireDefault(require("socket.io-client"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getHostname = function getHostname() {
  var hostname = typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "";
  var p = process.env.PORT || "3000";
  console.log(hostname + ":" + p);
  return hostname + ":" + p;
};

var socket = _socket["default"].connect(getHostname());

exports.socket = socket;

var SocketContext = _react["default"].createContext();

var _default = SocketContext;
exports["default"] = _default;