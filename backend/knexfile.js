require("dotenv").config();
module.exports = {

	development: {
		client: 'pg',
		connection: {
            host : '127.0.0.1',
            port : 5432,
            user : 'postgres',
            password : 'postgres',
            database : 'azure_identity'
          },
			directory: './migrations',
		},
	};

