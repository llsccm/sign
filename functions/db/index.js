const mongoose = require('mongoose')
const { DBUSER, DBPASSWORD, DBHOST, DBNAME } = process.env

module.exports = function () {
  mongoose.set('strictQuery', false)
  mongoose.connect(`mongodb+srv://${DBUSER}:${DBPASSWORD}@${DBHOST}/${DBNAME}?retryWrites=true&w=majority`, {})
}
