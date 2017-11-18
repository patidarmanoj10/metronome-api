const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const eventSchema = new Schema({
  _id: { type: String, required: true },
  metaData: { type: Object }
})

module.exports = eventSchema
