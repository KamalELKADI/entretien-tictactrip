const { request, app, expect, m } = require('./helpers')


describe('api', () => {

	describe('auth', () => {

		describe('token', () => {

			let data
			let response

			context('when email is missing', () => {

				beforeEach(async () => {
					// given
					data = {}

					// when
					response = await request(app).post('/api/token').send(data);
				})

				it('should return a 404 status', () => {
					// then
					expect(response).to.have.status(404);
				})

				it('should return an REQUIRED EMAIL message', () => {
					// then
					expect(response.text).to.equal('REQUIRED EMAIL');
				})

			})

			context('when email is invalid', () => {

				beforeEach(async () => {
					// given
					data = {
						email: 'invalid@email@gmail.com'
					}

					// when
					response = await request(app).post('/api/token').send(data);
				})

				it('should return a 404 status', () => {
					// then
					expect(response).to.have.status(404);
				})

				it('should return an INVALID EMAIL message', () => {
					// then
					expect(response.text).to.equal('INVALID EMAIL');
				})

			})

			context('when there is already a session', () => {

				let session
				let token

				beforeEach(async () => {
					// given
					data = {
						email: 'test@gmail.com'
					}
					token = 'secret_token'

					session = await m.Session.create({ email: data.email, token: token })

					// when
					response = await request(app).post('/api/token').send(data);
				})

				it('should return a 200 status', () => {
					// then
					expect(response).to.have.status(200);
				})

				it('should return the already existing sesison\'s token', () => {
					// then
					expect(response.text).to.equal(session.token);
				})

			})

			context('when there is no session', () => {

				beforeEach(async () => {
					// given
					data = {
						email: 'test@gmail.com'
					}

					// when
					response = await request(app).post('/api/token').send(data);
				})

				it('should return a 200 status', () => {
					// then
					expect(response).to.have.status(200);
				})

				it('should create an session document', async () => {
					// then
					let session = await m.Session.findOne({ email: data.email });
					expect(session).to.not.be.null;
				})

				it('should return the token of the created session', async () => {
					// then
					let session = await m.Session.findOne({ email: data.email });
					expect(session.email).to.equal(data.email);
					expect(response.text).to.equal(session.token);
				})

			})

		})

	})

	describe('text', () => {

		describe('justify', () => {

			let data
			let response
			let session

			before(async () => {
				session = await m.Session.create({ email: 'test@gmail.com', token: 'secret_token' });
			})

			context('when there is no data', () => {

				beforeEach(async () => {
					// given
					data = undefined;
          

					// when
					response = await request(app)
						.post('/api/justify')
						.set('content-type', 'text/plain')
						.set('x-api-token', session.token)
						.send(data);
				})

				it('should return a 200 status', () => {
					// then
					expect(response).to.have.status(200);
				})

				it('should return an empty text', () => {
					// then
					expect(response.text).to.equal('');
				})

			})

			context('when there is data', () => {

				beforeEach(async () => {
					// given
					data = 'Je suis une très longue ligne de caractères, qui dépasse la limite autorisée fixé à quatre-vingt caractères';

					// when
					response = await request(app)
						.post('/api/justify')
						.set('content-type', 'text/plain')
						.set('x-api-token', session.token)
						.send(data);
				})

				it('should return a 200 status', () => {
					// then
					expect(response).to.have.status(200);
				})

				it('should return an empty text', () => {
					// then
					let justifiedText = [
						'Je  suis  une  très  longue ligne de caractères, qui dépasse la limite autorisée',
						'fixé  à  quatre-vingt  caractères                                               '
					].join('\r\n');

					expect(response.text).to.equal(justifiedText);
				})

			})

		})

	})

})

