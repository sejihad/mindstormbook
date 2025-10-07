import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import slugify from "slugify";
import { getBlog } from "../../actions/blogAction";
import Loader from "../../component/layout/Loader/Loader";
const Blogs = () => {
  const dispatch = useDispatch();
  const { loading, error, blogs } = useSelector((state) => state.blogs);
  useEffect(() => {
    dispatch(getBlog());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen container bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Blogs</h1>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    No blogs found
                  </h2>
                  <p className="text-gray-500">
                    Please check back later. We’ll publish exciting content
                    soon!
                  </p>
                </div>
              ) : (
                blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Blog Image */}
                    <div className="h-48 overflow-hidden">
                      <Link
                        to={`/blog/${slugify(blog.title, {
                          lower: true,
                          strict: true,
                        })}`}
                      >
                        <img
                          src={blog.image.url}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </Link>
                    </div>

                    {/* Blog Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">
                          {blog.date}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 mb-3">
                        {blog.title.length > 50
                          ? `${blog.title.slice(0, 50)}...`
                          : blog.title}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {blog.desc.length > 100
                          ? `${blog.desc.slice(0, 100)}...`
                          : blog.desc}
                      </p>

                      <Link
                        to={`/blog/${slugify(blog.title, {
                          lower: true,
                          strict: true,
                        })}`}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Read More
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Blogs;
