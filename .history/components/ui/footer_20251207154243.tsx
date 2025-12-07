import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">📚</span>
              </div>
              <span className="text-xl font-bold text-white">StudyVault</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              Free, secure access to study materials. All PDFs are view-only, 
              watermarked, and protected. No login required.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/subjects" className="text-sm hover:text-white transition-colors">
                  Browse Subjects
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Security */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Security
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> View-only documents
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Watermarked pages
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> No downloads
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> No printing
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} StudyVault. All materials are protected and watermarked.
          </p>
        </div>
      </div>
    </footer>
  );
}
