// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
// const mongoose = require('mongoose')
const db = require('./db')
const { msgModel } = require('./db/models/SongModel')
db()

const handler = async (event, context) => {
  try {
    const data = await msgModel.aggregate().project('song msg').sample(1)
    const res = {
      code: 0,
      data: data[0]
    }
    return {
      statusCode: 200,
      body: JSON.stringify(res),
      headers: {
        'Content-Type': 'text/json;charset=utf-8'
      }
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
