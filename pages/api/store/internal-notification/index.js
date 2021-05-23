import {getNotifications} from '../data'

export default async function (req, res) {
    const {storeid} = req.headers
    const resu = await getNotifications(storeid);
    res.json(resu)
}