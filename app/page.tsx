export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-16 md:py-24 bg-gradient-to-b from-[var(--color-surface)] to-white">
        <div className="w-full max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-[Plus Jakarta Sans] tracking-tight text-[var(--color-text)] mb-2">
            Your business, on autopilot.
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] mb-8 font-[Inter]">
            Aapka business, autopilot par.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="https://wa.me/919876543210"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[var(--color-primary-blue)] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              WhatsApp Us
            </a>
            <button
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-[var(--color-primary-blue)] text-[var(--color-primary-blue)] font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Free Audit
            </button>
          </div>

          <p className="text-sm text-[var(--color-text-secondary)]">
            50+ businesses automated • ₹5Cr+ revenue increased • 70% time saved
          </p>
        </div>
      </section>

      {/* Two Paths Section */}
      <section className="px-4 md:px-8 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 font-[Plus Jakarta Sans]">
            Choose Your Path
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Digital Path */}
            <a
              href="/digital"
              className="p-8 border-2 border-[var(--color-primary-orange)] rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 bg-[var(--color-primary-orange)] rounded-full" />
                <h3 className="text-2xl font-bold font-[Plus Jakarta Sans]">
                  Small Business
                </h3>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Digital automation, WhatsApp bots, GST filing, social media management.
              </p>
              <p className="text-sm font-semibold text-[var(--color-primary-orange)]">
                From ₹5K/month →
              </p>
            </a>

            {/* Consulting Path */}
            <a
              href="/consulting"
              className="p-8 border-2 border-[var(--color-primary-blue)] rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 bg-[var(--color-primary-blue)] rounded-full" />
                <h3 className="text-2xl font-bold font-[Plus Jakarta Sans]">
                  Larger Company
                </h3>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Custom AI solutions, process audits, platform buildout, retainer support.
              </p>
              <p className="text-sm font-semibold text-[var(--color-primary-blue)]">
                Custom pricing →
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-4 md:px-8 py-16 bg-[var(--color-primary-blue)] text-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">50+</p>
              <p className="text-blue-100">Businesses Automated</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">₹5Cr+</p>
              <p className="text-blue-100">Revenue Increased</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">70%</p>
              <p className="text-blue-100">Time Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="px-4 md:px-8 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 font-[Plus Jakarta Sans]">
            Latest Resources
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <a
              href="/blog/small-business-ai-automation"
              className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold mb-2 font-[Plus Jakarta Sans]">
                AI Automation for Small Business
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm mb-4">
                How to cut operational costs by 40% with AI-powered workflows.
              </p>
              <span className="text-[var(--color-primary-blue)] font-semibold text-sm">
                Read Article →
              </span>
            </a>

            <a
              href="/blog/whatsapp-chatbots"
              className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold mb-2 font-[Plus Jakarta Sans]">
                WhatsApp Chatbots for Sales
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm mb-4">
                Convert WhatsApp inquiries into customers 24/7 with AI.
              </p>
              <span className="text-[var(--color-primary-blue)] font-semibold text-sm">
                Read Article →
              </span>
            </a>

            <a
              href="/blog/gst-filing-automation"
              className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold mb-2 font-[Plus Jakarta Sans]">
                GST Filing Automation
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm mb-4">
                Eliminate manual GST work. File in minutes, not hours.
              </p>
              <span className="text-[var(--color-primary-blue)] font-semibold text-sm">
                Read Article →
              </span>
            </a>
          </div>

          <div className="text-center">
            <a
              href="/blog"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-[var(--color-primary-blue)] text-[var(--color-primary-blue)] font-semibold hover:bg-blue-50 transition-colors"
            >
              View All Articles
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 md:px-8 py-16 bg-[var(--color-surface)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 font-[Plus Jakarta Sans]">
            Ready to automate?
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8 text-lg">
            Get a free audit tailored to your business. No commitment required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919876543210"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[var(--color-primary-blue)] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Message on WhatsApp
            </a>
            <a
              href="mailto:hello@polycloudsolutions.com"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-[var(--color-primary-blue)] text-[var(--color-primary-blue)] font-semibold hover:bg-blue-50 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-8 py-8 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto text-center text-[var(--color-text-secondary)] text-sm">
          <p>© 2026 PolyCloud Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
