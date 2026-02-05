import { Star } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-navy-800 p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl mx-auto mb-4 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            <Star className="text-navy-900 w-7 h-7 fill-current" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2">
            Sign in to track your favorite lotteries
          </p>
        </div>

        <div className="space-y-4">
          <button className="w-full py-3 px-4 bg-white text-navy-900 font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-3">
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
          <button className="w-full py-3 px-4 bg-[#1877F2] text-white font-bold rounded-xl hover:bg-[#1864CC] transition-colors flex items-center justify-center gap-3">
            {/* Simple Facebook Icon representation */}
            <span className="font-bold text-xl">f</span>
            Sign in with Facebook
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-navy-800 text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            />
            <button className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-gold-500/30">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
