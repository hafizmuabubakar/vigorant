const { Model } = require('objection');

class AuthData extends Model {
	static get tableName() {
		return 'AuthData';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['tenant_id', 'user_id', 'access_token', 'refresh_token'],

			properties: {
				tenant_id: { type: 'integer' },
				user_id: { type: 'integer' },
				name: { type: 'string' },
				email: { type: 'string' },
				access_token: { type: 'string' },
				refresh_token: { type: 'string' },
				expiry_time: { type: 'integer' },
			},
		};
	}
}

module.exports = AuthData;
