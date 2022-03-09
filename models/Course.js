import { Schema as _Schema, model } from "mongoose";
import slugify from 'slugify';
const Schema = _Schema;

const CourseSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    unique: true
  },
  category:{
    type: _Schema.Types.ObjectId,
    ref: 'Category'
  },
  user: {
    type: _Schema.Types.ObjectId,
    ref: 'User'
  }
});

CourseSchema.pre('validate', function(next){
  this.slug = slugify(this.name, {
    lower: true,
    strict: true
  })
  next();
})

const Course = model('Course', CourseSchema);
export default Course;