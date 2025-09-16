// src/app/apply-for-maintainership/page.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ApplyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-black">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Apply for Maintainership
            </h1>
            <p className="text-xl text-gray-300">
              Join our team and help bring Project Infinity X to more devices.
            </p>
          </div>
        </section>

        {/* Maintainership Content */}
        <section className="py-12 ">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className=" rounded-2xl border border-gray-800 p-6 md:p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-white">Requirements for Official Maintainership</h2>
              <div className="space-y-8">
                {[
                  {
                    title: 'Source Code Requirements',
                    items: [
                      'Your device sources must be public. While exceptions can be discussed, the team must have visibility.',
                      'Kernel source must be fully publicly pushed as per GPL requirements.',
                      'Respect code consistency of your sources and maintain proper authorships.'
                    ]
                  },
                  {
                    title: 'Build Infrastructure',
                    items: [
                      'You must have proper resources (server/local machine) to build.',
                      'Builds must be clean (no errors/warnings) and reproducible.',
                      'You should be able to provide logs upon request.'
                    ]
                  },
                  {
                    title: 'Device Testing & Support',
                    items: [
                      'Basic device functionality must be working correctly.',
                      'You should be able to test and verify your builds before publishing.',
                      'Provide timely support for users of your device.',
                      'Report bugs to the team and help in resolving them.'
                    ]
                  },
                  {
                    title: 'Communication',
                    items: [
                      'Maintain active communication with the team.',
                      'Participate constructively in team discussions.',
                      'Follow team guidelines and procedures.'
                    ]
                  }
                ].map((section, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-semibold mb-3 text-white">{section.title}</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  
                  <a
                    href="https://github.com/ProjectInfinity-X/official_devices/issues/new?template=maintainers-application.yml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-all border border-gray-700"
                  >
                    <i className="fas fa-paper-plane"></i> Submit Application
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}