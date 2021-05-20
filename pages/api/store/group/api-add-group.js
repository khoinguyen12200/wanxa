import query from "../../const/connection";
import Privileges from '../../../../components/Privileges';


export default async function (req, res) {
    const {name} = req.body;

    const {storeid,privileges} = req.headers;

    
    const accepted = Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER,Privileges.Content.FACILITY])
    
    if(accepted) {
        const addRes = await query("INSERT INTO `store-table-group`(`storeid`, `name`) VALUES (?,?)",[storeid,name]);
        if(addRes){
            res.status(200).json({message:"Thêm thành công"})
        }else{
            res.status(202).json({error:true,message:"Lỗi không rõ xảy ra"})
        }
    }else{
        res.status(202).json({error:true,message:"Yêu cầu quyền cơ sở vật chất hoặc cao hơn"})
    }

}

