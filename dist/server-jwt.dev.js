"use strict";

var jwt = require("jsonwebtoken");

var secret = "asdfasdfasdfasdfasdfasdfasdfasdf";

function signToken(userid, privileges) {
  var privilegesValue = privileges.map(function (pri) {
    return {
      storeid: pri.storeid,
      value: pri.value
    };
  });
  return jwt.sign({
    userid: userid,
    privileges: privilegesValue
  }, secret, {
    expiresIn: "7d"
  });
}

function verify(req) {
  var token = req.headers.authorization;

  if (token) {
    var tokenJson = jwt.verify(token, secret);
    return tokenJson;
  }

  return null;
}

function getUserId(req) {
  try {
    return verify(req).userid;
  } catch (err) {
    return null;
  }
}

function getPrivileges(req, storeid) {
  try {
    var jsonToken = verify(req);
    var privileges = jsonToken.privileges;

    for (var i in privileges) {
      var privilege = privileges[i];

      if (privilege.storeid == storeid) {
        return privilege.value;
      }
    }

    return -1;
  } catch (e) {
    return -1;
  }
}

module.exports = {
  signToken: signToken,
  verify: verify,
  getUserId: getUserId,
  getPrivileges: getPrivileges
};