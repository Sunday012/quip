"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Calendar, CreditCard, Shield, Smartphone, Globe, MapPin, UserCheck } from "lucide-react"
import Image from "next/image"

export default function Component() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const featuresRef = useRef<HTMLDivElement>(null)
  const whyKoalaRef = useRef<HTMLElement>(null)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    userRole: "",
    serviceCategory: "",
  })

  // Initialize animations after component mounts
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Mouse tracking for subtle interactive animations
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Scroll tracking for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        }
      })
    }, observerOptions)

    const elements = [featuresRef.current, whyKoalaRef.current]
    elements.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

// Replace your existing handleSubmit function with this:
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.fullName || !formData.userRole) return
    if (formData.userRole === "provider" && !formData.serviceCategory) return
  
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          userRole: formData.userRole,
          serviceCategory: formData.serviceCategory
        })
      });
  
      const result = await response.json();
      
      if (result.success) {
        setIsSubmitted(true)
        setShowModal(false)
        setFormData({ fullName: "", email: "", userRole: "", serviceCategory: "" })
      } else {
        // Handle error - you might want to show an error message to the user
        console.error('Failed to join waitlist:', result.error);
        alert('Failed to join waitlist. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false)
    }
  }

  const handleSurvey = () => {
    // Open survey in new tab
    window.open("https://forms.gle/AepYKp6ZBUqvphDGA", "_blank")
  }

  const parallaxStyle = {
    transform: `translateY(${scrollY * 0.3}px)`,
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Minimal floating shapes */}
        <div
          className="absolute top-20 left-10 w-16 h-16 bg-green-100 rounded-full opacity-20"
          style={{
            transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px) translateY(${scrollY * 0.2}px)`,
          }}
        />
        <div
          className="absolute top-40 right-20 w-12 h-12 bg-green-200 rounded-lg opacity-25"
          style={{
            transform: `translate(${mousePosition.x * -0.008}px, ${mousePosition.y * 0.008}px) translateY(${scrollY * 0.15}px)`,
          }}
        />
        <div
          className="absolute bottom-40 left-1/4 w-8 h-8 bg-green-300 rounded-full opacity-15"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.005}px) translateY(${scrollY * 0.25}px)`,
          }}
        />

        {/* Subtle gradient orbs */}
        <div
          className="absolute top-1/3 left-1/3 w-24 h-24 bg-gradient-to-r from-green-200 to-green-300 rounded-full opacity-10 blur-xl"
          style={{
            transform: `translate(${mousePosition.x * 0.003}px, ${mousePosition.y * 0.003}px) translateY(${scrollY * 0.1}px)`,
          }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-gray-100 relative z-10 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 group">
                <Image src="/images/logo.png" alt="Koala logo" width={100} height={100} />
                {/* <span className="text-xl font-semibold text-gray-900 transition-colors duration-200 group-hover:text-green-700">
                  koala
                </span> */}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-green-700 text-green-700 hover:bg-green-50 transition-all duration-200"
              onClick={() => setShowModal(true)}
            >
              Join waitlist
            </Button>
          </div>
        </div>
      </header>

      {/* Funding Banner */}
      <div className="bg-gradient-to-r from-green-50 to-white py-2 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <span className="text-sm text-green-800">🎉 Join the moving train!</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden z-10">
        <div
          className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100"
          style={parallaxStyle}
        />
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span
                className={`inline-block transition-all duration-600 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                The{" "}
              </span>
              <span
                className={`text-green-700 mx-2 inline-block transition-all duration-600 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: "100ms" }}
              >
                marketplace
              </span>
              <span
                className={`inline-block transition-all duration-600 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: "200ms" }}
              >
                {" "}
                for people in
              </span>
              <br />
              <span
                className={`text-gray-500 inline-block transition-all duration-600 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: "300ms" }}
              >
                need of local services
              </span>
            </h1>
            <p
              className={`text-xl text-gray-600 mb-8 max-w-2xl mx-auto transition-all duration-500 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "400ms" }}
            >
              Koala connects you with trusted local service providers and makes booking awesome
            </p>

            {/* Waitlist and Survey Buttons */}
            {!isSubmitted ? (
              <div
                className={`mb-12 transition-all duration-500 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: "500ms" }}
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    onClick={() => setShowModal(true)}
                    className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-lg font-semibold rounded-md transition-all duration-200 hover:scale-105 transform"
                  >
                    Join the Waitlist
                  </Button>
                  <Button
                    onClick={handleSurvey}
                    variant="outline"
                    className="border-green-700 text-green-700 hover:bg-green-50 px-8 py-3 text-lg font-semibold rounded-md transition-all duration-200 hover:scale-105 transform"
                  >
                    Take a Survey
                  </Button>
                </div>
                <p
                  className={`text-sm text-gray-500 mt-4 text-center transition-all duration-500 ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`}
                  style={{ transitionDelay: "600ms" }}
                >
                  Koala is launching soon. We'll notify you when it's ready for your area.
                </p>
              </div>
            ) : (
              <div className="mb-12">
                <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-700 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">You're on the waitlist!</h3>
                  <p className="text-green-700 mb-4">
                    Thank you for joining! We'll notify you as soon as Koala launches in your area.
                  </p>
                  <p className="text-sm text-green-600">
                    Keep an eye on your inbox for updates and early access opportunities.
                  </p>
                </div>
              </div>
            )}

            {/* Features Grid with Illustrations */}
            <div
              ref={featuresRef}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 opacity-0 translate-y-8 transition-all duration-800"
            >
              {[
                {
                  image: "/images/secured-payments.png",
                  title: "Secure Payments",
                  description: "128-bit encryption with Paystack integration for safe transactions",
                },
                {
                  image: "/images/review.png",
                  title: "Trusted Reviews",
                  description: "Verified ratings and reviews from real customers",
                },
                {
                  image: "/images/idea.png",
                  title: "Smart Matching",
                  description: "AI-powered system connects you with the perfect service provider",
                },
                {
                  image: "/images/yippy.png",
                  title: "Guaranteed Success",
                  description: "Quality service delivery with satisfaction guarantee",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="border-gray-200 hover:border-green-300 transition-all duration-300 text-center group hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="w-24 h-24 mx-auto mb-4 transition-transform duration-200 group-hover:scale-105">
                      <img
                        src={feature.image || "/placeholder.svg"}
                        alt={feature.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-200">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Trusted by companies */}
        <div className="bg-gray-50 py-12 relative">
          <div className="container mx-auto px-4 text-center">
            <p
              className={`text-sm text-gray-500 mb-8 transition-all duration-500 ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`}
              style={{ transitionDelay: "700ms" }}
            >
              Trusted by individuals at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {["Vercel", "Stripe", "Notion", "Linear", "Figma", "Framer"].map((company, index) => (
                <div
                  key={company}
                  className={`text-gray-400 font-semibold hover:text-gray-600 transition-all duration-200 ${isLoaded ? "opacity-60" : "opacity-0"}`}
                  style={{ transitionDelay: `${800 + index * 50}ms` }}
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why KOALA Section */}
      <section
        ref={whyKoalaRef}
        className="py-20 bg-white relative z-10 opacity-0 translate-y-8 transition-all duration-800"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Why KOALA?</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: MapPin,
                title: "Geo-Based Search",
                description: "Discover nearby providers in seconds with our smart location filter",
              },
              {
                icon: UserCheck,
                title: "Verified Experts",
                description: "All providers go through a strict verification process to guarantee quality",
              },
              {
                icon: CreditCard,
                title: "Secure Payments",
                description: "Pay seamlessly in-app with multiple trusted payment options",
              },
              {
                icon: Star,
                title: "Ratings & Reviews",
                description: "Make informed choices with community feedback and provider ratings",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-gray-50 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Customizable
                  <br />
                  categories for your most
                  <br />
                  common service needs
                </h2>
                <p className="text-gray-600 mb-8">Get services in the exact format your situation needs.</p>
                <div className="flex flex-wrap gap-3">
                  {["Home services", "Personal care", "Professional", "Events"].map((category, index) => (
                    <Badge
                      key={category}
                      className={`px-4 py-2 transition-all duration-200 hover:scale-105 ${
                        index === 0
                          ? "bg-green-700 hover:bg-green-800 text-white"
                          : "border-gray-300 text-gray-600 hover:border-green-300 hover:text-green-700"
                      }`}
                      variant={index === 0 ? "default" : "outline"}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="border-b border-gray-100 pb-4 mb-4">
                      <h3 className="font-semibold text-gray-900">Home cleaning service</h3>
                      <p className="text-sm text-gray-500">📅 Today 2:00 PM • 🏠 2 bed, 1 bath</p>
                    </div>
                    <div className="space-y-3">
                      {["About them", "Key requirements", "Service details", "Budget & Timeline", "Next Steps"].map(
                        (item, index) => (
                          <div
                            key={item}
                            className="bg-gray-50 p-3 rounded hover:bg-green-50 transition-colors duration-200"
                          >
                            <p className="text-sm font-medium text-gray-900">{item}</p>
                            <div className="h-2 bg-gray-200 rounded mt-2 overflow-hidden">
                              <div
                                className="h-full bg-green-300 rounded"
                                // style={{ width: `${Math.random() * 60 + 40}%` }}
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How it works</h2>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Koala is like a personal assistant, but it also
                  <span className="text-green-700"> connects you with verified providers</span>
                </h3>
                <Card className="bg-gray-50 border-0 hover:bg-green-50 transition-colors duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex space-x-1">
                        {["bg-red-400", "bg-yellow-400", "bg-green-400"].map((color, index) => (
                          <div key={index} className={`w-3 h-3 ${color} rounded-full`} />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>🔍 Searching...</p>
                      <p>📋 Got: barber, 2-4 PM, downtown</p>
                      <p>💰 Budget: $30-50</p>
                      <p className="text-green-700 font-medium">"a priority for Q2"</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  When the service ends, Koala
                  <span className="text-green-700"> enhances</span> the experience you've written
                </h3>
                <Card className="bg-gray-50 border-0 hover:bg-green-50 transition-colors duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex space-x-1">
                        {["bg-red-400", "bg-yellow-400", "bg-green-400"].map((color, index) => (
                          <div key={index} className={`w-3 h-3 ${color} rounded-full`} />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium">Service Overview</p>
                        <ul className="text-gray-600 mt-1 space-y-1">
                          <li>• Professional haircut service completed</li>
                          <li>• Elite Cuts - 4.9/5 rating</li>
                          <li>• Service duration: 45 minutes</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium">Service Provider (Verified) ✓</p>
                        <ul className="text-gray-600 mt-1 space-y-1">
                          <li>• Licensed professional</li>
                          <li>• 5+ years experience</li>
                          <li>• Specializes in modern cuts and styling</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-green-700">✓ Service completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center">
              <blockquote className="text-xl italic text-gray-600 mb-4">
                "Built with passion to connect people with
                <br />-trusted services, simply and seamlessly."
              </blockquote>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full hover:bg-green-100 transition-colors duration-200"></div>
                <div>
                  <p className="font-semibold text-gray-900">David Sunny</p>
                  <p className="text-sm text-gray-500">Founder, Koala</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform compatibility */}
      <section className="py-20 bg-gray-50 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Works on all platforms,
            <br />
            no service interruptions
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Koala connects with your preferred platforms seamlessly, with no service disruptions or complicated
            integrations
          </p>

          <div className="flex justify-center items-center space-x-8 opacity-60">
            {[Smartphone, Globe, Calendar, CreditCard, Shield].map((Icon, index) => (
              <Icon
                key={index}
                className="w-12 h-12 text-gray-400 hover:text-green-600 transition-colors duration-200"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready for better, more
              <br />
              reliable local services?
            </h2>
            <p className="text-gray-600 mb-8">Try Koala for a few service bookings today. It's free to get started</p>
            <div className="flex flex-col gap-3">
              <Button
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-lg font-semibold rounded-md w-full transition-all duration-200 hover:scale-105"
                onClick={() => setShowModal(true)}
              >
                Join the waitlist
              </Button>
              <Button
                variant="outline"
                className="border-green-700 text-green-700 hover:bg-green-50 px-8 py-3 text-lg font-semibold rounded-md w-full transition-all duration-200 hover:scale-105"
                onClick={handleSurvey}
              >
                Take a Survey
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Koala is launching soon. We can let you know when it's ready for your area.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 relative z-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>© Koala Inc. 2025</span>
            </div>
            <div className="flex items-center space-x-6">
              {["Contact us", "Privacy & Security", "Contact", "LinkedIn"].map((link) => (
                <a key={link} href="#" className="hover:text-gray-700 transition-colors duration-150">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Waitlist Modal - Minimal animations */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Join the Waitlist</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-150"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-150"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-150"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 mb-2">
                    I am a *
                  </label>
                  <select
                    id="userRole"
                    name="userRole"
                    value={formData.userRole}
                    onChange={(e) => setFormData({ ...formData, userRole: e.target.value, serviceCategory: "" })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-150"
                  >
                    <option value="">Select your role</option>
                    <option value="customer">Customer (looking for services)</option>
                    <option value="provider">Service Provider</option>
                  </select>
                </div>

                {formData.userRole === "provider" && (
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Service Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.serviceCategory}
                      onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-150"
                    >
                      <option value="">Select your service category</option>
                      <option value="medical">Medical & health</option>
                      <option value="nonprofit">Nonprofit organization</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="shopping">Shopping & retail</option>
                      <option value="other-business">Other Business</option>
                      <option value="automotive">Automotive Service</option>
                      <option value="apparel">Apparel & clothing</option>
                      <option value="arts">Arts & entertainment</option>
                      <option value="beauty">Beauty, cosmetic & personal care</option>
                      <option value="education">Education</option>
                      <option value="event-planner">Event Planner</option>
                      <option value="finance">Finance</option>
                      <option value="grocery">Grocery Store</option>
                      <option value="hotel">Hotel</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1 transition-colors duration-150"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white transition-colors duration-150"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Joining...
                      </div>
                    ) : (
                      "Join Waitlist"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  )
}
