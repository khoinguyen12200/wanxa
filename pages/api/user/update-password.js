import query from "../const/connection";
import {getUserId} from '../const/jwt'
var md5 = require('md5');

export default async function (req, res) {

    const {oldPassword,newPassword} = req.body;

    const userid =getUserId(req);
  
    const isExisting = await query ("Select * from user where id = ? and password = ?",[userid,md5(oldPassword)]);
    if(isExisting.length > 0) {
        const update = await query("update user set password = ? where id =?",[md5(newPassword),userid]);
        res.status(200).json({message:"Thay đổi thành công"})
    }else{
        res.status(202).json({message: 'Mật khẩu cũ không khớp'})
    }
	
}
