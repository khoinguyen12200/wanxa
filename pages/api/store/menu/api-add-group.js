import query from '../../const/connection';
import Privileges from '../../../../components/Privileges';
export default async function (req, res) {

    const {name} = req.body;
    const {storeid,privileges,userid} = req.headers;
    
  
    const checked = Privileges.isValueIncluded(privileges,[Privileges.Content.OWNER,Privileges.Content.MENU]);
    
    if(checked){
        const addRes = await query("INSERT INTO `menu-group`(`storeid`, `name`) VALUES (?,?)",[storeid,name]);
        res.status(200).json({message:"Thêm thành công"})
    }else{
        res.status(202).json({error:true,message:"Bạn không đủ quyền để thực hiện yêu cầu"})
    }
}