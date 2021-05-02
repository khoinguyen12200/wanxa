import query from "../../const/connection";
import Privileges from '../../../../components/Privileges';

export default async function (req, res) {
    const {newName,groupid} =req.body;
   
    
    const {storeid,privileges,userid} = req.headers;


    const accepted = Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER,Privileges.Content.FACILITY])
    
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

