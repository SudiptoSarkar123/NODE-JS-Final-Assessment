const User = require('../model/user.model')
const jwt = require('jsonwebtoken')
const { sendMail } = require('../helper/sendEmail')
const bcrypt = require('bcryptjs')

class authController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body
            if (!name || !email || !password) {
                return res.status(400).json({
                    message: 'All fields are required'
                })
            }
            const user = await User.findOne({ email })
            if (user) {
                return res.status(400).json({
                    message: 'Email already exists'
                })
            }

            // if (req.file) {
            //     if (user.profilePic) {
            //         const prevImagePath = path.join(__dirname, '../..', currentUser.profilePic);
            //         if (fs.existsSync(prevImagePath)) {
            //             fs.unlinkSync(prevImagePath);
            //         }
            //     }
            // }

            const token = jwt.sign({ email }, process.env.JWT_SECRET)
            const url = `${process.env.BASE_URL}/api/v1/auth/verify/${token}`
            const html = `
            <h1>Hello ${name}</h1>
            <p>Username : ${email}</p>
            <p>Password : ${password}</p>
            <p>Please click the link below to verify your email address</p>
            <a href=${url}>${url}</a>
            `
            const isMailSent = await sendMail(email, html)
            if (isMailSent === 'failed') {
                console.log('Email not sent')
                return res.status(500).json({
                    message: 'Something went wrong'
                })
            }


            // ...existing code...
            const newUser = new User({
                name,
                email,
                password,
                avatar: req.file ? 'uploads/' + req.file.filename : '', // fallback if no file
                bio: 'I am a new user'
            })
            // ...existing code...
            await newUser.save()
            res.status(201).json({
                message: 'User created successfully'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Something went wrong'
            })
        }
    }

    async verifyEmail(req, res) {
        try {
            console.log('verifying email...')
            const { token } = req.params
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const { email } = decoded
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({
                    message: 'User not found'
                })
            }
            if (user.isVerified) {
                return res.status(400).json({
                    message: 'Email already verified'
                })
            }
            user.isVerified = true

            await user.save()
            res.status(200).json({
                message: 'Email verified successfully'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Something went wrong'
            })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                return res.status(400).json({
                    message: 'All fields are required'
                })
            }
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({
                    message: 'User not found'
                })
            }
            if (!user.isVerified) {
                return res.status(400).json({
                    message: 'Email not verified'
                })
            }
            // ...existing code...
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({
                    message: 'Invalid credentials'
                })
            }
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
            res.status(200).json({
                message: 'Login successful',
                token
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Something went wrong'
            })
        }
    }

    
}


module.exports = new authController()