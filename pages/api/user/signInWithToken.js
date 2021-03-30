import query from "../const/connection";
import formParse from "../const/form";
import { v4 as uuidv4 } from 'uuid';

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function (req, res) {
	const { token } = await formParse(req);

    const validation = await query("SELECT * FROM  `user-token` where `token` = ?",token);
    if(validation.length > 0) {
        const userid = validation[0].userid;
        const user = await query(
            "SELECT `id`, `account`, `name`, `avatar` FROM `user` WHERE id= ?",
            [userid]
        );
        res.status(200).json({message:"Auto sign in successfully", user: user[0]});
    }else{
        res.status(202).json({message:"Token is expired"});
    }

}
