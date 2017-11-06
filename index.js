const {URL} = require('url');
const axios = require('axios');

const createLogger = async () => {

    const url = new URL(
        `https://${process.env.apiManagementServiceName}.management.azure-api.net/` +
        `loggers/${process.env.loggerName}` +
        `?api-version=2014-02-14-preview`);
    
    const headers = {};
    headers['Authorization'] = `${process.env.sasToken}`;
    headers['Content-Type'] = 'application/json';

    const reqBody = {
        "type": "azureEventHub",
        "description": `${process.env.loggerDescription}`, 
        "credentials": {
              "name": `${process.env.eventHubNamespaceName}`,
              "connectionString": `${process.env.eventHubConnectionString}`
        }
    };

    let options = {
        method: 'PUT',
        url: url.href,
        headers,
        data: reqBody
    };

    const result = await axios(options)
    .then((response) => {
        console.log('creating logger successful')
    })
    .catch((error) => {
        if (error.response) {
            console.log('Error: ', error.response.statusText);
        } else if (error.request) {
            console.log('Error: ', error.request);
        } else {
            console.log('Error: ', error.message);
        }
    });
};

const checkForLogger = async () => {
    console.log('checking if logger exists');

    const url = new URL(
        `https://${process.env.apiManagementServiceName}.management.azure-api.net/` +
        `loggers/${process.env.loggerName}` +
        `?api-version=2017-03-01`); 

    const headers = {};
    headers['Authorization'] = `${process.env.sasToken}`;

    let options = {
        method: 'GET',
        url: url.href,
        headers
    };

    const result = await axios(options)
    .then((response) => {
        console.log('logger found');
    })
    .catch((error) => {
        if (error.response.status === 404) {
            console.log('logger not found, creating logger');
            createLogger();
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error: ', error.message);
        }
    });
};

checkForLogger();