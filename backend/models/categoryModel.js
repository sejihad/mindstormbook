const mongoose = require("mongoose");
const slugify = require("slugify");
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Category Name"],
    trim: true,
  },

  image: {
    public_id: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: "/book-cat.png",
    },
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});
module.exports = mongoose.model("Category", categorySchema);
