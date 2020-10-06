const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const sessionSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	token: {
		type: String,
		required: true
	},
	words: {
		type: Number,
		default: 0
	}
},
{
	timestamps: {
		updatedAt: 'tsUpdated',
		createdAt: 'tsCreated'
	}
});

module.exports = mongoose.model('Session', sessionSchema);