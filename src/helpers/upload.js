const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    // destination:path.join(__dirname+'../../public/images/'),
    destination(req, file, cb) {
        cb(null, __dirname+'../../public/images/')
      },
      filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}`+path.extname(file.originalname))
      }
    // filename: function(request,file,cb){
    //    cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    // }
})

const upload = multer({
    storage : storage,
    fileFilter : function(req,file,cb){
        fileTypeCheck(file,cb)
    }
}).single('image')

function fileTypeCheck(file, cb){
    const types = /jpeg|jpg|png/
    const extname = types.test(path.extname(file.originalname).toLowerCase())
    const mimetype = types.test(file.mimetype)

    if (mimetype && extname){
        return cb(null,true)
    }else{
        cb('Error: file must be image')
    }
}

module.exports = upload