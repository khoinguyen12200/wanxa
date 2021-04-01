import query from "../const/connection";
import formParse from "../const/form";
import { isUserHasPrivileges, PRIVILEAPI } from "../const/querySample";

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

    const accepted = await isUserHasPrivileges(token,storeid,[PRIVILEAPI.OWNER,PRIVILEAPI.FACILITY]);
    
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

