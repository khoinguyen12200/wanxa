import formidable from 'formidable';

export default function parse (req) {
    return new Promise(function (resolve, reject) {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            if(err){
                reject(err);
            }else{
                resolve({...fields,files});
            }
        
        });
    })   
}
