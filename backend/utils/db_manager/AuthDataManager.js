const AuthData = require('../../models/auth_data');
const { getError } = require('../ErrorHandler');


/**
 * The function saves the access, refresh tokens along with the expiry time
 * in the database.
 * @param {int} tenant id
 * @param {int} user id
 * @returns {object} containing result/error status code and data sub-object
 */

const getAuthData = async function (tenant_id, user_id) {
	try {
		const authData = await AuthData.query()
			.where('tenant_id', tenant_id)
			.andWhere('user_id', user_id)
			.first()
			.throwIfNotFound({
				status: 404,
				message: 'User not Found',
			});
		return {
			result: {
				status: 200,
				data: {
					id: authData.id,
					user_id: authData.user_id,
					tenant_id: authData.tenant_id,
					auto_sync: authData.auto_sync,
				},
			},
		};
	} catch (error) {
		return { error: getError(error) };
	}
};

/**
 * The function saves the access, refresh tokens along with the expiry time
 * in the database.
 * @param {int} tenant id
 * @param {int} user id
 * @param {text} access token
 * @param {text} refresh token
 * @param {bigint} expiry time in UNIX timer
 * @returns {object} containing result/error status code and data sub-object
 */
const save_azure_data = async function (tenant_id, user_id,name, email, access_token, refresh_token, expiry_time) {
	try {

		// let tenant_id = data.tenant_id ;
		// let user_id = data.user_id;
		// let access_token = data.access_token;
		// let refresh_token = data.refresh_token;
		// let expiry_time =data.expiry_time;
		// console.log('Tenant', tenant_id)


		const deta = await AuthData.query().insert({
			tenant_id: tenant_id,
			user_id: user_id,
			name: name,
			email: email,
			access_token: access_token,
			refresh_token: refresh_token,
			expiry_time: expiry_time,
		});
		console.log('Result', deta);
		return {
			result: {
				status: 201,
				message: 'Data Saved',
				data: { id: deta.id, user_id: deta.user_id, tenant_id: deta.tenant_id },
			},
		};
	} catch (error) {
		console.log('error', error.message);
		return { error: { status: 400, message: error.message, data: null } };
	}
};

const getUserCredentials = async function (email) {
	try {
		const data = await AuthData.query()
			.where('email', email)
			.first()
			.throwIfNotFound({ message: 'User not Found' });
		return {
			result: {
				status: 200,
				data: data,
			},
		};
	} catch (error) {
		return { 
			result: {
				status: 404,
			},
		 };
	}
};



module.exports = {
	save_azure_data,
	getUserCredentials,
	getAuthData
};
