// import { Link } from "react-router"

import Footer from "@/components/Footer"

function Home() {
  return (
    <div className="min-h-screen flex-col items-center justify-center">
    <div className="bg-black flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-700 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-600 rounded-full opacity-10 blur-3xl"></div>
      </div>
      
      {/* Main content container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Header section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-semibold text-white mb-4 tracking-tight">
            ADMIN DASHBOARD    
          </h1>
          
        </div>
        
        {/* Navigation cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {/* Login Card */}
          <a 
            href="/login" 
            className="group relative p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/25 block"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Login</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Access your existing account securely
              </p>
            </div>
            {/* Hover effect overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300">            </div>
          </a>
          
          {/* Client Dashboard Card */}
          <a 
            href="/Client/Dashboard/a" 
            className="group relative p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/25 block"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Client Portal</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Manage your services and preferences
              </p>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300">            </div>
          </a>
          
          {/* Provider Dashboard Card */}
          <a 
            href="/Provider/Dashboard/a" 
            className="group relative p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/25 block"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Provider Portal</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Manage your business operations
              </p>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-300">            </div>
          </a>
        </div>
        
        {/* Bottom section */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-slate-400 text-sm">
            Built by Team BeCampusX
          </div>
        </div>

      </div>
    </div>
        <Footer/>
        </div>
  )
}

export default Home