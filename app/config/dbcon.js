const mongoose = require('mongoose')

const dbcon = async ()=>{
    try {
        const dbconnection = await mongoose.connect(process.env.MONGO_URI)
        console.log('Database conneted successfully...')
    } catch (error) {
        console.log('Failed to connect the database...');
        console.log(error)
    }
}

module.exports = dbcon