import query from "../../const/connection";
import Privileges from '../../../../components/Privileges';
export default async function (req, res) {
    const {id} = req.body;
    const { storeid, userid, privileges } = req.headers;




    const accepted =Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER,Privileges.Content.FACILITY]);
    
    if(accepted) {
        const deleteRes = await query("delete from `store-table`  WHERE id=?",[id]);

        if(deleteRes){
            res.status(200).json({message:"Xóa bàn thành công"})
        }else{
            res.status(202).json({message:"Lỗi không rõ xảy ra"})
        }
    }else{
        res.status(202).send({message:Privileges.ErrorMessage(Privileges.Content.FACILITY)})
    }

}

