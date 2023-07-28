const mongoose = require('mongoose')

let msgSchema = new mongoose.Schema({
  song: String,
  msg: String
})

let msgModel = mongoose.model('msg', msgSchema)

module.exports = {
  msgModel
}
