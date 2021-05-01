"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserId = exports.signToken = void 0;

var jwt = require('jsonwebtoken');

var MyJsonWebToken = require('../../../server-jwt');

var secret = 'asdfasdfasdfasdfasdfasdfasdfasdf';
var signToken = MyJsonWebToken.signToken;
exports.signToken = signToken;
var getUserId = MyJsonWebToken.getUserId;
exports.getUserId = getUserId;