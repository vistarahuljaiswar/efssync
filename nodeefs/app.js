var dotenv = require('dotenv');
dotenv.config();

var fs = require('fs');
var cloudinary = require('cloudinary').v2;
const http = require('http');
const uploadDir = 'uploadfiles/';
if (!fs.existsSync('uploadfiles')) {
    fs.mkdirSync('uploadfiles');
}

function callCloudinaryAPI(type, no, cursor) {
    let opt = {
        resource_type: type || 'image',
        max_results: no || 10
    }
    if (cursor) {
        opt.next_cursor = cursor
    }
    cloudinary.api.resources(opt, function (error, result) {

        console.log(result)
        for (let i = 0; i < result.resources.length; i++) {
            var folders = getFolderName(result.resources[i].public_id)
            if (folders) {
                var tmp = ''
                folders.forEach(function (folder) {

                    if (!fs.existsSync(uploadDir + tmp + folder)) {
                        fs.mkdirSync(uploadDir + tmp + folder);
                    }

                    tmp += folder + '/';
                })
            }
            var url = '';
            if (result.resources[i].format) {
                url = uploadDir + result.resources[i].public_id + "." + result.resources[i].format;
            }
            else {
                url = uploadDir + result.resources[i].public_id
            }
            downloadFile(result.resources[i].url, url, function (err) {
                console.log(err);
            });
            
        }
        console.log("Calling the next 10")
        if (result.next_cursor)
            callCloudinaryAPI('image', 200, result.next_cursor);


    });


}
const fileTypes = ['image', 'raw', 'video']

for (var i = fileTypes.length - 1; i >= 0; i--) {
    callCloudinaryAPI(fileTypes[i], 200);
}


function getFolderName(path) {
    var res = path.split("/").slice(0, -1);
    if (res.length < 1) {
        console.log('Np Folder');
        return false;
    } else {
        return res
    }

}

var downloadFile = function (url, dest, cb) {
    var file = fs.createWriteStream(dest);
    http.get(url, function (res) {
        //res.setEncoding('binary');
        res.pipe(file);
        file.on('finish', function () {
            file.close(cb);
        });
    });
};