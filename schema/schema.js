//lodash帮助我们进行数据遍历和迭代
//const _ = require('lodash');
const axios = require('axios');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  //graphqlschema接受rootquery返回schema实例
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const users = [{
  id:'23', firstName: 'bill', age:20
},{
  id:'47', firstName: 'Zhen', age: 24
}];
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id:{type: GraphQLString},
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    users: {
      //一个公司名上可能有多个用户对象，所以要返回的是一个用户列表
      type: new GraphQLList(UserType),
      resolve(parentValue, args){
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`).then(res => res.data);
      }
    }
  })
});

//这个对象规定了它的存储属性
const UserType = new GraphQLObjectType({
  //name 整个定义了属性的名字
  name: 'User',
  //fields定义了所有的属性
  fields: () => ({
    //type 定义了属性类型
    id: {type: GraphQLString},
    firstName: {type: GraphQLString},
    age:  {type: GraphQLInt},
    company: {type: CompanyType,
              //通过resolve函数返回了companyId对象！
              resolve(parentValue, args){
          console.log(parentValue,args)
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(resp => resp.data);
              }
    }
  }
)});

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
    },
    company: {
      type: CompanyType,
      args: {id: {type: GraphQLString}},
      resolve(parentValue, args){
        //在URL里面的companies是数据库里面的真实数据
        return axios.get(`http://localhost:3000/companies/${args.id}`).then(res => res.data);
      }
    }
  }
});

//通过GraphQL修改数据
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields:{
    addUser:{
      type: UserType,
      args: {
        //告诉我们输入用户的时候名字和年龄是必须要输入的！
        firstName: {type: new GraphQLNonNull (GraphQLString)},
        age: {type : new GraphQLNonNull (GraphQLInt)},
        companyId: {type: GraphQLString}
      },
      resolve(parentValue, {firstName, age}){
        return axios.post(`http://localhost:3000/users`, {
          firstName,
          age
        }).then(res => res.data);
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation
});
