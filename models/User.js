const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      }
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema.virtual('friendCount').get(function () {
  return this.friends.length
})

const Course = model('course', courseSchema);

module.exports = Course;