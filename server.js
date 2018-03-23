const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema.js');

const app = express();

//遇到用户栏里有graphql那么就运行graphiql
// 运行middleware
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

app.listen(4000, () => {
    console.log('Listening');
});
