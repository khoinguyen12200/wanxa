var jwt = require("jsonwebtoken");

const secret = "asdfasdfasdfasdfasdfasdfasdfasdf";


function signToken(userid,privileges){
    const privilegesValue = privileges.map(pri => ({storeid:pri.storeid,value:pri.value}))
    return jwt.sign({ userid:userid,privileges:privilegesValue }, secret ,{expiresIn:"7d"});
}
function getUserId(req){
   return verify(req).userid;
    
}


function verify(req) {
	const token = req.headers.authorization;
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
		const jsonToken = verify(req);
		const privileges = jsonToken.privileges;
		for (let privilege of privileges) {
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
    signToken,
	verify: verify,
	getUserId: getUserId,
	getPrivileges: getPrivileges,
};
