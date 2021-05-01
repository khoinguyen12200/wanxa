import query from "../../const/connection";
import formParse from "../../const/form";
import { getUserIdByToken,getPrivileges } from "../../const/querySample";
import {getUserId} from '../../const/jwt'
import Privileges from '../../../../components/Privileges';
export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function (req, res) {
    const {name,storeid} = await formParse(req);
    
    const userid = getUserId(req);
    const priValue = await getPrivileges(userid,storeid);
    
    const accepted = Privileges.isValueIncluded(priValue,[Privileges.Content.OWNER,Privileges.Content.FACILITY])
    
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

