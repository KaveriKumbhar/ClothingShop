import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

// Pre-save middleware to generate slug from title
BlogSchema.pre('validate', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
export default Blog; 