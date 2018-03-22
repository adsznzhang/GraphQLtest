const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = graphql;


//这个对象规定了它的存储属性
const UserType = new GraphQLObjectType({
    //name 整个定义了属性的名字
    name: 'User',
    //fields定义了所有的属性
    fields: {
      //type 定义了属性类型
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age:  {type: GraphQLInt}
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
        
      }
    }
  }
})
