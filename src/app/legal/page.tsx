// src/app/legal/page.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LegalPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-black">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Legal Information
            </h1>
            <p className="text-xl text-gray-300">
              Terms, conditions, and licensing information.
            </p>
          </div>
        </section>

        {/* Legal Content */}
        <section className="py-12 ">
          <div className="container mx-auto px-4 max-w-4xl space-y-8">
            <div className=" rounded-2xl border border-gray-800 p-6 md:p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white">License</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  © Project Infinity X<br />
                  The source code of this website is licensed under the{' '}
                  <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-medium">
                    Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License (CC BY-NC-ND 4.0)
                  </a>.
                </p>

                <h3 className="text-xl font-semibold text-white">Permissions</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You are free to view and download the source code for educational, research, or personal purposes.</li>
                  <li>You may share the code in its original form provided that proper attribution is given.</li>
                </ul>

                <h3 className="text-xl font-semibold text-white">Restrictions</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You are not authorized to copy or redistribute the entire website or its content, in whole or in part, for commercial purposes.</li>
                  <li>You may not modify, adapt, or build upon the code and distribute it.</li>
                </ul>

                <h3 className="text-xl font-semibold text-white">Attribution</h3>
                <p>
                  You must give appropriate credit to Project Infinity X, provide a link to the license, and indicate if any changes were made (if permitted).
                </p>
                <p>
                  <strong>Full License Text:</strong>{' '}
                  <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-medium">
                    https://creativecommons.org/licenses/by-nc-nd/4.0/
                  </a>
                </p>
                <p>
                  For permissions, inquiries, or contributions, please contact:{' '}
                  <a href="mailto:tejas101k@projectinfinity-x.com" className="text-white hover:underline font-medium">tejas101k@projectinfinity-x.com</a>
                </p>
              </div>
            </div>

            <div className=" rounded-2xl border border-gray-800 p-6 md:p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white">GNU General Public License</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Project Infinity X is free software: you can redistribute it and/or modify it under the terms of the{' '}
                  <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-medium">
                    GNU General Public License
                  </a>{' '}
                  as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
                </p>

                <h3 className="text-xl font-semibold text-white">Permissions</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You can run the software for any purpose</li>
                  <li>You can study how the software works and modify it</li>
                  <li>You can redistribute copies of the software</li>
                  <li>You can distribute modified versions of the software</li>
                </ul>

                <h3 className="text-xl font-semibold text-white">Compliance Requirements</h3>
                <p>All maintainers and contributors must adhere to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Full GPLv3 compliance for all distributed software</li>
                  <li>Complete pushes of codes used</li>
                  <li>No enforcements of private exclusivity</li>
                  <li>Timely release of kernel sources for all device builds</li>
                </ul>

                <h3 className="text-xl font-semibold text-white">Disclaimer of Warranty</h3>
                <p>
                  Project Infinity X is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}