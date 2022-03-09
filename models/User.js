import { Schema as _Schema, model } from "mongoose";
import { genSalt, hash as _hash } from "bcrypt";
const Schema = _Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student"
  },
  courses:[{
    type: _Schema.Types.ObjectId,
    ref: 'Course'
  }]
});

// password db de açık gözükmesin bunu bcrypt paketi ile veri kaydedilmeden önce şifreli bir hale getirelim
// UserSchema.pre("save", function (next) {
//   const user = this;
//   bcrypt.hash(user.password, 10, (error, hash) => {
//     user.password = hash;
//     next();
//   });
// });

UserSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  genSalt(10, function(err, salt) {
      if (err) return next(err);
      _hash(user.password, salt, function(err, hash) {
          if (err) return next(err);
          user.password = hash;
          next();
      });
  });
});

/* bak şimdi pre metoduna diyorsunki kaydet peki kayıt edelim ama neyi
bu sırada açtın bi fonksiyon fonksiyonun içinde user değişkenine sayfadaki useri atadın thisle peki devam
sonra çaığrdın bcrypt paketinden hash metodunu ki bu metodda verdiğin değerden bağımsız sana 20  baytlık bir çıktı üretiyor mu üretiyor neyse
hash metodunada user.password u verdin mi işte mevzu kopuyo burda ardından callbackfonsiyon içinde de 
passwordu hash e eşitledin mi tamammm e bu middleware olduğundan nextle de çıktın mı dışarı çıktın e döngünde yukarda artık saveledi güzel kardeşim.
senin password artık db de doğrudan parolan gibi gözükmek yerine hash abinin verdiği değerler olarak gözükecek Kriptografik yanee.
*/

const User = model("User", UserSchema);
export default User;
