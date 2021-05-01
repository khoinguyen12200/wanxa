var jwt = require('jsonwebtoken');
var MyJsonWebToken = require('../../../server-jwt');

const secret = 'asdfasdfasdfasdfasdfasdfasdfasdf';

export const signToken = MyJsonWebToken.signToken;

export const getUserId = MyJsonWebToken.getUserId;