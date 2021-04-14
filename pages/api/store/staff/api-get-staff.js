import query from '../../const/connection';
import formParse from '../../const/form'


export const config = {
    api: {
      bodyParser: false,
    },
}
export default async function index(req, res){
    
    const {storeid} = await formParse(req);
    const staffs = await query("SELECT USER.id,USER.name,USER.avatar,USER.description,PRIVILEGES.value as privilege"+
    " FROM privileges RIGHT JOIN USER ON USER.ID = privileges.USERID WHERE STOREID = ?",[storeid]);
    res.status(200).json(staffs);

}