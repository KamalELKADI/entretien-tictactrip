const moment = require('moment');
const { expect, sinon, m } = require('./helpers')
const { security } = require('../middlewares');

describe('middlewares', () => {

	describe('security', () => {
    
		describe('authenticate', () => {

			afterEach( async () => {
				await m.Session.deleteMany({})
			})

			context('when token is missing', () => {

				let req
				let res
				let next
				let statusSpy
				let sendSpy

				beforeEach(async () => {
					// given
					req = {
						headers: {
							'x-api-token': undefined
						}
					};
					res = {
						status: () => res,
						send: () => res
					}
					next = sinon.spy(() => {});

					statusSpy = sinon.spy(res, 'status')
					sendSpy = sinon.spy(res, 'send')

					// when
					await security.authenticate(req, res, next);
				})

				it('should return a 401 status', () => {
					// then
					expect(statusSpy).to.have.been.calledWith(401);
				})

				it('should return an MISSING CREDENTIALS message', () => {
					// then
					expect(sendSpy).to.have.been.calledWith('MISSING CREDENTIALS');
				})

			})
      
			context('when token is not linked to a session', () => {

				let req
				let res
				let next
				let statusSpy
				let sendSpy

				beforeEach(async () => {
					// given
					req = {
						headers: {
							'x-api-token': 'not_linked_token'
						}
					};
					res = {
						status: () => res,
						send: () => res
					}
					next = sinon.spy(() => {});

					statusSpy = sinon.spy(res, 'status')
					sendSpy = sinon.spy(res, 'send')

					// when
					await security.authenticate(req, res, next);
				})

				it('should return a 401 status', () => {
					// then
					expect(statusSpy).to.have.been.calledWith(401);
				})

				it('should return an UNAUTHORIZED ACTIONS message', () => {
					// then
					expect(sendSpy).to.have.been.calledWith('UNAUTHORIZED ACTIONS');
				})

			})

			context('when token is valid', () => {

				let req
				let res
				let next
				let token = 'valid_token'

				before(async () => {
					await m.Session.create({ email: 'email@gmail.com', token });
				})

				beforeEach(async () => {
					// given
					req = {
						headers: {
							'x-api-token': token
						}
					};
					res = {
						status: () => res,
						send: () => res
					}
					next = sinon.spy(() => {});

					// when
					await security.authenticate(req, res, next);
				})

				it('should call next', () => {
					// then
					expect(next).to.have.been.calledOnce;
				})

			})

		})

		describe('limitRateByWords', () => {

			context('when session.words + words is under maximum limit', () => {

				let req
				let res
				let next
				let session

				afterEach(async () => {
					await m.Session.deleteMany({});
				})

				beforeEach(async () => {
					// given
					session = await m.Session.create({ email: 'test@gmail.com', token: 'secret_token' })
					req = {
						body: 'Un texte qui à besoin d\'être justifier',
						injections: { session }
					};
					res = {
						status: () => res,
						send: () => res
					}
					next = sinon.spy(() => {});

					// when
					await security.limitRateByWords(req, res, next);
				})

				it('should call next', () => {
					// then
					expect(next).to.have.been.calledOnce;
				})

				it('should update session words counter', async () => {
					// then
					let session = await m.Session.findOne({ token: 'secret_token' })
					expect(session.words).to.equal(req.body.split(' ').filter( x => x).length)
				})

			})

			context('when session.words + words is above maximum limit', () => {

				let req
				let res
				let next
				let session				
				let statusSpy
				let sendSpy
        
				afterEach(async () => {
					await m.Session.deleteMany({});
				})

				beforeEach(async () => {
					// given
					session = await m.Session.create({ email: 'test@gmail.com', token: 'secret_token', words: process.env.LIMIT_RATE_WORDS })
					req = {
						body: 'Un texte qui à besoin d\'être justifier',
						injections: { session }
					};
					res = {
						status: () => res,
						send: () => res
					}
					next = sinon.spy(() => {});

					statusSpy = sinon.spy(res, 'status')
					sendSpy = sinon.spy(res, 'send')

					// when
					await security.limitRateByWords(req, res, next);
				})

				it('should return a 402 status', () => {
					// then
					console.log(statusSpy);
					expect(statusSpy).to.have.been.calledWith(402);
				})

				it('should return an Payment Required message', () => {
					// then
					console.log(sendSpy);
					expect(sendSpy).to.have.been.calledWith('Payment Required');
				})

			})

			context('when it\'s a new day', () => {

				let req
				let res
				let next
				let session
        
				afterEach(async () => {
					await m.Session.deleteMany({});
				})

				beforeEach(async () => {
					// given
					session = await m.Session.create({ 
						email: 'test@gmail.com', 
						token: 'secret_token', 
						words: 7000
					});
					session.tsUpdated = moment().subtract(1, 'days').startOf('day')
					// session = await session.save();

					req = {
						body: 'Un texte qui à besoin d\'être justifier',
						injections: { session }
					};
					res = {
						status: () => res,
						send: () => res
					}
					next = sinon.spy(() => {});

					// when
					await security.limitRateByWords(req, res, next);
				})

				it('should call next', () => {
					// then
					expect(next).to.have.been.calledOnce;
				})

				it('should update session words counter', async () => {
					// then
					let session = await m.Session.findOne({ token: 'secret_token' })
					expect(session.words).to.equal(req.body.split(' ').filter( x => x).length)
				})

			})

		})

	})
  
})

