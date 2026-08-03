"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Phone, Home, Building2, Heart, Check, Clock, ArrowRight, Users, Briefcase } from "lucide-react";
import LeatherBadge from "@/components/LeatherBadge";

export default function LandingPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isMobileWidth = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isMobileWidth);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = '/pexels-ono-kosuki-5999899.jpg';
    img.onload = () => setImageLoaded(true);
  }, []);

  if (isMobile === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-600 text-center p-4">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Mobile Only</h1>
          <p>This page is designed for mobile devices only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{
          backgroundImage: "url('/pexels-ono-kosuki-5999899.jpg')",
          filter: imageLoaded ? 'none' : 'blur(20px)',
          backgroundColor: imageLoaded ? 'transparent' : '#F0E6D6'
        }}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-amber-700"></div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <LeatherBadge />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center p-6 no-scrollbar">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-serif font-bold text-white mb-4 leading-tight">
            Your Gulf & USA Job is Waiting
          </h1>
          <p className="text-xl font-serif text-amber-200 mb-2">
            We Handle Everything
          </p>
          <p className="text-lg font-serif text-gray-200">
            From documents to accommodation - one call, we do it all
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-4"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Phone className="w-8 h-8 text-amber-400" />
            <p className="text-amber-200 font-serif text-sm">Call Now - Free Consultation</p>
          </div>
          <p className="text-4xl font-serif font-bold text-white">0785664256</p>
          <p className="text-amber-200 font-serif text-sm mt-2">
            Available 24/7 - Same Day Response
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-6"
        >
          <Clock className="w-10 h-10 text-amber-400 mx-auto mb-2" />
          <h3 className="text-xl font-serif font-bold text-white mb-2">Limited Spots Available</h3>
          <p className="text-sm font-serif text-amber-200 mb-4">
            Jobs available now - processing starts immediately
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => router.push('/mobile-form')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 font-serif font-bold transition-colors flex items-center gap-2"
            >
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center mt-3">
            <button
              onClick={() => router.push('/mobile-form?login=true')}
              className="border border-amber-400 text-amber-200 hover:bg-amber-400/20 px-4 py-2 font-serif text-sm transition-colors"
            >
              Login
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-2xl font-serif font-bold text-white mb-2">
            We Pay for Everything Upfront
          </p>
          <p className="text-lg font-serif text-gray-200">
            You only pay when you're earning. No risk, all reward.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 space-y-4"
        >
          <div className="text-center">
            <Home className="w-10 h-10 text-amber-400 mx-auto mb-1" />
            <h3 className="text-lg font-serif font-bold text-white mb-1">Household Jobs</h3>
            <p className="text-2xl font-serif font-bold text-amber-400 mb-1">KES 60,000-120,000/month</p>
            <p className="text-xs font-serif text-gray-200">Housekeeping, childcare, cooking</p>
          </div>
          <div className="text-center">
            <Building2 className="w-10 h-10 text-amber-400 mx-auto mb-1" />
            <h3 className="text-lg font-serif font-bold text-white mb-1">Construction Jobs</h3>
            <p className="text-2xl font-serif font-bold text-amber-400 mb-1">KES 75,000-150,000/month</p>
            <p className="text-xs font-serif text-gray-200">Skilled and general labor</p>
          </div>
          <div className="text-center">
            <Heart className="w-10 h-10 text-amber-400 mx-auto mb-1" />
            <h3 className="text-lg font-serif font-bold text-white mb-1">Healthcare Jobs</h3>
            <p className="text-2xl font-serif font-bold text-amber-400 mb-1">KES 100,000-200,000/month</p>
            <p className="text-xs font-serif text-gray-200">Nurses, caregivers, medical staff</p>
          </div>
          <div className="text-center">
            <Briefcase className="w-10 h-10 text-amber-400 mx-auto mb-1" />
            <h3 className="text-lg font-serif font-bold text-white mb-1">IT & Engineering</h3>
            <p className="text-2xl font-serif font-bold text-amber-400 mb-1">KES 150,000-300,000/month</p>
            <p className="text-xs font-serif text-gray-200">Software, technical, engineering roles</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center mt-8"
        >
          <Heart className="w-12 h-12 text-amber-400 mx-auto mb-2" />
          <h3 className="text-2xl font-serif font-bold text-white mb-2">Build Better Life for Your Family</h3>
          <p className="text-lg font-serif text-amber-200 mb-2">
            Send money home, build your dream house, secure your family's future
          </p>
          <p className="text-sm font-serif text-gray-200">
            Every day you wait is a day closer to someone else taking your dream job
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-8 flex justify-around items-center"
        >
          <div className="text-center">
            <p className="text-3xl font-serif font-bold text-amber-400">500+</p>
            <p className="text-xs font-serif text-gray-200">Kenyans Placed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-serif font-bold text-amber-400">90%</p>
            <p className="text-xs font-serif text-gray-200">Success Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-serif font-bold text-amber-400">10+</p>
            <p className="text-xs font-serif text-gray-200">Years Experience</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-8"
        >
          <h3 className="text-xl font-serif font-bold text-white mb-4">We Handle Everything For You</h3>
          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-xs font-serif text-gray-200">Passport</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-xs font-serif text-gray-200">Good Conduct</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-xs font-serif text-gray-200">Visa Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-xs font-serif text-gray-200">Job Placement</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-xs font-serif text-gray-200">Accommodation</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-xs font-serif text-gray-200">Flight Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-xs font-serif text-gray-200">Orientation</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-xs font-serif text-gray-200">Support</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-center mt-8 space-y-4"
        >
          <h3 className="text-lg font-serif font-bold text-white mb-4">Why Trust Us</h3>
          <div className="space-y-3 text-left">
            <div>
              <Users className="w-6 h-6 text-amber-400 mb-1" />
              <p className="text-white font-serif font-semibold">Physical Office</p>
              <p className="text-xs font-serif text-gray-300">Nairobi City Center, Upper Hill</p>
            </div>
            <div>
              <Phone className="w-6 h-6 text-amber-400 mb-1" />
              <p className="text-white font-serif font-semibold">Real People</p>
              <p className="text-xs font-serif text-gray-300">Speak to actual consultants, not bots</p>
            </div>
            <div>
              <Check className="w-6 h-6 text-amber-400 mb-1" />
              <p className="text-white font-serif font-semibold">Transparent Terms</p>
              <p className="text-xs font-serif text-gray-300">Clear fees, no hidden charges</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
