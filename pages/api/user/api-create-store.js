import query from "../const/connection";

import Privileges from '../../../components/Privileges'
import formParse from '../const/form'
import {upLoadAvatar,userStoreDir} from '../const/file'

export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function (req, res) {

    const {name,des,files} = await formParse(req);
    const {userid} = req.headers;


    var logo = files != null ? files.logo : "";
    const uploadDir = logo ? await upLoadAvatar(logo,userStoreDir) : "";

    var sqlInsertStore = 'INSERT INTO `store`(`name`, `logo`, `description`) VALUES (?,?,?)';
    var storeRes = await query(sqlInsertStore,[name,uploadDir,des]);
    if(!storeRes) {
        res.status(202).json({message:"Có lỗi truy xuất xảy ra"});
        return;
    }
    const storeId = storeRes.insertId;

    console.log("1")

    const addSql = "INSERT INTO `store-table-group`(`storeid`, `name`) VALUES (?,?)";
    const addRes = await query(addSql,[storeId,"Trung tâm"])

    var priSql = "INSERT INTO `privileges`(`storeid`, `userid`, `value`) VALUES (?,?,?)";
    const priValue = Privileges.arrToValue([Privileges.Content.OWNER])

    var priRes = await query(priSql,[storeId,userid,priValue])
    if(!priRes) {
        res.status(202).json({message:"Có lỗi truy xuất xảy ra"});
        return;
    }
    res.status(200).json({message:"Tạo lập doanh nghiệp thành công"});
	
}