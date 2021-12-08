'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#description': 'description',
    },
    ExpressionAttributeValues: {
      ':category': data.category,
      ':title': data.title,
      ':previewDescription': data.previewDescription,
      ':description': data.description,
      ':title': data.title,
      ':link': data.link,
      ':githubLink': data.githubLink,
      ':videoId': data.videoId,
      ':techStack': data.techStack,
      ':imageUrl': data.imageUrl
    },
    UpdateExpression: 'SET  #description = :description, imageUrl = :imageUrl, githubLink = :githubLink, category = :category, previewDescription = :previewDescription, title = :title, link = :link, videoId = :videoId, techStack = :techStack',
    ReturnValues: 'ALL_NEW',
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.log(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: `Couldn\'t fetch the todo item, ${error}`,
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};