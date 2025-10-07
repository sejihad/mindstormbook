const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter Blog Title"],
    trim: true,
  },
  desc: {
    type: String,
    required: [true, "Please Enter Blog Description"],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});
module.exports = mongoose.model("Blog", blogSchema);
