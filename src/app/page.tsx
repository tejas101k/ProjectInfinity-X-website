// src/app/page.tsx
"use client"; // Needed for client-side effects like useEffect

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { initParticles } from '@/lib/particles'; // Import particle init
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

export default function Home() {
  const [particlesInitialized, setParticlesInitialized] = useState(false);

  useEffect(() => {
    // Initialize particles after component mounts and window is available
    if (!particlesInitialized) {
      const init = async () => {
        try {
          initParticles();
          setParticlesInitialized(true);
        } catch (err) {
          console.error("Failed to initialize particles:", err);
        }
      };

      // Use a small delay to ensure DOM is ready
      const timer = setTimeout(init, 100);
      return () => clearTimeout(timer);
    }
  }, [particlesInitialized]);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-black">
          {/* Particles Containers - Rendered by initParticles */}
          {/* <div id="sparkles" className="particles-container"></div>
          <div id="droplets" className="particles-container"></div> */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              <div className="md:w-1/2 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                  Unleash Infinite Possibilities
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                  Experience the limitless customization, performance, and stability of Project Infinity X.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <a
                    href="#features"
                    className="px-8 py-3 text-white border border-white rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all"
                  >
                    Explore Features
                  </a>
                  <a
                    href="/downloads"
                    className="px-8 py-3 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-200 transition-all"
                  >
                    Download Now
                  </a>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="relative">
                  {/* Phone Mockup */}
                  <div className="w-64 h-[500px]  rounded-[40px] border-[10px] border-gray-700 shadow-2xl overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-b from-gray-900 to-black p-2">
                      {/* Status Bar */}
                      <div className="flex justify-between items-center px-4 py-1 text-xs text-gray-400">
                        <span>9:41</span>
                        <div className="flex space-x-1">
                          <i className="fas fa-signal"></i>
                          <i className="fas fa-wifi"></i>
                          <i className="fas fa-battery-three-quarters"></i>
                        </div>
                      </div>
                      {/* Infinity Logo & Text */}
                      <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="text-5xl text-white">
                          <i className="fas fa-infinity"></i>
                        </div>
                        <div className="text-xl font-bold text-white">
                          Project Infinity X
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white">
            <a href="#features">
              <i className="fas fa-chevron-down text-2xl"></i>
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 ">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
              Why Choose <span className="text-white">Project Infinity X</span>?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: 'fa-bolt', title: 'Blazing Fast Performance', desc: 'Fine-tuned for speed and responsiveness, delivering a smooth experience.' },
                { icon: 'fa-paint-brush', title: 'Deep Customization', desc: 'Personalize every aspect of your device with extensive theming options.' },
                { icon: 'fa-shield-alt', title: 'Enhanced Security', desc: 'Prioritizing your privacy and security with regular updates and patches.' },
                { icon: 'fa-battery-full', title: 'Optimized Battery Life', desc: 'Smart power management ensures your device lasts longer on a single charge.' },
                { icon: 'fa-sync-alt', title: 'Regular Updates', desc: 'Stay up-to-date with the latest features, security patches, and improvements.' },
                { icon: 'fa-users', title: 'Active Community', desc: 'Join a vibrant community of users and developers for support and feedback.' },
              ].map((feature, index) => (
                <div key={index} className=" p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition-all">
                  <div className="text-white text-3xl mb-4">
                    <i className={`fas ${feature.icon}`}></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>



{/* Screenshots Section */}
<section id="screenshots" className="screenshots">
  <div className="container mx-auto px-4 max-h-full">
    <div className="section-title text-center mb-12">
      {/* Change title color to pink */}
      <h2 className="text-4xl font-bold mb-4 text-pink-500">Screenshots</h2>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto">
        Experience the stunning visuals of Project Infinity X on your device
      </p>
    </div>
    <div className="screenshots-slider relative h-full flex items-center justify-center">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        loop={true}
        spaceBetween={20}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 1.5,
          slideShadows: true,
        }}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper"
        breakpoints={{
          // For smaller screens, show fewer images
          320: {
            slidesPerView: 'auto',
            spaceBetween: 10
          },
          480: {
            slidesPerView: 'auto',
            spaceBetween: 15
          },
          768: {
            slidesPerView: 'auto',
            spaceBetween: 20
          },
          // For larger screens, show up to 5 images
          992: {
            slidesPerView: 5,
            spaceBetween: 20
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 20
          }
        }}
      >
        {/* Generate slides for screenshots 1 to 10 */}
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
          <SwiperSlide key={num}>
            <div className="swiper-slide-content">
              {/* Ensure images exist in public/images/ */}
              <img
                src={`/images/ss-${num}.webp`}
                alt={`Screenshot ${num}`}
                className="w-full h-full object-cover block"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    <div className="swipe-hint text-center mt-6 text-gray-500">
      <i className="fas fa-arrows-alt-h mr-2"></i> Swipe to view more screenshots
    </div>
  </div>
</section>

        {/* CTA Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Experience Infinity?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users enjoying a superior Android experience.
            </p>
            <a
              href="/downloads"
              className="inline-flex items-center px-8 py-4 bg-white text-black rounded-full font-semibold text-lg shadow-lg hover:bg-gray-200 transition-all"
            >
              <i className="fas fa-download mr-2"></i> Get Project Infinity X
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}