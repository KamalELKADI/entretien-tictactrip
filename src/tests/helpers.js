// For test we force NODE_ENV to equal 'test'
process.env.NODE_ENV = 'test';
const app = require('../app');


const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const m = require('../models');

chai.use(require('chai-http'));
chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));
chai.should();

const expect = chai.expect;
const request = chai.request;




afterEach(() => {
	sinon.restore()
})

after(async () => {
	await mongoose.connection.db.dropDatabase()
	await mongoose.connection.close()
})

module.exports = {
	app,
	m,
	sinon,
	expect,
	request,
	mongoose
}