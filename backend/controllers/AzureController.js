const {save_azure_data} = require('../utils/db_manager/AuthDataManager');
const {getAzureScopes, getAzureClient} = require('../utils/Utilities');

const getRedirectUrl = async (data) => {
	try {
        console.log('In Azure Controller', data);
        const { result, error } = await save_azure_data(data);

        if (error) {
			res.redirect(process.env.AZURE_IDENTITY_ERROR_URL);
		} else if (result) {
			res.redirect(process.env.AZURE_IDENTITY_SUCCESS_URL);
		} else {
			res.redirect(process.env.AZURE_IDENTITY_ERROR_URL);
		}
		
		// return {
		// 	result: {
		// 		status: 200,
		// 		data: { result },
		// 	},
		// };
	} catch (error) {
		return { error: getError(error) };
	}
};


const getRedirect = async (data) => {
	try {
		console.log('In Controller', data)
		const authCodeUrlParameters = {
			scopes: await getAzureScopes(),
			redirectUri: process.env.AZURE_REDIRECT_URL,

			state: JSON.stringify({
				tenant_id: data.tenant_id,
				user_id: data.user_id,
				origin: 'https://c119-39-52-80-24.ngrok.io',
			}),
		};
		console.log('In Params', authCodeUrlParameters)
		const cca = await getAzureClient();
		console.log('Azure Client ka Data', cca);
		// get url to sign user in and consent to scopes needed for application
		const result = await cca.getAuthCodeUrl(authCodeUrlParameters);
		return {
			result: {
				status: 200,
				data: { result },
			},
		};
	} catch (error) {
		return { error: getError(error) };
	}
};

module.exports = {
	getRedirectUrl,
	getRedirect
};
