import query from '../../const/connection';

export default async function index(req, res){

    const { privileges, userid, storeid } = req.headers;
    const staffs = await query("SELECT USER.id,USER.name,USER.avatar,USER.description,PRIVILEGES.value as privilege"+
    " FROM privileges RIGHT JOIN USER ON USER.ID = privileges.USERID WHERE STOREID = ?",[storeid]);
    res.status(200).json(staffs);

}