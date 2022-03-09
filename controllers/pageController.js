import { createTransport, getTestMessageUrl } from "nodemailer";
import { find } from '../models/Course';
import { countDocuments } from '../models/User';


export async function getIndexPage(req, res) {
  const courses = await find().sort('-createdAt').limit(2);
  const totalCourses = await find().countDocuments();
  const totalStudents = await countDocuments({role: 'student'});
  const totalTeachers = await  countDocuments({role: 'teacher'});
 
  res.status(200).render("index", {
    page_name: "index",
    courses,
    totalCourses,
    totalStudents,
    totalTeachers
  });
}

export function getAboutPage(req, res) {
  res.status(200).render("about", {
    page_name: "about",
  });
}

export function getRegisterPage(req, res) {
  res.status(200).render("register", {
    page_name: "register",
  });
}

export function getLoginPage(req, res) {
  res.status(200).render("login", {
    page_name: "login",
  });
}
// Contact kısmını oluşturalım
export function getContactPage(req, res) {
  res.status(200).render("contact", {
    page_name: "contact",
  });
}

export async function sendEmail(req, res) {
  
  try{ 
  /* aşşağıdaki html yapısı contact sayfasındaki name email ve message kısmıyla uyumlu olmalı 
  bu html yapısı gelen email in nasıl gözükeceğinide belirliyor*/
  const outputMessage = `
    <h1>Mail Details</h1>
    <ul>
      <li>${req.body.name}</li>
      <li>${req.body.email}</li>
    </ul>
    <h1>Message</h1>
    <p>${req.body.message}</p>
  `
  /* ardından burada nodemailler isimli üçüncü parti yazılımı indirerek ayarlarımızı yapmya başlıyoruz
  ilk olarak host kısmında hangi email servisinden yararlanacağımızı belirledik. */
  let transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "irfnk83@gmail.com", // gmail account
      pass: "nkiqxvtavpirdkpa11", // gmail password
    },
  });
/* ardından host ayarlarımızı ve kullanıcı mailimizi yaptık buradaki pass kısmını
google ayarlardan uygulamaya yönelik sadece orada geçerli olacak şifre oluşturarak yaptık*/
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Smart Edu Contact Form" <irfnk83@gmail.com>', // sender address
    to: "kocaksoyirfan@gmail.com", // list of receivers
    subject: "Smart Edu Contact Form new message", // Subject line
    html: outputMessage, // html body
  });
/* ardından let info değişkeni bizim maili hangi hesaba yönlendireceğimizle alakalı kısım
burada hedef email adresini gösterdik ve yukarıda oluşturduğumuz html yapısını vererek gönderilecek olan mailin şekline eşitledik*/
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

/* burada flash mesaj kısmını yapalım */
  req.flash("success", "We Received you message succusfully");

  res.status(200).redirect('contact');
/* son olarak console ile mailimizin durumunu gördük ve ardından tres.status ile mail göndeerildiği durumda 
200 onay kodunu alarak contact sayfamıza geri yönlendirildik.*/ 

}catch(err){
  //req.flash("error", `Something happened! ${err}`);
  req.flash("error", `Something happened!`);
  res.status(200).redirect('contact');
}

}


