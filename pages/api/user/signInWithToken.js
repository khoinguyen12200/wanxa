import query from "../const/connection";
import formParse from "../const/form";
import { v4 as uuidv4 } from 'uuid';
import {getUserById} from '../const/querySample'
import {getUserId} from '../const/jwt'
var MyJsonWebToken = require('../../../server-jwt');

export default async function (req, res,) {
	const userid = getUserId(req);
    if(userid) {
        const user = await getUserById(userid);
        const privileges = await query("Select * from privileges where userid = ?",userid);
        const token = MyJsonWebToken.signToken(userid,privileges)
        res.status(200).json({message:"Đăng nhập tự động thành công", user: user,token:token});
    }else{
        res.status(200).json({error:true,message:"Token đã hết hạn, hãy đăng nhập lại"});
    }

}
