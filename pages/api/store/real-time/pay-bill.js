import query from '../../const/connection';

export default async function (req, res) {
    const {id,token,note} = req.body;

    const updateRes = await query("update `bill`set state = 1,note =? where id = ?",[note,id]);

    res.status(200).end();

}