const mongoose = require("mongoose");
const slugify = require("slugify");

// Book Subdocument Schema
const BookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter book name"],
    trim: true,
  },

  writer: {
    type: String,
    required: [true, "Please enter writer name"],
  },

  language: {
    type: String,
    default: "Bangla",
  },
  publisher: {
    type: String,
    default: null,
  },
  publishDate: {
    type: Date,
    default: null,
  },

  isbn13: {
    type: String,
  },
  demoPdf: {
    public_id: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
  },
  category: {
    type: String,
    required: [true, "Please enter book category"],
  },
});

const PackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter package name"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Please enter book title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter package description"],
  },
  oldPrice: {
    type: Number,
    required: [true, "Please enter original price"],
    max: [99999999, "Price cannot exceed 8 digits"],
  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter discount price"],
    max: [99999999, "Price cannot exceed 8 digits"],
  },
  deliveryTime: {
    type: String,
  },
  deliverToCountries: {
    type: String,
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
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  videoLink: {
    type: String,
    default: null,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
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

  // Three Books Embedded
  books: [BookSchema],
});

PackageSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Package", PackageSchema);
