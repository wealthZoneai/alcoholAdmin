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

/* ===================== CONFIG (EDIT EVERYTHING HERE) ===================== */

const footerConfig = {
  brand: {
    name: "Benjour",
    logo: "🍽️",
    description:
      "Delivering culinary excellence straight to your doorstep. Fresh ingredients, authentic flavors, and the joy of dining redefined.",
  },

  socialLinks: [
    { icon: FaFacebook, url: "#" },
    { icon: FaTwitter, url: "#" },
    { icon: FaInstagram, url: "#" },
    { icon: FaLinkedin, url: "#" },
  ],

  contact: {
    address: "123 Gourmet Street, Foodie City, FC 12345",
    phone: "+1 (234) 567-890",
    email: "hello@benjour.com",
    hours: "Mon–Sun: 8 AM – 11 PM",
  },

  newsletter: {
    title: "Newsletter",
    subtitle: "Join our foodie circle for exclusive offers & chef’s specials.",
    placeholder: "Your email address",
    buttonText: "Subscribe",
  },

  footerLinks: ["Privacy Policy", "Terms of Service", "Sitemap"],
};

/* ===================== COMPONENT ===================== */

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white pt-14 pb-8 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_80%,_#34d399,_transparent_50%)]"></div>

      <div className="fle z-10 container mx-auto px-5 sm:px-8">
        <div className="flex  gap-10 mb-14">

          {/* BRAND */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-3xl font-extrabold flex justify-center sm:justify-start items-center">
              <span className="bg-white text-emerald-600 p-2.5 rounded-xl mr-3 shadow-md">
                {footerConfig.brand.logo}
              </span>
              {footerConfig.brand.name}
            </h3>

            <p className="text-emerald-100 text-sm leading-relaxed">
              {footerConfig.brand.description}
            </p>

            <div className="flex justify-center sm:justify-start space-x-3 pt-3">
              {footerConfig.socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  <item.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* CONTACT */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-semibold mb-5 border-b border-emerald-700 inline-block">
              Contact Us
            </h4>

            <ul className="space-y-3 text-sm">
              <li className="flex justify-center sm:justify-start items-start">
                <FaMapMarkerAlt className="mr-3 mt-1 text-emerald-300" />
                {footerConfig.contact.address}
              </li>
              <li className="flex justify-center sm:justify-start items-center">
                <FaPhone className="mr-3 text-emerald-300" />
                {footerConfig.contact.phone}
              </li>
              <li className="flex justify-center sm:justify-start items-center">
                <FaEnvelope className="mr-3 text-emerald-300" />
                {footerConfig.contact.email}
              </li>
              <li className="flex justify-center sm:justify-start items-center">
                <FaClock className="mr-3 text-emerald-300" />
                {footerConfig.contact.hours}
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-semibold mb-5 border-b border-emerald-700 inline-block">
              {footerConfig.newsletter.title}
            </h4>

            <p className="text-sm text-emerald-100 mb-4">
              {footerConfig.newsletter.subtitle}
            </p>

            <form className="space-y-3">
              <input
                type="email"
                placeholder={footerConfig.newsletter.placeholder}
                className="w-full px-4 py-3 rounded-lg bg-emerald-950 border border-emerald-700 focus:ring-2 focus:ring-emerald-400 outline-none"
              />
              <button className="w-full bg-emerald-400 text-emerald-950 font-semibold py-3 rounded-lg hover:bg-emerald-300 transition">
                {footerConfig.newsletter.buttonText}
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-emerald-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-emerald-300">
            © {currentYear} <span className="text-white font-semibold">{footerConfig.brand.name}</span>. All rights reserved.
          </p>

          <div className="flex space-x-5 mt-3 md:mt-0">
            {footerConfig.footerLinks.map((item) => (
              <a
                key={item}
                href="#"
                className="text-emerald-300 hover:text-white underline-offset-4 hover:underline"
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
