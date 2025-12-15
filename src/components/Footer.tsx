import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white pt-14 pb-8 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_80%,_#34d399,_transparent_50%)]"></div>

      <div className="relative z-10 container mx-auto px-5 sm:px-8">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-10 sm:mb-14">
          {/* About */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex justify-center sm:justify-start items-center">
              <span className="bg-white text-emerald-600 p-2.5 rounded-xl mr-3 shadow-md">🍽️</span>
              <span className="tracking-tight">Benjour</span>
            </h3>
            <p className="text-emerald-100 leading-relaxed text-sm sm:text-base">
              Delivering culinary excellence straight to your doorstep. Fresh ingredients,
              authentic flavors, and the joy of dining redefined.
            </p>
            <div className="flex justify-center sm:justify-start space-x-3 pt-3">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  <Icon size={18} className="text-emerald-200 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-semibold mb-5 sm:mb-6 pb-1 border-b border-emerald-700 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {["Home", "Menu", "About Us", "Contact", "FAQ"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="group flex justify-center sm:justify-start items-center text-emerald-100 hover:text-white transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 sm:mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-semibold mb-5 sm:mb-6 pb-1 border-b border-emerald-700 inline-block">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm sm:text-base">
              <li className="flex justify-center sm:justify-start items-start sm:items-center">
                <FaMapMarkerAlt className="text-emerald-300 mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="text-emerald-100 max-w-[200px] sm:max-w-none">
                  123 Gourmet Street, Foodie City, FC 12345
                </span>
              </li>
              <li className="flex justify-center sm:justify-start items-center">
                <FaPhone className="text-emerald-300 mr-2 sm:mr-3" />
                <a href="tel:+1234567890" className="hover:text-white">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex justify-center sm:justify-start items-center">
                <FaEnvelope className="text-emerald-300 mr-2 sm:mr-3" />
                <a href="mailto:hello@benjour.com" className="hover:text-white">
                  hello@benjour.com
                </a>
              </li>
              <li className="flex justify-center sm:justify-start items-center">
                <FaClock className="text-emerald-300 mr-2 sm:mr-3" />
                <span>Mon–Sun: 8 AM – 11 PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-semibold mb-5 sm:mb-6 pb-1 border-b border-emerald-700 inline-block">
              Newsletter
            </h4>
            <p className="text-emerald-100 mb-3 sm:mb-4 text-sm sm:text-base">
              Join our foodie circle for exclusive offers & chef’s specials.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 sm:py-3 rounded-lg bg-emerald-950 border border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white placeholder-emerald-300 text-sm sm:text-base"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-emerald-950 hover:from-emerald-300 hover:to-emerald-400 font-semibold py-2.5 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-emerald-800 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-emerald-300 text-xs sm:text-sm tracking-wide">
            &copy; {currentYear} <span className="font-semibold text-white">Benjour</span>. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end space-x-4 sm:space-x-6 mt-3 md:mt-0 text-xs sm:text-sm">
            {["Privacy Policy", "Terms of Service", "Sitemap"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-emerald-300 hover:text-white transition-all duration-300 hover:underline underline-offset-4"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
