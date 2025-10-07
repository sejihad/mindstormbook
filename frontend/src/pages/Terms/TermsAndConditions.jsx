import { FileText, Mail } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-900 text-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
            <FileText className="mr-3" size={48} />
            Terms & Conditions
          </h1>
          <p className="text-xl text-blue-300 max-w-3xl mx-auto">
            Effective Date: August 15, 2025
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden divide-y divide-gray-700">
          {/* Intro */}
          <div className="p-8">
            <p className="text-lg">
              Welcome to the{" "}
              <span className="font-bold text-indigo-400">MindStormBook</span>{" "}
              mobile application ("App"), ("we," "our," or "us"). These Terms &
              Conditions ("Terms") govern your use of our App, which is
              available via the Google Play Store and other platforms.
            </p>
          </div>

          {/* Section 1 */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-400">
              By accessing or using the App, you agree to be bound by these
              Terms. If you do not agree, please do not use the App.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-8 bg-gray-700/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              2. Use of the App
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>You must be at least 13 years old to use the App.</li>
              <li>
                You agree not to misuse the App or interfere with its proper
                working.
              </li>
              <li>
                All activities conducted through the App must comply with
                applicable laws.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              3. Intellectual Property
            </h2>
            <p className="text-gray-400">
              All content, logos, and software used in the App are owned by Time
              Innovation LLC or its licensors. You may not copy, distribute, or
              reverse engineer any part of the App without permission.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-8 bg-gray-700/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              4. User Content
            </h2>
            <p className="text-gray-400">
              You retain ownership of any content you submit, but you grant us a
              worldwide license to use, host, and distribute it as needed to
              operate the App.
            </p>
          </div>

          {/* Section 5 */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              5. Termination
            </h2>
            <p className="text-gray-400">
              We reserve the right to suspend or terminate your access at any
              time, without notice, if you violate these Terms.
            </p>
          </div>

          {/* Section 6 */}
          <div className="p-8 bg-gray-700/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              6. Disclaimer & Limitation of Liability
            </h2>
            <p className="text-gray-400 mb-2">
              The App is provided "as is" without warranties of any kind. We are
              not liable for any damages or losses resulting from your use of
              the App.
            </p>
            <p className="text-gray-500 text-sm">
              Use the App at your own risk.
            </p>
          </div>

          {/* Section 7 */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              7. Changes to Terms
            </h2>
            <p className="text-gray-400">
              We may update these Terms from time to time. Continued use of the
              App after updates means you accept the revised Terms.
            </p>
          </div>

          {/* Section 8 */}
          <div className="p-8 bg-gray-700/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              8. Governing Law
            </h2>
            <p className="text-gray-400">
              These Terms are governed by the laws of the State of California,
              USA.
            </p>
          </div>

          {/* Section 9 */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              9. Contact Us
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                {/*  <MapPin className="text-indigo-400 mr-3" size={20} />
                 <span className="text-gray-400">
                  Eagles Boost, 7537 Desoto Av, Canoga Park, California
                  91303, USA.
                </span> */}
              </div>
              <div className="flex items-center">
                <Mail className="text-indigo-400 mr-3" size={20} />
                <span className="text-gray-400">privacy@MindStormBook.com</span>
              </div>
              <div className="flex items-center">
                {/*<Phone className="text-indigo-400 mr-3" size={20} />
                 <span className="text-gray-400">+1 (818) 334-7704</span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
