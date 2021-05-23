import query from "../../const/connection";
import Privileges from '../../../../components/Privileges';

export default async function (req, res) {
    const {name,id} = req.body;
   
    const { storeid, userid, privileges } = req.headers;


    const accepted =Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER,Privileges.Content.FACILITY]);
    
    if(accepted) {
        const updateRes = await query("UPDATE `store-table` SET `name`=? WHERE id=?",[name,id]);

        if(updateRes){
            res.status(200).json({message:"Thay đổi tên bàn thành công"})
        }else{
            res.status(202).json({error:true,message:"Lỗi không rõ xảy ra"})
        }
    }else{
        res.status(202).json({error:true,message:Privileges.ErrorMessage(Privileges.Content.FACILITY)})
    }

}

