const mongoose = require("mongoose");
const slugify = require("slugify");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter book Name"],
    trim: true,
  },
  title: {
    type: String,

    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter book Description"],
  },
  writer: {
    type: String,
    required: [true, "Please Enter Writer Name"],
  },
  type: {
    type: String,
    enum: ["book", "ebook", "audiobook"],
    default: "book",
  },
  oldPrice: {
    type: Number,
    required: [true, "Please Enter Original Price"],
    max: [99999999, "Price cannot exceed 8 digits"],
  },
  discountPrice: {
    type: Number,
    required: [true, "Please Enter Discount Price"],
    max: [99999999, "Price cannot exceed 8 digits"],
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
  deliveryTime: {
    type: String,
  },
  deliverToCountries: {
    type: String,
  },

  isbn13: {
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
  fullPdf: {
    public_id: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
  },
  demoAudio: {
    public_id: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
  },
  fullAudio: {
    public_id: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
  },
  ratings: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, "Please Enter Book Category"],
  },
  videoLink: {
    type: String,
    default: null,
  },
  numOfReviews: {
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
      },
      comment: {
        type: String,
      },
      reviewImage: {
        public_id: {
          type: String,
          default: null,
        },
        url: {
          type: String,
          default: null,
        },
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
});

bookSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Book", bookSchema);
