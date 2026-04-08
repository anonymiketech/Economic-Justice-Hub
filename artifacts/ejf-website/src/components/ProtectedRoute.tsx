import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0e1f3d]/20 border-t-[#0e1f3d] rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#0e1f3d]/5 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-[#0e1f3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0e1f3d] mb-2">Members Only</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-7">
            You need to be signed in to access this page. Join EJF or sign in to continue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(redirectTo)}
              className="bg-[#0e1f3d] hover:bg-[#1a2f5e] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/")}
              className="border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
