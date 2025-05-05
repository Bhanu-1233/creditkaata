const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  trustScore: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure 'user' field is required
});

module.exports = mongoose.model('Customer', customerSchema);
