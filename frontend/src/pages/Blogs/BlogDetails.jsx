import { useEffect } from "react";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { clearErrors, getBlogDetails } from "../../actions/blogAction";
import Loader from "../../component/layout/Loader/Loader";
const BlogDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { loading, error, blog } = useSelector((state) => state.blogDetails);

  useEffect(() => {
    dispatch(getBlogDetails(slug));
  }, [dispatch, slug]);
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen container bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Link
                to="/blogs"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <FaArrowLeft className="mr-2" />
                Back to all articles
              </Link>
            </div>

            {/* Blog Header */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {blog.title}
              </h1>

              <div className="flex items-center text-gray-500 space-x-4">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="rounded-xl overflow-hidden mb-8 shadow-lg">
              <img
                src={blog?.image?.url}
                alt={blog.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Blog Content */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
              <div className="prose max-w-none text-gray-700" />
              <p className="whitespace-pre-wrap">{blog.desc}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogDetails;
