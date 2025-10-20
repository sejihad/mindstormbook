const Book = require("../models/bookModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { Readable } = require("stream");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const createBook = catchAsyncErrors(async (req, res, next) => {
  // Validate required fields
  const requiredFields = [
    "name",

    "description",
    "writer",
    "oldPrice",
    "discountPrice",
    "category",
  ];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({
        success: false,
        message: `${field} is required`,
      });
    }
  }

  // Validate image
  if (!req.files?.image) {
    return res.status(400).json({
      success: false,
      message: "Book image is required",
    });
  }

  // Upload main image
  let image;
  try {
    const file = req.files.image;
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.data.toString("base64")}`,
      {
        folder: "/book/books",
        resource_type: "image",
      }
    );
    image = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error("Image upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload book image",
    });
  }

  // Upload additional images (max 4)
  const images = [];
  if (req.files.images) {
    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const file of files.slice(0, 4)) {
      try {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.data.toString("base64")}`,
          {
            folder: "/book/additional_images",
            resource_type: "image",
          }
        );
        images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      } catch (error) {
        console.error("Additional image upload error:", error);
      }
    }
  }

  // Improved PDF upload function
  const uploadPdfFile = async (file, folder) => {
    try {
      // Method 1: Using upload with base64 (more reliable for PDFs)
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.data.toString("base64")}`,
        {
          folder: folder,
          resource_type: "raw", // Use 'raw' for PDF files
          format: "pdf", // Explicitly specify format
        }
      );

      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error(`PDF upload error for ${folder}:`, error);
      throw error;
    }
  };

  // Upload demo PDF
  let demoPdf = null;
  if (req.files?.demoPdf) {
    try {
      demoPdf = await uploadPdfFile(req.files.demoPdf, "/book/demo_pdfs");
    } catch (error) {
      console.error("Demo PDF upload failed:", error);
      // Don't return error, just continue without demo PDF
    }
  }

  // Upload full PDF (only for ebooks)
  let fullPdf = null;
  if (req.body.type === "ebook") {
    if (!req.files?.fullPdf) {
      return res.status(400).json({
        success: false,
        message: "Full PDF is required for ebooks",
      });
    }

    try {
      fullPdf = await uploadPdfFile(req.files.fullPdf, "/book/full_pdfs");
    } catch (error) {
      console.error("Full PDF upload error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload full PDF (required for ebooks)",
      });
    }
  }

  // Improved Audio upload function
  const uploadAudioFile = async (file, folder) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "video", // Use 'video' for audio files in Cloudinary
          format: "mp3", // Specify audio format
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              public_id: result.public_id,
              url: result.secure_url,
            });
          }
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      const bufferStream = new Readable();
      bufferStream.push(file.data);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  };

  // Upload demo Audio
  let demoAudio = null;
  if (req.files?.demoAudio) {
    try {
      demoAudio = await uploadAudioFile(
        req.files.demoAudio,
        "/book/demo_audios"
      );
    } catch (error) {
      console.error("Demo Audio upload error:", error);
    }
  }

  // Upload full Audio (only for audiobook)
  let fullAudio = null;
  if (req.body.type === "audiobook") {
    if (!req.files?.fullAudio) {
      return res.status(400).json({
        success: false,
        message: "Full audio is required for audiobooks",
      });
    }

    try {
      fullAudio = await uploadAudioFile(
        req.files.fullAudio,
        "/book/full_audios"
      );
    } catch (error) {
      console.error("Full Audio upload error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload full audio (required for audiobooks)",
      });
    }
  }

  // Create book
  const bookData = {
    ...req.body,
    image,
    images,
    demoPdf,
    fullPdf,
    demoAudio,
    fullAudio,
    user: req.user.id,
    slug: slugify(req.body.name, { lower: true, strict: true }),
  };

  const book = await Book.create(bookData);

  res.status(201).json({
    success: true,
    book,
  });
});
const updateBook = catchAsyncErrors(async (req, res, next) => {
  const bookId = req.params.id;
  const book = await Book.findById(bookId);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  // ---------- IMAGE UPDATE ----------
  if (req.files?.image) {
    try {
      if (book.image?.public_id) {
        await cloudinary.uploader.destroy(book.image.public_id);
      }

      const file = req.files.image;
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.data.toString("base64")}`,
        {
          folder: "/book/books",
          resource_type: "image",
        }
      );

      req.body.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error("Image update error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update book image",
      });
    }
  }

  // ---------- ADDITIONAL IMAGES ----------
  if (req.files?.images) {
    try {
      // Delete old additional images
      if (book.images?.length > 0) {
        for (const img of book.images) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      const images = [];
      for (const file of files.slice(0, 4)) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.data.toString("base64")}`,
          {
            folder: "/book/additional_images",
            resource_type: "image",
          }
        );
        images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      req.body.images = images;
    } catch (error) {
      console.error("Additional images update error:", error);
    }
  }

  // Improved PDF upload function
  const uploadPdfFile = async (file, folder) => {
    try {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.data.toString("base64")}`,
        {
          folder: folder,
          resource_type: "raw",
          format: "pdf",
        }
      );

      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error(`PDF upload error for ${folder}:`, error);
      throw error;
    }
  };

  // ---------- DEMO PDF ----------
  if (req.files?.demoPdf) {
    try {
      // Delete old demo PDF if exists
      if (book.demoPdf?.public_id) {
        await cloudinary.uploader.destroy(book.demoPdf.public_id, {
          resource_type: "raw",
        });
      }

      // Upload new demo PDF
      req.body.demoPdf = await uploadPdfFile(
        req.files.demoPdf,
        "/book/demo_pdfs"
      );
    } catch (error) {
      console.error("Demo PDF update error:", error);
      // Don't return error, just continue
    }
  }

  // ---------- FULL PDF (for EBOOKS) ----------
  const currentType = req.body.type || book.type;

  if (currentType === "ebook" && req.files?.fullPdf) {
    try {
      // Delete old full PDF if exists
      if (book.fullPdf?.public_id) {
        await cloudinary.uploader.destroy(book.fullPdf.public_id, {
          resource_type: "raw",
        });
      }

      // Upload new full PDF
      req.body.fullPdf = await uploadPdfFile(
        req.files.fullPdf,
        "/book/full_pdfs"
      );
    } catch (error) {
      console.error("Full PDF update error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update full PDF",
      });
    }
  }

  // If changing from ebook to other type, remove full PDF
  if (
    book.type === "ebook" &&
    currentType !== "ebook" &&
    book.fullPdf?.public_id
  ) {
    try {
      await cloudinary.uploader.destroy(book.fullPdf.public_id, {
        resource_type: "raw",
      });
      req.body.fullPdf = null;
    } catch (error) {
      console.error("Error removing full PDF:", error);
    }
  }

  // Improved Audio upload function
  const uploadAudioFile = async (file, folder) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "video",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              public_id: result.public_id,
              url: result.secure_url,
            });
          }
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      const bufferStream = require("stream").Readable();
      bufferStream.push(file.data);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  };

  // ---------- DEMO AUDIO ----------
  if (req.files?.demoAudio) {
    try {
      // Delete old demoAudio if exists
      if (book.demoAudio?.public_id) {
        await cloudinary.uploader.destroy(book.demoAudio.public_id, {
          resource_type: "video",
        });
      }

      // Upload new demoAudio
      req.body.demoAudio = await uploadAudioFile(
        req.files.demoAudio,
        "/book/demo_audios"
      );
    } catch (error) {
      console.error("Demo Audio update error:", error);
      // Don't return error, just continue
    }
  }

  // ---------- FULL AUDIO (for AUDIOBOOKS) ----------
  if (currentType === "audiobook" && req.files?.fullAudio) {
    try {
      // Delete old fullAudio if exists
      if (book.fullAudio?.public_id) {
        await cloudinary.uploader.destroy(book.fullAudio.public_id, {
          resource_type: "video",
        });
      }

      // Upload new fullAudio
      req.body.fullAudio = await uploadAudioFile(
        req.files.fullAudio,
        "/book/full_audios"
      );
    } catch (error) {
      console.error("Full Audio update error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update full audio",
      });
    }
  }

  // If changing from audiobook to other type, remove full audio
  if (
    book.type === "audiobook" &&
    currentType !== "audiobook" &&
    book.fullAudio?.public_id
  ) {
    try {
      await cloudinary.uploader.destroy(book.fullAudio.public_id, {
        resource_type: "video",
      });
      req.body.fullAudio = null;
    } catch (error) {
      console.error("Error removing full audio:", error);
    }
  }

  // Clean up file fields from req.body if no new file uploaded
  if (!req.files?.demoPdf) delete req.body.demoPdf;
  if (!req.files?.fullPdf) delete req.body.fullPdf;
  if (!req.files?.demoAudio) delete req.body.demoAudio;
  if (!req.files?.fullAudio) delete req.body.fullAudio;

  // ---------- SLUG ----------
  if (req.body.name && req.body.name !== book.name) {
    req.body.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  // ---------- UPDATE ----------
  const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    book: updatedBook,
  });
});

