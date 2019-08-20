var dotenv = require('dotenv');
dotenv.load();

var fs = require('fs');
var cloudinary = require('cloudinary').v2;
const http = require('http');
const uploadDir = 'uploadfiles/';


function callCloudinaryAPI(type, no, cursor){
  let opt = { 
    resource_type: type || 'image',
    max_results: no || 10
  }
  if(cursor)
  {
    opt.next_cursor = cursor
  }
    cloudinary.api.resources(opt, function(error, result){

        console.log(result)
          for(let i=0;i<result.resources.length;i++){
              var folders = getFolderName(result.resources[i].public_id)
              if(folders)
              {
                var tmp = ''
                folders.forEach(function(folder){

                  if (!fs.existsSync(uploadDir+tmp+folder)){
                    fs.mkdirSync(uploadDir+tmp+folder);
                  }

                  tmp+=folder +'/';
                })
              }
            const file = fs.createWriteStream(uploadDir+result.resources[i].public_id+"."+result.resources[i].format);
            const request = http.get(result.resources[i].url, function(response) {
              response.pipe(file);
            });

          }
          console.log("Calling the next 10")
          if(result.next_cursor)
            callCloudinaryAPI('image', 200, result.next_cursor);


      });
 

}
const fileTypes = ['image', 'raw', 'video']

  for (var i = fileTypes.length - 1; i >= 0; i--) {
    callCloudinaryAPI(fileTypes[i], 200);
  }


function getFolderName(path){
  var res = path.split("/").slice(0, -1);
  if(res.length < 1){
    console.log('Np Folder');
    return false;
  }else{
    return res
  }

}



// cloudinary.api.resources(
//   { 
//     resource_type: 'image',
//     max_results: 10,
//     next_cursor:'e6d614f34fd549dac0ee1399b4b663e3874ef8837673e22140fa2eab09052611',
//   }, 
//   function(error, result){

//       console.log(result.resources[1].format);
//       console.log(result.resources[1].public_id);
//       const file = fs.createWriteStream("lbdyfqco12kizhw7ajtx.pdf");
//       const request = http.get("http://res.cloudinary.com/dowh9bxad/image/upload/v1564565580/bills/lbdyfqco12kizhw7ajtx.pdf", function(response) {
//         response.pipe(file);
//       });

//   });

// var fs = require('fs');
// var dir = './tmp';

// if (!fs.existsSync(dir)){
//     fs.mkdirSync(dir);
// }

// var fs = require('fs');
// var dir = './tmp';

// function get_folder_name(str){
//   var dirname = "gallery/mxqc7rygjllkwepj6r5d";
//   var res = dirname.split("/").slice(0, -1);
//   if(res !=''){
//     console.log('Hello');
//     //create_directory_if_not_exits(res);
//   }else{
//     fs.mkdirSync(res);
//   }

// }

// function create_directory_if_not_exits(dir){
   
// }