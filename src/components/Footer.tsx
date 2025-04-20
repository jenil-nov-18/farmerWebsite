import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-agro-green-900 text-white">
      <div className="container-custom pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-white" />
              <span className="font-display text-xl font-bold text-white">
                Farmer<span className="text-agro-green-300">Selling</span>
              </span>
            </Link>
            <p className="text-agro-green-100 text-sm">
              Empowering farmers with knowledge and a marketplace to grow their business sustainably.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-white hover:text-agro-green-300" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-white hover:text-agro-green-300" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-white hover:text-agro-green-300" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-white hover:text-agro-green-300" aria-label="Youtube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-agro-green-100 hover:text-white text-sm">
                  Shop Products
                </Link>
              </li>
              <li>
                <Link to="/learn" className="text-agro-green-100 hover:text-white text-sm">
                  Learning Resources
                </Link>
              </li>
              <li>
                <Link to="/seller-dashboard" className="text-agro-green-100 hover:text-white text-sm">
                  Sell Your Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-agro-green-100 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-agro-green-100 hover:text-white text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-agro-green-100 hover:text-white text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-agro-green-100 hover:text-white text-sm">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-agro-green-100 hover:text-white text-sm">
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-agro-green-100 hover:text-white text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-agro-green-100 hover:text-white text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 flex-shrink-0 text-agro-green-300" />
                <span className="text-agro-green-100 text-sm">
                  123 Farm Road, Green Valley, Agricultural District
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0 text-agro-green-300" />
                <span className="text-agro-green-100 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0 text-agro-green-300" />
                <span className="text-agro-green-100 text-sm">support@agrocommerce.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-agro-green-800 mt-10 pt-6 text-center text-xs text-agro-green-300">
          <p>&copy; {new Date().getFullYear()} Farmerselling. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
