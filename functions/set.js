// const mongoose = require('mongoose')
const db = require('./db')
const { msgModel } = require('./db/models/SongModel')
db()

const handler = async (event) => {
  try {
    // console.log(event.queryStringParameters, event.body)
    const { song, msg } = JSON.parse(event.body)

    if (!msg) return { statusCode: 400, body: 'msg is required' }

    const data = new msgModel({
      song,
      msg
    })
    const res = await data.save()
    console.log(res)
    return {
      statusCode: 200,
      body: JSON.stringify(res, null, 2),
      headers: {
        'Content-Type': 'text/json;charset=utf-8'
      }
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
