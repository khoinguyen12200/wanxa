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

    const result = await query("SELECT id FROM  `user` where `account` = ?",account);
    res.status(200).json(result);

}
