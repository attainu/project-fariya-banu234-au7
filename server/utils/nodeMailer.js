const nodemailer = require('nodemailer')


const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD
    }
})

transport.verify().then((res) => console.log(res))


function sendMailToUser(user,email,activationToken) {
    transport.sendMail({
        from: process.env.GMAIL,
        to: email,
        subject: 'Email verification required for authenticating your Registration on ChatHub.com',
        html: `Click on this link to activate your account on <b>Chat-Hub</b>  https://big-buy.herokuapp.com/api/user/accountactivation/${activationToken}?user=${user}`,
    }).then((response) => {
        console.log(response);
    }).catch((err) => console.log(err.message))
}

function forgotPasswordMailing(email,password) {
    transport.sendMail({
        from: process.env.GMAIL,
        to: email,
        subject: `System generated password to login into ChatHub.com`,
        html: `<p>This password is system generated password to login into your account on <b>Chathub.com</b>. Please Login with this password and change your password in profile section if needed.</p>
        <h3>Password: ${password}`
    }).then((response) => {
        console.log(response);
    }).catch((err) => console.log(err.message))
}



module.exports={sendMailToUser, forgotPasswordMailing};