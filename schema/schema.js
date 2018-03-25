
//lodash帮助我们进行数据遍历和迭代
//const _ = require('lodash');
const axios = require('axios');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  //graphqlschema接受rootquery返回schema实例
  GraphQLSchema
} = graphql;

const users = [{
  id:'23', firstName: 'bill', age:20
},{
  id:'47', firstName: 'Zhen', age: 24
}];
const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id:{type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString}
    }
});

//这个对象规定了它的存储属性
const UserType = new GraphQLObjectType({
    //name 整个定义了属性的名字
    name: 'User',
    //fields定义了所有的属性
    fields: {
      //type 定义了属性类型
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age:  {type: GraphQLInt},
        company: {type: CompanyType}
    }
});

//让用户进入应用程序的datagraph
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields:{
    user:{
      type: UserType,
      args: {id: {type: GraphQLString}},
      //最重要的函数
      resolve(parentValue, args){
          //异步,axios会默认把对象嵌在data对象下面，所以只返回resp.data
          return axios.get(`http://localhost:3000/users/${args.id}`).then(resp => resp.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
