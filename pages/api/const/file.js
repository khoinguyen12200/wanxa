import { v4 as uuidv4 } from 'uuid';
var fs = require("fs");

export const publicDir = "./public/";
export const userDir = "/user/";
export const userAvatarDir = "/user/avatar";

export function fileExists(dir) {
	return new Promise((resolve, reject) => {
		fs.stat(dir, (err, stat) => {
			if (err) resolve(false);
			resolve(true);
		});
	});
}

export function moveFile(oldPath, newPath) {
	return new Promise((resolve, reject) => {
		fs.copyFile(oldPath, newPath, function (err) {
			if (err) reject(err);
			resolve("Move file successful");
		});
	});
}

export async function upLoadAvatar(file,path,name){
  var newPath = path+"/"+name;
  if(name == undefined){
    while(true){
      newPath = path+"/avatar-"+ uuidv4();
      const existed = await fileExists(getPublic(newPath));
      if(!existed){
        break;
      }
    }
  }
  const pathWithExtension = newPath+"."+getExtension(file.name)
  console.log(pathWithExtension);
  moveFile(file.path,getPublic(pathWithExtension))
  return cleanPath(pathWithExtension);
}

export function getExtension(filename) {

  var name = filename || '';
  var arr = name.split('.');
  return arr[arr.length - 1];
}

function getPublic(path){
  return publicDir+"/"+path;;
}
function cleanPath(path){
  var str = path || "";
  while(str.search("//") != -1){str = str.replace("//","/")}
  return str;

}