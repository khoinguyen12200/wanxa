import query from "../const/connection";
import { PRIVILE } from "../../../components/Const";

export async function getUserById(id) {
	const users = await query(
		"SELECT `id`, `account`,  `name`, `avatar` from user WHERE id = ?",
		id
	);
    if(users.length > 0) {
        var user = users[0];
        const stores = await query("SELECT `storeid`,`logo`,`name`,`value`,`description` FROM `privileges` right join `store` on privileges.storeid = store.id WHERE userid = ?",id);
        user.stores = [...stores];
        return user;
    }else{
        return null;
    }
}

export async function getUserIdByToken(token) {
    const users = await query("select `userid` from `user-token` where token = ?",[token])
    return users.length > 0 ? users[0].userid : null;
}
export async function getPrivileges(userid,storeid){
    const privileges = await query("SELECT * FROM `privileges` WHERE userid=? and storeid=?",[userid,storeid]);
    if(privileges.length > 0){
        return privileges[0].value;
    }else{
        return null;
    }
}

export async function isUserHasPrivileges(token,storeid,arrOfPrivileges){
    const priValue = await getPrivileges(token,storeid);

    for(let i in arrOfPrivileges) {
        const targetRight = arrOfPrivileges[i];
        if(PRIVILE.isUserHasPrivileges(priValue,targetRight)){
            return true;
        }
    }
    return false;
}

export const PRIVILEAPI = PRIVILE;
