const msal = require('@azure/msal-node');
const getAzureScopes = function () {
	const scopes = [
		'Group.Read.All',
		'User.Read.All',
		'GroupMember.Read.All',
		'Group.ReadWrite.All',
	];

	//const scopes = ['User.Read'];

	return scopes;
};

const getAzureClient = function () {
    console.log('In Utility')
	const config = {
		auth: {
			clientId: process.env.AZURE_CLIENT_ID,
			authority: process.env.AZURE_AUTHORITY,
			clientSecret: process.env.AZURE_CLIENT_SECRET,
		},
		system: {
			loggerOptions: {
				loggerCallback(loglevel, message, containsPii) {
					// console.log(loglevel);
				},
				piiLoggingEnabled: false,
				loglevel: msal.LogLevel.Verbose,
			},
		},
	};

    console.log('Config ka data', config);

	return new msal.ConfidentialClientApplication(config);
};

const getTokens = async (tokenRequest) => {
	try {
		const cca = await getAzureClient();
		const response = await cca.acquireTokenByCode(tokenRequest);

		const accessToken = response.accessToken;
        const name = response.account.name;
        const email = response.account.username;
		console.log('\nResponse: \n:', response);

		const tokenCache = await cca.getTokenCache().serialize();
		const refreshTokenObject = JSON.parse(tokenCache).RefreshToken;
		const refreshToken =
			refreshTokenObject[Object.keys(refreshTokenObject)[0]].secret;

		// token(refreshToken);

		return {
            name: name,
            email: email,
			access_token: accessToken,
			refresh_token: refreshToken,
			expiry_time: response.idTokenClaims.exp,
		};
	} catch (error) {
		console.log(error);
		return null;
	}
};



module.exports = {
    getAzureScopes,
    getAzureClient,
    getTokens
};