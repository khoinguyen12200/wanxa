import query from "../../const/connection";
import formParse from "../../const/form";
import { getPrivileges } from "../../const/querySample";
import {getUserId} from '../../const/jwt'
import Privileges from '../../../../components/Privileges';
export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function (req, res) {
    const {tableid} = await formParse(req);
    const userid = getUserId(req);

    const groupRes = await query("SELECT `groupid` from `store-table` where id = ? ",tableid);
    const groupid = groupRes.length != 0 ? groupRes[0].groupid : -1;
    
    const storeRes = await query("SELECT `storeid` from `store-table-group` where id = ?",groupid);
    const storeid = storeRes.length != 0 ? storeRes[0].storeid : -1;

    const priValue = await getPrivileges(userid, storeid);


    const accepted =Privileges.isValueIncluded(priValue,[Privileges.Content.OWNER,Privileges.Content.FACILITY]);
    
    if(accepted) {
        const deleteRes = await query("delete from `store-table`  WHERE id=?",[tableid]);

        if(deleteRes){
            res.status(200).json({message:"Xóa bàn thành công"})
        }else{
            res.status(202).json({message:"Lỗi không rõ xảy ra"})
        }
    }else{
        res.status(202).json({message:"Yêu cầu quyền cơ sở vật chất hoặc cao hơn"})
    }

}

