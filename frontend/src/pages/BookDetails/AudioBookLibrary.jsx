import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getBook } from "../../actions/bookAction";
import { myOrders } from "../../actions/orderAction";
import Loader from "../../component/layout/Loader/Loader";
import MetaData from "../../component/layout/MetaData";

const AudiobookLibrary = () => {
  const dispatch = useDispatch();
  const [showAudio, setShowAudio] = useState(false);
  const [currentAudiobook, setCurrentAudiobook] = useState(null);

  const { loading, orders } = useSelector((state) => state.myOrders);
  const { books } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(myOrders());
    dispatch(getBook());
  }, [dispatch]);

  const audiobookOrders = orders
    ?.filter((order) => order.payment?.status === "paid")
    .map((order) => {
      if (order.order_type === "audiobook") {
        return order;
      } else if (order.order_type === "mixed") {
        const audiobookItems = order.orderItems?.filter(
          (item) => item.type === "audiobook"
        );

        if (audiobookItems.length > 0) {
          return { ...order, orderItems: audiobookItems };
        }
      }
      return null;
    })
    .filter(Boolean);

  const openAudioPlayer = (audiobook) => {
    setCurrentAudiobook(audiobook);
    setShowAudio(true);
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8 min-h-[100vh]">
      <MetaData title="My Audiobook Library" />

      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        My Audiobook Library
      </h1>

      {audiobookOrders?.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cover
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Audiobook Name
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {audiobookOrders.map((order) =>
                  order.orderItems?.map((audiobook, index) => {
                    const matchedBook = books.find(
                      (b) => b._id === audiobook.id
                    );

                    return (
                      <tr
                        key={`${order._id}-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex-shrink-0 h-16 w-16">
                            <img
                              className="h-16 w-16 object-cover rounded"
                              src={audiobook.image}
                              alt={audiobook.name}
                            />
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {audiobook.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Purchased on:{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {matchedBook?.fullAudio?.url && (
                            <button
                              onClick={() =>
                                openAudioPlayer({
                                  ...audiobook,
                                  fullAudio: matchedBook.fullAudio.url,
                                })
                              }
                              className="text-green-600 hover:text-green-900 inline-flex items-center px-3 py-1 border border-green-600 rounded-md hover:bg-green-50"
                            >
                              Listen Now
                            </button>
                          )}

                          {matchedBook?.category && matchedBook?.slug && (
                            <Link
                              to={`/audiobook/${matchedBook.category}/${matchedBook.slug}`}
                              className="text-indigo-600 hover:text-indigo-900 inline-flex items-center px-3 py-1 border border-indigo-600 rounded-md hover:bg-indigo-50"
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
            No Audiobooks in your library yet
          </h3>
          <p className="text-gray-600 mb-6">
            Completed audiobook orders will appear here
          </p>
          <Link
            to="/shop"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Browse Audiobooks
          </Link>
        </div>
      )}

      {/* Audio Player Modal */}
      {showAudio && currentAudiobook && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative">
            <button
              onClick={() => setShowAudio(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-3xl font-bold z-50"
            >
              &times;
            </button>

            <div className="p-6 border-b">
              <h2 className="text-2xl font-semibold text-center text-gray-800">
                {currentAudiobook.name}
              </h2>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <img
                  src={currentAudiobook.image}
                  alt={currentAudiobook.name}
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              </div>

              <audio
                controls
                className="w-full"
                src={currentAudiobook.fullAudio}
              >
                Your browser does not support the audio element.
              </audio>
            </div>

            <div className="p-4 border-t flex justify-between items-center bg-gray-50">
              <span className="text-sm text-gray-600">
                Enjoy your audiobook!
              </span>
              <button
                onClick={() => setShowAudio(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudiobookLibrary;
