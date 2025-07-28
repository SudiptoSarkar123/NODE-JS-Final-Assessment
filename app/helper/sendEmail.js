const transporter = require('../config/emailConfig')

const sendMail = async (newUserEmail, html)=>{
    try {
        await transporter.sendMail({
            form:process.env.EMAIL_FROM,
            to:newUserEmail,
            subject:'Email Verification',
            html:html
        })
        console.log('Mail sent successfully')
        return 'success'
    } catch (error) {
        console.log(error)
        return 'failed'
    }
}

module.exports = { sendMail }