// get all prodcuts
const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    books,
  });
});
// Get All Product (Admin)
const getAdminBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    books,
  });
});

// delete product
const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  try {
    // Delete main image from Cloudinary
    if (book.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(book.image.public_id);
      } catch (error) {
        console.error("Error deleting main image:", error);
      }
    }

    // Delete additional images from Cloudinary
    if (book.images?.length > 0) {
      for (const img of book.images) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
        } catch (error) {
          console.error("Error deleting additional image:", error);
        }
      }
    }

    // Delete demoPdf from Cloudinary
    if (book.demoPdf?.public_id) {
      try {
        await cloudinary.uploader.destroy(book.demoPdf.public_id, {
          resource_type: "raw",
        });
      } catch (error) {
        console.error("Error deleting demo PDF:", error);
      }
    }

    // Delete fullPdf from Cloudinary
    if (book.fullPdf?.public_id) {
      try {
        await cloudinary.uploader.destroy(book.fullPdf.public_id, {
          resource_type: "raw",
        });
      } catch (error) {
        console.error("Error deleting full PDF:", error);
      }
    }

    // Delete demoAudio from Cloudinary
    if (book.demoAudio?.public_id) {
      try {
        await cloudinary.uploader.destroy(book.demoAudio.public_id, {
          resource_type: "video",
        });
      } catch (error) {
        console.error("Error deleting demo audio:", error);
      }
    }

    // Delete fullAudio from Cloudinary
    if (book.fullAudio?.public_id) {
      try {
        await cloudinary.uploader.destroy(book.fullAudio.public_id, {
          resource_type: "video",
        });
      } catch (error) {
        console.error("Error deleting full audio:", error);
      }
    }

    // Delete book from database
    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting book from database",
    });
  }
});
// get single product
const getBookDetails = catchAsyncErrors(async (req, res, next) => {
  let book = await Book.findOne({ slug: req.params.slug });

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  res.status(200).json({ success: true, book });
});
const getAdminBookDetails = catchAsyncErrors(async (req, res, next) => {
  let book = await Book.findById(req.params.id);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  res.status(200).json({ success: true, book });
});
const getBookCart = catchAsyncErrors(async (req, res, next) => {
  let book = await Book.findById(req.params.id);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  res.status(200).json({ success: true, book });
});

