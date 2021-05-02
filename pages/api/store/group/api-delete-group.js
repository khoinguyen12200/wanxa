import query from "../../const/connection";
import Privileges from "../../../../components/Privileges";

export default async function (req, res) {
    const {groupid} = req.body;
    
    const {storeid,privileges,userid} = req.headers;


    const accepted =Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER,Privileges.Content.FACILITY])
    
    if(accepted) {
        const delRes = await query("DELETE FROM `store-table-group` where id = ?",[groupid]);
        console.log(groupid)
        if(delRes){
            res.status(200).json({message:"Xóa nhóm bàn thành công"})
        }else{
            res.status(202).json({message:"Lỗi không rõ xảy ra"})
        }
    }else{
        res.status(202).json({message:"Yêu cầu quyền cơ sở vật chất hoặc cao hơn"})
    }

}

