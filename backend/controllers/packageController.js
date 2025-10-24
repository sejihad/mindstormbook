const Package = require("../models/packageModel");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const slugify = require("slugify");
const cloudinary = require("cloudinary");

// Create Package
const createPackage = catchAsyncErrors(async (req, res, next) => {
  const requiredFields = [
    "name",
    "description",
    "oldPrice",
    "discountPrice",
    "deliveryTime",
    "deliverToCountries",
    "books", // books field now required (array of Book IDs)
  ];

  // Check required fields
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return next(new ErrorHandler(`${field} is required`, 400));
    }
  }

  // Validate books array
  let books = req.body.books;
  if (!Array.isArray(books) || books.length === 0) {
    return next(new ErrorHandler("At least one book ID is required", 400));
  }

  // Optional: Ensure all items are valid ObjectIds
  books = books
    .map((id) => id.trim())
    .filter((id) => mongoose.Types.ObjectId.isValid(id));
  if (books.length === 0) {
    return next(new ErrorHandler("Invalid book IDs provided", 400));
  }

  // Validate main image
  if (!req.files?.image) {
    return next(new ErrorHandler("Package image is required", 400));
  }

  // Upload main image to Cloudinary
  let image;
  try {
    const file = req.files.image[0] || req.files.image;
    const result = await cloudinary.uploader.upload(
      file.tempFilePath ||
        `data:${file.mimetype};base64,${file.data.toString("base64")}`,
      { folder: "/package/packages", resource_type: "image" }
    );
    image = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error("Image upload error:", error);
    return next(new ErrorHandler("Failed to upload package image", 500));
  }

  // Upload additional images (optional)
  const images = [];
  if (req.files.images) {
    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];
    for (const file of files.slice(0, 4)) {
      try {
        const result = await cloudinary.uploader.upload(
          file.tempFilePath ||
            `data:${file.mimetype};base64,${file.data.toString("base64")}`,
          { folder: "/package/additional_images", resource_type: "image" }
        );
        images.push({ public_id: result.public_id, url: result.secure_url });
      } catch (error) {
        console.error("Additional image upload error:", error);
      }
    }
  }

  // Create package
  const packageData = {
    name: req.body.name,
    title: req.body.title,
    description: req.body.description,
    oldPrice: req.body.oldPrice,
    discountPrice: req.body.discountPrice,
    deliveryTime: req.body.deliveryTime,
    deliverToCountries: req.body.deliverToCountries,
    image,
    images,
    user: req.user._id,
    books, // Array of Book IDs
    ...(req.body.videoLink && { videoLink: req.body.videoLink }),
  };

  const packageDoc = await Package.create(packageData);

  res.status(201).json({
    success: true,
    package: packageDoc,
  });
});
// Update Package
const updatePackage = catchAsyncErrors(async (req, res, next) => {
  const packageId = req.params.id;
  const package = await Package.findById(packageId);

  if (!package) {
    return next(new ErrorHandler("Package not found", 404));
  }

  // Initialize update data
  const updateData = { ...req.body };

  // Handle image update
  if (req.files?.image) {
    try {
      // Delete old image if exists
      if (package.image?.public_id) {
        await cloudinary.uploader.destroy(package.image.public_id);
      }

      // Upload new image
      const file = req.files.image[0] || req.files.image;
      const result = await cloudinary.uploader.upload(
        file.tempFilePath ||
          `data:${file.mimetype};base64,${file.data.toString("base64")}`,
        {
          folder: "/package/packages",
          resource_type: "image",
        }
      );
      updateData.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error("Image update error:", error);
      return next(new ErrorHandler("Failed to update package image", 500));
    }
  }

  // Handle additional images update
  if (req.files?.images) {
    try {
      // Delete old additional images if they exist
      if (package.images?.length > 0) {
        for (const img of package.images) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      // Upload new additional images
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      const images = [];
      for (const file of files.slice(0, 4)) {
        const result = await cloudinary.uploader.upload(
          file.tempFilePath ||
            `data:${file.mimetype};base64,${file.data.toString("base64")}`,
          {
            folder: "/package/additional_images",
            resource_type: "image",
          }
        );
        images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      updateData.images = images;
    } catch (error) {
      console.error("Additional images update error:", error);
      return next(new ErrorHandler("Failed to update additional images", 500));
    }
  }

  // Handle books update - now expecting array of book IDs
  if (req.body.books) {
    let books = req.body.books;

    // Validate books array
    if (!Array.isArray(books) || books.length === 0) {
      return next(new ErrorHandler("At least one book ID is required", 400));
    }

    // Ensure all items are valid ObjectIds
    books = books
      .map((id) => id.trim())
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (books.length === 0) {
      return next(new ErrorHandler("Invalid book IDs provided", 400));
    }

    updateData.books = books;
  }

  // Handle slug update if name changed
  if (req.body.name && req.body.name !== package.name) {
    updateData.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  // Update package
  const updatedPackage = await Package.findByIdAndUpdate(
    packageId,
    updateData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Package updated successfully",
    package: updatedPackage,
  });
});

// Get All Packages
const getAllPackages = catchAsyncErrors(async (req, res, next) => {
  const packages = await Package.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    packages,
  });
});

