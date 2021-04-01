import query from "../const/connection";
import formParse from "../const/form";
import { isUserHasPrivileges, getUserIdByToken,PRIVILEAPI } from "../const/querySample";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function (req, res) {
    const {name,token,storeid} = await formParse(req);
    
    const accepted = await isUserHasPrivileges(token,storeid,[PRIVILEAPI.OWNER,PRIVILEAPI.FACILITY]);
    
    if(accepted) {
        const addRes = await query("INSERT INTO `store-table-group`(`storeid`, `name`) VALUES (?,?)",[storeid,name]);
        if(addRes){
            res.status(200).json({message:"Thêm thành công"})
        }else{
            res.status(202).json({message:"Lỗi không rõ xảy ra"})
        }
    }else{
        res.status(202).json({message:"Yêu cầu quyền cơ sở vật chất hoặc cao hơn"})
    }

}

