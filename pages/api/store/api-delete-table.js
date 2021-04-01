import query from "../const/connection";
import formParse from "../const/form";
import { isUserHasPrivileges, PRIVILEAPI } from "../const/querySample";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function (req, res) {
    const {token,tableid} = await formParse(req);

    const groupRes = await query("SELECT `groupid` from `store-table` where id = ? ",tableid);
    const groupid = groupRes.length != 0 ? groupRes[0].groupid : -1;
    
    const storeRes = await query("SELECT `storeid` from `store-table-group` where id = ?",groupid);
    const storeid = storeRes.length != 0 ? storeRes[0].storeid : -1;

    const accepted = await isUserHasPrivileges(token,storeid,[PRIVILEAPI.OWNER,PRIVILEAPI.FACILITY]);
    
    if(accepted) {
        const deleteRes = await query("delete from `store-table` WHERE id=?",[tableid]);

        if(deleteRes){
            res.status(200).json({message:"Xóa tên thành công"})
        }else{
            res.status(401).json({message:"Lỗi không rõ xảy ra"})
            
        }
    }else{
        res.status(401).json({message:"Yêu cầu quyền cơ sở vật chất hoặc cao hơn"})
    }

}

