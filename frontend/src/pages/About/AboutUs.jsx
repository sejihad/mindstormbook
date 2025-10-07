import { Globe, Lock, Mail, MapPin, Shield } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="bg-gray-900 text-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
            <Shield className="mr-3" size={48} />
            Privacy Policy
          </h1>
          <p className="text-xl text-blue-300 max-w-3xl mx-auto">
            Last Updated: August 15, 2025 | Effective Date: August 15, 2025
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {/* Introduction */}
          <div className="p-8 border-b border-gray-700">
            <p className="text-lg">
              At{" "}
              <span className="font-bold text-indigo-400">
                MindStormBook {""}
              </span>
              your privacy isn't just a legal obligation—it's a commitment. We
              value the trust you place in us and are dedicated to safeguarding
              your personal information. This Privacy Policy outlines how we
              collect, use, protect, and share your information when you access
              our website [website URL](the "Site") or use our services.
            </p>
            <p className="text-lg">
              By accessing or using our Site, you agree to the terms of this
              Privacy Policy. If you do not agree, we respectfully ask that you
              refrain from using our Site or services.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="divide-y divide-gray-700">
            {/* Section 1 */}
            <div className="p-8">
              <div className="flex items-start mb-4">
                <div className="bg-indigo-900/50 p-2 rounded-full mr-4">
                  <Lock className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    1. Information We Collect
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-300 mb-2">
                        a. Personal Information You Provide
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-400">
                        <li>
                          Identity & Contact Details – Full name, email address,
                          phone number, mailing address
                        </li>
                        <li>
                          Account Credentials – Username and password for secure
                          login
                        </li>
                        <li>
                          Payment Details – Processed securely through reputable
                          third-party payment processors
                        </li>
                        <li>
                          Communications – Messages, inquiries, or feedback you
                          send to us
                        </li>
                        <li>
                          Form Submissions – Any data provided through forms on
                          our Site
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-300 mb-2">
                        b. Automatically Collected Information
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-400">
                        <li>
                          Pages viewed, navigation patterns, and time spent on
                          the Site
                        </li>
                        <li>Date, time, and frequency of visits</li>
                        <li>Data from cookies and similar technologies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="p-8">
              <div className="flex items-start">
                <div className="bg-indigo-900/50 p-2 rounded-full mr-4">
                  <Shield className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    2. Cookies & Tracking Technologies
                  </h2>
                  <p className="text-gray-400 mb-3">
                    We use cookies and similar tools to enhance your browsing
                    experience, personalize content, and analyze traffic. You
                    can manage or disable cookies in your browser settings;
                    however, doing so may affect certain Site functionalities.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="p-8 bg-gray-700/20">
              <div className="flex items-start">
                <div className="bg-indigo-900/50 p-2 rounded-full mr-4">
                  <Globe className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    3. How We Use Your Information
                  </h2>
                  <p className="mb-3 text-gray-400">
                    We process the information we collect for purposes such as:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>Delivering, maintaining, and improving our services</li>
                    <li>
                      Processing transactions and providing related updates
                    </li>
                    <li>
                      Communicating with you, including customer service support
                    </li>
                    <li>
                      Sending marketing messages (with your consent where
                      required)
                    </li>
                    <li>Personalizing your Site experience</li>
                    <li>Analyzing trends and usage patterns</li>
                    <li>
                      Detecting, preventing, and responding to security threats
                    </li>
                    <li>Complying with legal and regulatory obligations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="p-8">
              <div className="flex items-start">
                <div className="bg-indigo-900/50 p-2 rounded-full mr-4">
                  <Globe className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    4. Information Sharing & Disclosure
                  </h2>
                  <p className="mb-3 text-gray-400">
                    We do not sell your personal information. We only share it
                    under the following circumstances:
                  </p>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-300 mb-2">
                        a. Service Providers
                      </h3>
                      <p className="text-gray-400">
                        With trusted third-party partners who help us operate
                        our Site, process transactions, and deliver
                        services—under strict confidentiality agreements.
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-300 mb-2">
                        b. Legal & Compliance
                      </h3>
                      <p className="text-gray-400">
                        When required by law, regulation, court order, or
                        governmental authority—or when necessary to protect our
                        rights, safety, or property.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5-8 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Section 5 */}
              <div className="p-8 border-b md:border-b-0 md:border-r border-gray-700">
                <h2 className="text-xl font-bold text-white mb-3">
                  5. Data Security
                </h2>
                <p className="text-gray-400 mb-2">
                  We employ advanced technical, administrative, and physical
                  safeguards to protect your data from unauthorized access,
                  alteration, or disclosure.
                </p>
                <p className="text-gray-500 text-sm">
                  Note: While no method of transmission over the internet is
                  100% secure, we continually work to maintain the highest
                  protection standards.
                </p>
              </div>

              {/* Section 6 */}
              <div className="p-8 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white mb-3">
                  6. Data Retention
                </h2>
                <p className="text-gray-400">
                  We retain personal data only as long as needed to fulfill the
                  purposes outlined in this Privacy Policy or as required by
                  law. Once no longer necessary, we securely delete or anonymize
                  the data.
                </p>
              </div>

              {/* Section 7 */}
              <div className="p-8 md:border-r border-gray-700">
                <h2 className="text-xl font-bold text-white mb-3">
                  7. Children's Privacy
                </h2>
                <p className="text-gray-400">
                  Our services are not directed toward individuals under 13
                  years of age, and we do not knowingly collect data from them.
                  If we learn that we have inadvertently collected such
                  information, we will promptly delete it.
                </p>
              </div>

              {/* Section 8 */}
              <div className="p-8">
                <h2 className="text-xl font-bold text-white mb-3">
                  8. International Data Transfers
                </h2>
                <p className="text-gray-400">
                  If you are located outside the United States, your data may be
                  transferred to—and processed in—countries with different data
                  protection laws. We take steps to ensure such transfers comply
                  with applicable legal requirements.
                </p>
              </div>
            </div>

            {/* Section 9 */}
            <div className="p-8 bg-gray-700/20">
              <div className="flex items-start">
                <div className="bg-indigo-900/50 p-2 rounded-full mr-4">
                  <Lock className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    9. Your Rights & Choices
                  </h2>
                  <p className="mb-3 text-gray-400">
                    Depending on your jurisdiction, you may have the right to
                    access the personal data we hold about you, correct any
                    inaccuracies, request deletion of your personal data, and
                    withdraw consent for certain processing activities.
                  </p>
                  <p className="text-indigo-400 font-medium">
                    To exercise these rights, please email:
                    privacy@MindStormBook.com
                  </p>
                </div>
              </div>
            </div>

            {/* Section 10 */}
            <div className="p-8 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-3">
                10. Marketing Communications
              </h2>
              <p className="text-gray-400">
                You may opt out of marketing messages at any time by clicking
                the "unsubscribe" link in our emails or contacting us directly.
              </p>
            </div>

            {/* Section 11 */}
            <div className="p-8 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-3">
                11. Policy Changes
              </h2>
              <p className="text-gray-400">
                We may update this Privacy Policy periodically. Any material
                changes will be posted here with an updated "Effective Date."
                Your continued use of the Site after changes are posted
                constitutes acceptance of those changes.
              </p>
            </div>

            {/* Section 12 */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                12. Contact Us
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="text-indigo-400 mr-3" size={20} />
                  <span className="text-gray-400">MindStormBook,</span>
                </div>
                <div className="flex items-center">
                  <Mail className="text-indigo-400 mr-3" size={20} />
                  <span className="text-gray-400">
                    privacy@MindStormBook.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
