const express = require('express');
const dbConfig = require('./database/DatabaseConfig');
const { getRedirectUrl, getRedirect } = require('./controllers/AzureController');
const {
	crossOriginResource,
} = require('./utils/Middleware');
const {getAzureScopes, getTokens} = require('./utils/Utilities');
const {save_azure_data, getUserCredentials} = require('./utils/db_manager/AuthDataManager');

// Initializing database
dbConfig.initializeDB();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(crossOriginResource);


app.get("/", (req, res) => {
    res.send("This is home page.");
 });

 app.post('/login', async (req, res) => {
  try {
    console.log('In Address API',req.body);
    const data = await getRedirect(req.body);
    console.log('Data after sab kuch', data);
 
    res.send(data.result);
  } catch (err) {
    res.status(500).send(err);
  }
  });

  app.post('/test', async (req, res) => {
    try {
    //   console.log('In Address API',req.body);
    const decision = await getUserCredentials(req.body.email);

    console.log('Decision is made', decision);

   
      res.status(200);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.post('/register', async (req, res) => {
    try {
      console.log('In Address API',req.body);
      const data = await getRedirect(req.body);
      console.log('Data after sab kuch', data);
   
      res.send(data.result);
    } catch (err) {
      res.status(500).send(err);
    }
  });


  app.get('/azure-hook/callback', async (req, res) => {
    try {
      // console.log('In Callback Route', req.query);


      const user_data = JSON.parse(req.query.state);
      // console.log('User ka Data', user_data);


      const tokenRequest = {
        code: req.query.code,
        scopes: await getAzureScopes(),
        redirectUri: process.env.AZURE_REDIRECT_URL,
      };

      // console.log('Tokens Data', tokenRequest);
  
      const tokenData = await getTokens(tokenRequest);
      // console.log('Tokens Data',tokenData );
      
      if(tokenData.name === undefined){
        tokenData.name = 'NotGiven'
      }
      console.log('Tokens Data',tokenData );

      const decision = await getUserCredentials(tokenData.email);

      console.log('Decision is made', decision);

  
      if(decision.result.status === 200 ){

       res.redirect(process.env.AZURE_IDENTITY_SUCCESS_URLS);
       
      } else {

              //save tokens in the database
            const { result, error } = await save_azure_data(
              user_data.tenant_id,
              user_data.user_id,
              tokenData.name,
              tokenData.email,
              tokenData.access_token,
              tokenData.refresh_token,
              tokenData.expiry_time,
            );
            console.log('After Result', result);
        
            if (error) {
              res.redirect(process.env.AZURE_IDENTITY_ERROR_URL);
            } else if (result) {
              res.redirect(process.env.AZURE_IDENTITY_SUCCESS_URL);
            } else {
              res.redirect(process.env.AZURE_IDENTITY_ERROR_URL);
            }

      }
     
    } catch (error) {
      console.log(error);
    }
  });


  // PORT
const PORT = 4002;

app.listen(PORT, () => {
   console.log(`Server is running on PORT: ${PORT}`);
});