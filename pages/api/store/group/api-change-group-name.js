import query from "../../const/connection";
import formParse from "../../const/form";
import { isUserHasPrivileges, getUserIdByToken,PRIVILEAPI } from "../../const/querySample";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function (req, res) {
    const {newName,token,groupid} = await formParse(req);
    const groupRes = await query("SELECT `storeid` FROM `store-table-group` WHERE id = ?",[groupid])
    const storeid = groupRes.length >0 ? groupRes[0].storeid : -1;
    const accepted = await isUserHasPrivileges(token,storeid,[PRIVILEAPI.OWNER,PRIVILEAPI.FACILITY]);
    
    if(accepted) {
        const updateRes = await query("UPDATE `store-table-group` SET `name`=? WHERE id =?",[newName,groupid]);
        if(updateRes){
            res.status(200).json({message:"Chỉnh sửa thành công"})
        }else{
            res.status(202).json({message:"Lỗi không rõ xảy ra"})
        }
    }else{
        res.status(202).json({message:"Yêu cầu quyền cơ sở vật chất hoặc cao hơn"})
    }

}

