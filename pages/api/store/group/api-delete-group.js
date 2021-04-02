import query from "../../const/connection";
import formParse from "../../const/form";
import { isUserHasPrivileges, getUserIdByToken,PRIVILEAPI } from "../../const/querySample";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function (req, res) {
    const {token,groupid} = await formParse(req);
    
    const storeRes = await query("SELECT `storeid` from `store-table-group` where id = ?",groupid);
    const storeid = storeRes.length != 0 ? storeRes[0].storeid : -1;

    const accepted = await isUserHasPrivileges(token,storeid,[PRIVILEAPI.OWNER,PRIVILEAPI.FACILITY]);
    
    if(accepted) {
        const delRes = await query("DELETE FROM `store-table-group` where id = ?",[groupid]);
        console.log(groupid)
        if(delRes){
            res.status(200).json({message:"Xóa thành công nhóm"})
        }else{
            res.status(202).json({message:"Lỗi không rõ xảy ra"})
        }
    }else{
        res.status(202).json({message:"Yêu cầu quyền cơ sở vật chất hoặc cao hơn"})
    }

}

