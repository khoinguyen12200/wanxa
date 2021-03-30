import query from "../const/connection";

export async function getUserById(id) {
	const users = await query(
		"SELECT `id`, `account`,  `name`, `avatar` from user WHERE id = ?",
		id
	);
    if(users.length > 0) {
        var user = users[0];
        const stores = await query("SELECT `storeid` FROM `owner` WHERE userid = ?",id);
        user.stores = [...stores];
        return user;
    }else{
        return null;
    }
}
