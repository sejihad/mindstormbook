import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBook } from "../../actions/bookAction";
import { getPackages } from "../../actions/packageAction";
import BookSection from "../../component/BookSection";
import Categories from "../../component/Categories";
import Hero from "../../component/Hero";
import PackageSection from "../../component/PackageSection";
import NotificationBanner from "../../component/layout/NotificationBanner";

const Home = () => {
  const { loading, books } = useSelector((state) => state.books);
  const dispatch = useDispatch();
  const { loadingPackage = loading, packages } = useSelector(
    (state) => state.packages
  );

  useEffect(() => {
    dispatch(getBook());
    dispatch(getPackages());
  }, [dispatch]);

  // ✅ সর্বোচ্চ ১০টা বই স্লাইস করে পাঠাচ্ছি
  const finalBooks = books.slice(0, 10);
  const finalPackages = packages.slice(0, 10);

  return (
    <>
      <NotificationBanner />
      <Hero />
      <Categories />
      {/* <Authors /> */}
      <BookSection title="New" books={finalBooks} loading={loading} />
      <PackageSection
        title="Packages"
        packages={finalPackages}
        loading={loadingPackage}
      />
    </>
  );
};

export default Home;
