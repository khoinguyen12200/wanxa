import query from "../const/connection";
import formParse from "../const/form";
import { v4 as uuidv4 } from 'uuid';
import {getUserById} from '../const/querySample'
var md5 = require("md5");

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function (req, res) {
	const { account, password } = await formParse(req);

	const validation = await query(
		"SELECT `id` from user WHERE account = ? and password = ?",
		[account, md5(password)]
	);
    if(validation.length > 0) {
        const user = validation[0];
        const deleteToken = await query("DELETE FROM `user-token` WHERE userid = ?",user.id);
        const tokencode = user.id+"---"+uuidv4();
        const createToken = await query("INSERT INTO `user-token`(`token`, `userid`) VALUES (?,?)",
        [tokencode,user.id]);

        const sampleUser = await getUserById(user.id);
        res.status(200).json({message:"Sign in successfully",token:tokencode,user:sampleUser})
    }else{
        res.status(202).json({message:"Account and password doesn't matches"});
    }
}
