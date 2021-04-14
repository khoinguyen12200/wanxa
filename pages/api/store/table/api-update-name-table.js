import query from "../../const/connection";
import formParse from "../../const/form";
import { getUserIdByToken,getPrivileges } from "../../const/querySample";
import Privileges from '../../../../components/Privileges';
export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function (req, res) {
    const {token,name,tableid} = await formParse(req);

    const groupRes = await query("SELECT `groupid` from `store-table` where id = ? ",tableid);
    const groupid = groupRes.length != 0 ? groupRes[0].groupid : -1;
    
    const storeRes = await query("SELECT `storeid` from `store-table-group` where id = ?",groupid);
    const storeid = storeRes.length != 0 ? storeRes[0].storeid : -1;

    const userid = await getUserIdByToken(token);
    const priValue = await getPrivileges(userid, storeid);


    const accepted =Privileges.isValueIncluded(priValue,[Privileges.Content.OWNER,Privileges.Content.FACILITY]);
    
    if(accepted) {
        const updateRes = await query("UPDATE `store-table` SET `name`=? WHERE id=?",[name,tableid]);

        if(updateRes){
            res.status(200).json({message:"Thay đổi tên bàn thành công"})
        }else{
            res.status(202).json({message:"Lỗi không rõ xảy ra"})
        }
    }else{
        res.status(202).json({message:"Yêu cầu quyền cơ sở vật chất hoặc cao hơn"})
    }

}

