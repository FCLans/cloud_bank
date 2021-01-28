const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  accessLink: { type: String },
  size: { type: Number, default: 0 },
  path: { type: String, default: '' },
  user: { type: Types.ObjectId, ref: 'File' },
  parent: { type: Types.ObjectId, ref: 'File' },
  childs: [{ type: Types.ObjectId, ref: 'File' }],
})

module.exports = model('File', schema)
