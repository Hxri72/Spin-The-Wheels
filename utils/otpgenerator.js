const otpgenerator = require("otp-generator");
require("dotenv").config();

const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const serviceSid = process.env.SERVICESID;
const client = require("twilio")(accountSid, authToken);

module.exports = {
  otpsender: (Phone) => {
    console.log(Phone)
    return new Promise((resolve, reject) => {
      client.verify.v2
        .services(serviceSid)
        .verifications.create({ to:`+91${Phone}`, channel: "sms" })
        .then((verification) => {
          console.log(verification.status)
            if(verification.status === "pending")
            {
                resolve()
            }else{
                console.log(err)
            }
          
        });
    });
  },
  otpverify: (phone,otp) => {
    console.log(phone)
    console.log(otp)
    return new Promise((resolve, reject) => {
    client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({to:`+91${phone}`,code:otp})
      .then((verification_check) => {
        console.log(verification_check.status)
        if(verification_check.status==="approved"){
            resolve({status:true})
        }else{
            console.log(err)
        }
      });
      
    })
  }
};
