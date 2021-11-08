const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User } = require('../models');


const resolvers = {
    Query: {
      me: async (parent, args, context) => {
        if (context.user) {
          const userData = await User.findOne({ _id: context.user._id })
            .select('-__v -password')
            

          return userData;
        }

        throw new AuthenticationError('Not logged in');
      }
    },
    Mutation: {
      addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);
      
        return { token, user };
      },
      login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
      
        if (!user) {
          throw new AuthenticationError('Incorrect User Login');
        }
      
        const correctPw = await user.isCorrectPassword(password);
      
        if (!correctPw) {
          throw new AuthenticationError('Incorrect Password');
        }
      
        const token = signToken(user);
        return { token, user };
      },
      saveBook: async (parent, { bookBody }, context) => {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
              { _id: context.user._id },
              { $push: { savedBooks: bookBody } },
              { new: true, runValidators: true }
          );

          return updatedUser;
        }

        throw new AuthenticationError('Please Login to save!');
      },
      removeBook: async (parent, { bookId }, context) => {
        if (context.user) {      
          const updatedUser = await User.findByIdAndUpdate(
              { _id: context.user._id },
              { $pull: { savedBooks: {bookId} } },
              { new: true }
          );
      
          return updatedUser;
        }
    
        throw new AuthenticationError('Please Login!');
      }
    }
};

module.exports = resolvers;