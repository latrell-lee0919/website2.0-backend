'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs')

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createUser = (event, context, callback) => {
  const data = JSON.parse(event.body);
  if (!data.username || !data.password ) {
    console.error('Missing credentials');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the card.',
    });
    return;
  }

  const salt = bcrypt.genSaltSync(10)
  const passwordHash = bcrypt.hashSync(data.password, salt)

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      name: data.name,
      username: data.username,
      password: passwordHash
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the card item.',
      });
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};