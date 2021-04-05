import query from "../const/connection";
import formParse from "../const/form";
import { v4 as uuidv4 } from 'uuid';
import {getUserById} from '../const/querySample'

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function (req, res) {
	const { account } = await formParse(req);

    const account = await query("SELECT * FROM  `user` where `account` = ?",account);
    if(account.length > 0) {
        res.status(200).json(account);
    }else{
        res.status(202).json(account);
    }

}
