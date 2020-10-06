const path = require('path');
const dotenv = require('dotenv');

//* Only used in development. The applicaiton is disployed under
//* Scalingo who manage envrionnement variables through an web interface.
//* The required variables will be directly manager by this interface.
if ( process.env.NODE_ENV !== 'production' ) {
	dotenv.config({ path: path.join(__dirname, '.env') });
}