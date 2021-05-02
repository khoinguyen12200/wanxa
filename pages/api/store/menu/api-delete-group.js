import query from '../../const/connection';
import Privileges from '../../../../components/Privileges';
export default async function (req, res) {

    const {id} = req.body;
    
    const {storeid,privileges,userid} = req.headers;
    const checked = Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER,Privileges.Content.MENU]);
    if(checked){
        const deleteRes = await query("DELETE FROM `menu-group` WHERE id = ?",[id]);
        res.status(200).json({message:"Xóa nhóm thành công"})
    }else{
        res.status(202).json({message:"Bạn không đủ quyền để thực hiện yêu cầu"})
    }
}