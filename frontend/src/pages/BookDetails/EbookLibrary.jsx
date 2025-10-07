import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getBook } from "../../actions/bookAction";
import { myOrders } from "../../actions/orderAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";

const EbookLibrary = () => {
  const dispatch = useDispatch();
  const [showPdf, setShowPdf] = useState(false);
  const [currentEbook, setCurrentEbook] = useState(null);

  const { loading, orders } = useSelector((state) => state.myOrders);
  const { books } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(myOrders());
    dispatch(getBook());
  }, [dispatch]);

  const ebookOrders = orders
    ?.filter((order) => order.payment?.status === "paid") // paid orders
    .map((order) => {
      if (order.order_type === "ebook") {
        // Pure ebook order → 그대로 দেখাও
        return order;
      } else if (order.order_type === "mixed") {
        // Mixed order → শুধু ebook items রাখো
        const ebookItems = order.orderItems?.filter(
          (item) => item.type === "ebook"
        );

        if (ebookItems.length > 0) {
          return { ...order, orderItems: ebookItems };
        }
      }

      // baki sob ignore
      return null;
    })
    .filter(Boolean); // null remove

  console.log(ebookOrders);
  const openPdfViewer = (ebook) => {
    setCurrentEbook(ebook);
    setShowPdf(true);
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8 min-h-[100vh]">
      <MetaData title="My eBook Library" />

      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        My eBook Library
      </h1>

      {ebookOrders?.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cover
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    eBook Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ebookOrders.map((order) =>
                  order.orderItems?.map((ebook, index) => {
                    const matchedBook = books.find((b) => b._id === ebook.id);

                    return (
                      <tr
                        key={`${order._id}-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex-shrink-0 h-16 w-16">
                            <img
                              className="h-16 w-16 object-cover rounded"
                              src={ebook.image}
                              alt={ebook.name}
                            />
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {ebook.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Purchased on:{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {matchedBook?.fullPdf?.url && (
                            <button
                              onClick={() =>
                                openPdfViewer({
                                  ...ebook,
                                  fullPdf: matchedBook.fullPdf.url,
                                })
                              }
                              className="text-indigo-600 hover:text-indigo-900 inline-flex items-center px-3 py-1 border border-indigo-600 rounded-md hover:bg-indigo-50"
                            >
                              Read Book
                            </button>
                          )}

                          {matchedBook?.category && matchedBook?.slug && (
                            <Link
                              to={`/ebook/${matchedBook.category}/${matchedBook.slug}`}
                              className="text-green-600 hover:text-green-900 inline-flex items-center px-3 py-1 border border-green-600 rounded-md hover:bg-green-50"
                            >
                              Write Review
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No eBooks in your library yet
          </h3>
          <p className="text-gray-600 mb-6">
            Completed eBook orders will appear here
          </p>
          <Link
            to="/shop"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse eBooks
          </Link>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {showPdf && currentEbook && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full h-[90vh] max-w-6xl relative flex flex-col">
            <button
              onClick={() => setShowPdf(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-3xl font-bold z-50"
            >
              &times;
            </button>

            <div className="p-4 border-b">
              <h2 className="text-2xl font-semibold text-center text-gray-800">
                {currentEbook.name}
              </h2>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0">
                <iframe
                  src={`${currentEbook.fullPdf}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0`}
                  title={currentEbook.name}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>

                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  onContextMenu={(e) => e.preventDefault()}
                ></div>
              </div>
            </div>

            <div className="p-4 border-t flex justify-between items-center bg-gray-50">
              <button
                onClick={() => setShowPdf(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EbookLibrary;
