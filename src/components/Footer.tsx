// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-4 md:px-8 mt-16 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8"> {/* Changed to md:grid-cols-3 */}
          {/* Project Info Column */}
          <div className="space-y-4 md:col-span-1"> {/* Added md:col-span-1 */}
            <div className="flex items-center space-x-2">
              <div className="text-white text-2xl">
                <i className="fas fa-infinity"></i>
              </div>
              <div className="text-xl font-bold text-white">
                Project Infinity X
              </div>
            </div>
            <p className="text-gray-400">
              Pushing the boundaries of Android customization and performance.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://t.me/projectinfinityx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-gray-700 transition-colors border border-gray-700"
              >
                <i className="fab fa-telegram-plane"></i>
              </a>
              <a
                href="https://github.com/ProjectInfinity-X"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-gray-700 transition-colors border border-gray-700"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href="https://xdaforums.com/tags/infinityx/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="XDA"
                className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-gray-700 transition-colors border border-gray-700"
              >
                <i className="fab fa-x-twitter"></i>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-1"> {/* Added md:col-span-1 */}
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="text-gray-300 hover:text-white transition-colors">
                  Downloads
                </Link>
              </li>
              <li>
                <Link href="/apply-for-maintainership" className="text-gray-300 hover:text-white transition-colors">
                  Apply For Maintainership
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-gray-300 hover:text-white transition-colors">
                  Legal
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column - REMOVED */}
          {/* 
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/ProjectInfinity-X"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Source Code
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ProjectInfinity-X/Documentation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ProjectInfinity-X/Documentation/blob/master/Changelogs.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Changelogs
                </a>
              </li>
            </ul>
          </div> 
          */}

        </div>
        <div className="pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Project Infinity X. All rights reserved. <br />
          <Link href="/legal" className="hover:text-white transition-colors">
            License
          </Link>{' '}
          |{' '}
          <a href="mailto:tejas101k@projectinfinity-x.com" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}