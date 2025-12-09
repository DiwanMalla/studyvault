import Breadcrumb from "@/components/ui/breadcrumb";

export const metadata = {
  title: "About - StudyVault",
  description:
    "Learn about StudyVault - Free MBBS study materials for medical students",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[{ label: "About" }]} />
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            About StudyVault
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {/* Mission */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              StudyVault provides free, secure access to MBBS study materials
              for medical students. We cover Medicine, Pediatrics, Obstetrics
              &amp; Gynecology, Surgery, and Minor subjects to help you excel in
              your medical education.
            </p>
          </section>

          {/* How It Works */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">1️⃣</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Browse
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Explore medical subjects and topics to find the materials you
                  need.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">2️⃣</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  View
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Read documents page-by-page in our secure viewer.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">3️⃣</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Learn
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Study at your own pace, anytime, anywhere.
                </p>
              </div>
            </div>
          </section>

          {/* Security Features */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Security Features
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We take content protection seriously. All documents on StudyVault
              are protected with:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <span className="text-2xl">🔒</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    View-Only Access
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Documents cannot be downloaded or saved.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <span className="text-2xl">💧</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Dynamic Watermarks
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Each page includes session-specific watermarks.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <span className="text-2xl">🖨️</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Print Disabled
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Printing functionality is blocked.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <span className="text-2xl">🖱️</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Right-Click Disabled
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Context menus are disabled on documents.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Is StudyVault really free?
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes! StudyVault is completely free to use. No login required,
                  no hidden fees.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Why can&apos;t I download the PDFs?
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  To protect content creators and ensure materials remain
                  accessible to everyone, we only allow view-only access to
                  documents.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What&apos;s the watermark on documents?
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Each page is watermarked with &ldquo;StudyVault — Do Not
                  Share&rdquo; along with a timestamp and session ID. This helps
                  prevent unauthorized distribution.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Can I contribute study materials?
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  We welcome contributions! Please contact us if you&apos;d like
                  to share educational materials that you have the rights to
                  distribute.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
