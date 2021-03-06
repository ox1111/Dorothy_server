const nodemailer = require('nodemailer');
const config = require('../../config.js');
const rndstring = require("randomstring");

function sendMail(email, subject, content) {
  console.log(email);

  let transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
          user: config.user,  // gmail 계정 아이디를 입력
          pass: config.pass          // gmail 계정의 비밀번호를 입력
      }
  });

  let mailOptions = {
      from: 's2017s25@e-mirim.hs.kr',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
      to: email ,                     // 수신 메일 주소
      subject: '['+subject+']미림 동아리 통합 관리 솔루션, 도로시입니다. ',   // 제목
      html: content
  };

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      }
      else {
          console.log('Email sent: ' + info.response);
      }
  });
};

module.exports = (app, Confirm)=>{
    app.post("/mailAuth", async (req,res) => {
        let email = req.body.email;
        let email_token = rndstring.generate(10);
        let content = '<p>회원가입 완료를 위해 아래의 인증코드를 인증코드 입력란에 넣어주세요!</p>' +
        "<p>" + email_token + "</p>";
        let subject = '이메일 인증'
        await sendMail(email, subject, content);
        let confirm = await new Confirm({email:email, email_token:email_token});
        Confirm.findOneAndUpdate({email: email}, {email_token: email_token}, {upsert: true}, (err)=>{
          if(err) {
            res.status(400).json({"message":"error!"}); 
          } else {
              res.status(200).json(confirm); 
            }
        });
    })
    
    .post("/mailAuthCheck", async (req,res) => {
        //인증번호 확인하면 삭제
        await Confirm.findOneAndRemove({email:req.body.email, email_token: req.body.email_token}, (err, data)=>{
            if (err){            
                res.send(err);
            } else {
                if( data == null){
                    res.status(204).send("인증에 실패하였습니다.");
                }
                else res.status(200).send("성공적으로 인증되었습니다.");
            }
        }); 
    })
    
    .post('/aaConfirm', async(req,res)=>{
        var result = await Confirm.find()
        res.send(result)
    })
};



