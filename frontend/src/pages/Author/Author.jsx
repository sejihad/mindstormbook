import { Atom, BookOpen, Globe, Heart, Mail, Sparkles } from "lucide-react";
import authorImg from "../../assets/author.jpg";
import { Link } from "react-router-dom";
const AuthorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">
            About the Author
          </h1>
          <div className="w-24 h-1 bg-indigo-600 mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section with Image */}
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-8 md:mb-0 flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-r from-blue-500 to-indigo-700 shadow-2xl flex items-center justify-center">
                    <div className="w-44 h-44 rounded-full bg-gray-200 overflow-hidden border-4 border-white">
                      {/* Author Image - Replace with your actual image */}
                      <img
                        src={authorImg}
                        alt="Author portrait"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white rounded-full py-1 px-3 text-xs font-bold shadow-lg">
                    105 Countries
                  </div>
                </div>
              </div>

              <div className="md:w-2/3 md:pl-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  My Journey
                </h2>
                <p className="text-lg text-gray-700">
                  My journey has taken me through the fascinating worlds of
                  science, technology, and creativity.
                </p>
              </div>
            </div>
          </div>

          {/* Physics Section */}
          <div className="px-8 py-12 bg-blue-50 border-t border-b border-blue-100">
            <div className="flex items-start mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Atom className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Physics Beginning
                </h3>
                <p className="text-gray-700">
                  I started my career as a physicist, exploring the fundamental
                  workings of our universe, before transitioning into software
                  engineering where I discovered my passion for building
                  innovative solutions.
                </p>
              </div>
            </div>
          </div>

          {/* LeapFrog Section */}
          <div className="px-8 py-12 border-b border-indigo-100">
            <div className="flex items-start mb-6">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <Sparkles className="text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  LeapFrog Chapter
                </h3>
                <p className="text-gray-700">
                  My most rewarding professional chapter was at LeapFrog, where
                  I had the privilege of creating educational toys that spark
                  curiosity and learning in young children. There's something
                  magical about developing products that make learning feel like
                  play, and seeing how technology can nurture young minds.
                </p>
              </div>
            </div>
          </div>

          {/* Writing Section */}
          <div className="px-8 py-12 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <BookOpen className="mr-3" size={32} />
                <h3 className="text-2xl font-bold">Writing Children's Books</h3>
              </div>
              <p className="text-lg text-center">
                Now in retirement, I've channeled my lifelong love of learning
                and discovery into writing children's books. It's been wonderful
                to continue inspiring young people, this time through
                storytelling rather than interactive toys.
              </p>
            </div>
          </div>

          {/* Travel Section */}
          <div className="p-8 md:p-12">
            <div className="flex items-center mb-8 justify-center">
              <Globe className="text-indigo-600 mr-3" size={28} />
              <h3 className="text-2xl font-bold text-gray-900">
                Passionate Travelers
              </h3>
            </div>

            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center mb-4">
                    <Heart className="mr-2" size={20} />
                    <h4 className="text-xl font-bold">52 Years Together</h4>
                  </div>
                  <p className="mb-4">
                    When I'm not writing, you'll likely find me planning our
                    next adventure or sharing stories from the road. My wife of
                    52 years and I are passionate travelers who have been
                    fortunate to explore 105 countries so far – each destination
                    teaching us something new about the world and ourselves.
                  </p>
                  <p className="italic">
                    From bustling markets in Morocco to quiet temples in
                    Myanmar, every journey adds another layer to our
                    understanding of this incredible planet we call home.
                  </p>
                </div>
              </div>

              <div className="md:w-1/2 md:pl-8">
                <div className="bg-gray-100 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Life Philosophy
                  </h4>
                  <p className="text-gray-700">
                    Whether through physics equations, lines of code,
                    educational toys, children's stories, or passport stamps, my
                    life has been about exploration, learning, and hopefully
                    making the world a little brighter for the next generation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="px-8 py-12 text-center bg-gray-50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Explore My Children's Books
            </h3>
            <Link
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-full inline-flex items-center transition duration-200"
              to="/shop"
            >
              <BookOpen className="mr-2" size={20} />
              View My Books
            </Link>

            <div className="mt-6">
              <Link
                to="/contact"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <Mail className="mr-2" size={18} />
                Contact Me
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p>© {new Date().getFullYear()} All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default AuthorPage;
