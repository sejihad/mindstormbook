import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import book_pn from "../assets/books-pn-min.png";
import "./hero.css"; // animate-float CSS class

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-white to-indigo-50 py-16">
      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-10">
        {/* Left Content */}
        <div className="text-center md:text-left max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-800 mb-4">
            BOOKS WILL <br />
            <span className="text-indigo-600">EXPAND YOUR KNOWLEDGE</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Discover the power of books that grow your mind. Dive into endless
            possibilities and fuel your imagination.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-full shadow-lg transition-all duration-300"
          >
            <FiShoppingCart className="text-lg" />
            Buy Now
          </Link>
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:justify-end w-full">
          <img
            src={book_pn}
            alt="Books"
            className="w-48 sm:w-56 md:w-64 lg:w-72 animate-float"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
