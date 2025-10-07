// components/admin/AllBlogs.jsx
import { useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearErrors,
  deleteBlog,
  getAdminBlog,
} from "../../actions/blogAction";
import Loader from "../../component/layout/Loader/Loader";
import Sidebar from "./Sidebar";

const AllBlogs = () => {
  const dispatch = useDispatch();

  const { blogs, error, loading } = useSelector((state) => state.blogs);
  const { error: deleteError, isDeleted } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(getAdminBlog());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Blog Deleted Successfully");
      dispatch(getAdminBlog()); // Refresh list
    }
  }, [dispatch, error, deleteError, isDeleted]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure to delete this blog?")) {
      dispatch(deleteBlog(id));
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full min-h-screen container bg-gray-50 flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">All Blogs</h1>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Image</th>
                    <th className="px-4 py-3 text-left font-medium">Title</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {blogs &&
                    blogs.map((blog) => (
                      <tr key={blog._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <img
                            src={blog.image?.url || "/default.jpg"}
                            alt="Blog"
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </td>
                        <td className="px-4 py-3">
                          {blog.title.length > 50
                            ? blog.title.slice(0, 50) + "..."
                            : blog.title}
                        </td>
                        <td className="px-4 py-3 space-x-2">
                          <Link
                            to={`/admin/blog/${blog._id}`}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                          >
                            <FiEdit className="mr-1" /> Edit
                          </Link>
                          <button
                            onClick={() => deleteHandler(blog._id)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium cursor-pointer text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 className="mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  {blogs?.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-6 text-gray-500"
                      >
                        No blogs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllBlogs;