// Get All Packages (Admin)
const getAdminPackages = catchAsyncErrors(async (req, res, next) => {
  const packages = await Package.find()
    .sort({ createdAt: -1 })
    .populate("books");

  res.status(200).json({
    success: true,
    packages,
  });
});

// Delete Package
const deletePackage = catchAsyncErrors(async (req, res, next) => {
  const packageDoc = await Package.findById(req.params.id);

  if (!packageDoc) {
    return res.status(404).json({
      success: false,
      message: "Package not found",
    });
  }

  try {
    // Delete main image from Cloudinary
    if (packageDoc.image?.public_id) {
      await cloudinary.uploader.destroy(packageDoc.image.public_id);
    }

    // Delete additional images from Cloudinary
    if (packageDoc.images?.length > 0) {
      for (const img of packageDoc.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // Delete package from database
    await Package.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({
      success: false,
      message:
        "Error deleting package. Some resources may not have been properly deleted.",
    });
  }
});

// Get Single Package Details
// Get Single Package Details
const getPackageDetails = catchAsyncErrors(async (req, res, next) => {
  const packageData = await Package.findOne({ slug: req.params.slug }).populate(
    "books"
  );

  if (!packageData) {
    return next(new ErrorHandler("Package not found", 404));
  }

  res.status(200).json({
    success: true,
    package: packageData,
  });
});
const getAdminPackageDetails = catchAsyncErrors(async (req, res, next) => {
  const packageData = await Package.findById(req.params.id).populate("books");

  if (!packageData) {
    return next(new ErrorHandler("Package not found", 404));
  }

  res.status(200).json({
    success: true,
    package: packageData,
  });
});

// Get Package for Cart
const getPackageCart = catchAsyncErrors(async (req, res, next) => {
  let package = await Package.findById(req.params.id);

  if (!package) {
    return next(new ErrorHandler("Package not found", 404));
  }

  res.status(200).json({ success: true, package });
});

// Create New Review or Update the review
const createPackageReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, packageId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const package = await Package.findById(packageId);

  const isReviewed = package.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    package.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    package.reviews.push(review);
    package.numOfReviews = package.reviews.length;
  }

  let avg = 0;

  package.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  package.ratings = avg / package.reviews.length;

  await package.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a Package
const getReviews = catchAsyncErrors(async (req, res, next) => {
  const package = await Package.findById(req.params.id);

  if (!package) {
    return next(new ErrorHandler("Package not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: package.reviews,
  });
});

// Delete Review
const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const package = await Package.findById(req.params.packageId);

  if (!package) {
    return next(new ErrorHandler("Package not found", 404));
  }

  const reviews = package.reviews.filter(
    (rev) => rev._id.toString() !== req.params.reviewId.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Package.findByIdAndUpdate(
    req.params.packageId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

module.exports = {
  createPackage,
  getAllPackages,
  updatePackage,
  deletePackage,
  getPackageDetails,
  createPackageReview,
  getReviews,
  deleteReview,
  getAdminPackages,
  getPackageCart,
  getAdminPackageDetails,
};