// Create New Review or Update the review
const createBookReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, bookId } = req.body;

  let reviewImage;
  if (req.files && req.files.image) {
    try {
      const file = req.files.image;
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.data.toString("base64")}`,
        { folder: "/book/reviews", resource_type: "image" }
      );
      reviewImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error("Image upload error:", error);
      return next(new ErrorHandler("Failed to upload review image", 500));
    }
  }

  const book = await Book.findById(bookId);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  const review = {
    user: req.user._id,
    name: req.user.role === "admin" ? "Admin" : req.user.name,
    rating: Number(rating),
    comment,
    reviewImage,
    createdAt: Date.now(),
  };

  book.reviews.push(review);
  book.numOfReviews = book.reviews.length;

  const totalRating = book.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  book.ratings = totalRating / book.reviews.length;

  await book.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    review,
  });
});

const updateBookReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment } = req.body;
  const { reviewId } = req.params;

  const book = await Book.findOne({ "reviews._id": reviewId });
  if (!book) return next(new ErrorHandler("Book or review not found", 404));

  const review = book.reviews.id(reviewId);
  if (!review) return next(new ErrorHandler("Review not found", 404));

  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new ErrorHandler("You can only update your own reviews", 403));
  }

  // Upload new image
  if (req.files && req.files.image) {
    try {
      if (review.reviewImage?.public_id) {
        await cloudinary.uploader.destroy(review.reviewImage.public_id);
      }
      const file = req.files.image;
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.data.toString("base64")}`,
        { folder: "/book/reviews", resource_type: "image" }
      );
      review.reviewImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error("Image update error:", error);
      return next(new ErrorHandler("Failed to update review image", 500));
    }
  }

  review.rating = Number(rating);
  review.comment = comment;
  if (req.user.role === "admin") review.name = "Admin";
  review.updatedAt = Date.now();

  const totalRating = book.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  book.ratings = totalRating / book.reviews.length;

  await book.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    review,
  });
});

const getReviews = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: book.reviews,
  });
});

const deleteBookReview = catchAsyncErrors(async (req, res, next) => {
  const { bookId, reviewId } = req.params;

  const book = await Book.findById(bookId);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  const review = book.reviews.id(reviewId);
  if (!review) return next(new ErrorHandler("Review not found", 404));

  // Check if user owns the review or is admin
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new ErrorHandler("You can only delete your own reviews", 403));
  }

  // Delete image from Cloudinary if it exists
  try {
    if (review.reviewImage?.public_id) {
      await cloudinary.uploader.destroy(review.reviewImage.public_id);
    }
  } catch (err) {
    console.error("Error deleting review image:", err);
  }

  // Remove review
  book.reviews.pull(reviewId);
  book.numOfReviews = book.reviews.length;

  // Recalculate average rating
  const totalRating = book.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  book.ratings = book.reviews.length ? totalRating / book.reviews.length : 0;

  await book.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

module.exports = {
  createBook,
  getAllBooks,
  updateBook,
  deleteBook,
  getBookDetails,
  createBookReview,
  deleteBookReview,
  getAdminBooks,
  getBookCart,
  getReviews,
  updateBookReview,
  getAdminBookDetails,
};
