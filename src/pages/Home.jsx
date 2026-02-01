import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  
const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    {
      title: "Facial Treatments",
      description: "Rejuvenate your skin with our signature facial therapies",
      icon: "✨",
      delay: "0.1s",
    },
    {
      title: "Hair Styling",
      description: "Transform your look with expert hair design",
      icon: "💇",
      delay: "0.2s",
    },
    {
      title: "Makeup Artistry",
      description: "Professional makeup for every occasion",
      icon: "💄",
      delay: "0.3s",
    },
    {
      title: "Nail Care",
      description: "Luxurious manicures and pedicures",
      icon: "💅",
      delay: "0.4s",
    },
    {
      title: "Spa & Massage",
      description: "Unwind with our therapeutic treatments",
      icon: "🌸",
      delay: "0.5s",
    },
    {
      title: "Bridal Packages",
      description: "Complete beauty solutions for your special day",
      icon: "👰",
      delay: "0.6s",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      text: "The most incredible beauty experience I've ever had. The attention to detail is unmatched.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      text: "My go-to salon for all beauty needs. Professional, luxurious, and always exceeds expectations.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      text: "From the moment I walked in, I felt pampered. The results speak for themselves!",
      rating: 5,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Luxe Beauty Studio - Premium Beauty Treatments</title>
        <meta
          name="description"
          content="Experience luxury beauty treatments with expert care and premium products"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary: #d4a574;
          --secondary: #f5e6d3;
          --accent: #c79a6b;
          --dark: #2c2c2c;
          --light: #ffffff;
          --gray: #7a7a7a;
          --bg-cream: #faf8f5;
        }

        body {
          font-family: 'Montserrat', sans-serif;
          color: var(--dark);
          background: var(--light);
          overflow-x: hidden;
          line-height: 1.6;
        }

        .hero-section {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--bg-cream) 0%, var(--secondary) 100%);
          overflow: hidden;
          padding: 2rem;
        }

        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 1;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          animation: float 20s infinite ease-in-out;
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          background: var(--primary);
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          background: var(--accent);
          bottom: 20%;
          right: 15%;
          animation-delay: 5s;
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          background: var(--primary);
          top: 60%;
          left: 70%;
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 30px) scale(0.9);
          }
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 900px;
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 1s ease forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-subtitle {
          font-size: 0.9rem;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 1.5rem;
          font-weight: 500;
          animation: fadeInUp 1s ease 0.2s forwards;
          opacity: 0;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 300;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: var(--dark);
          animation: fadeInUp 1s ease 0.4s forwards;
          opacity: 0;
        }

        .hero-title strong {
          font-weight: 600;
          color: var(--primary);
        }

        .hero-description {
          font-size: 1.1rem;
          color: var(--gray);
          margin-bottom: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          animation: fadeInUp 1s ease 0.6s forwards;
          opacity: 0;
        }

        .cta-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeInUp 1s ease 0.8s forwards;
          opacity: 0;
        }

        .btn {
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          display: inline-block;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 1px;
        }

        .btn-primary {
          background: var(--primary);
          color: var(--light);
          box-shadow: 0 10px 30px rgba(212, 165, 116, 0.3);
        }

        .btn-primary:hover {
          background: var(--accent);
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(212, 165, 116, 0.4);
        }

        .btn-secondary {
          background: transparent;
          color: var(--dark);
          border: 2px solid var(--dark);
        }

        .btn-secondary:hover {
          background: var(--dark);
          color: var(--light);
          transform: translateY(-3px);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 3rem;
          left: 50%;
          transform: translateX(-50%);
          animation: bounce 2s infinite;
          opacity: 0.6;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }

        .scroll-indicator svg {
          width: 30px;
          height: 30px;
          stroke: var(--primary);
        }

        .section {
          padding: 6rem 2rem;
          position: relative;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 300;
          text-align: center;
          margin-bottom: 1rem;
          color: var(--dark);
        }

        .section-subtitle {
          text-align: center;
          color: var(--gray);
          font-size: 1.1rem;
          margin-bottom: 4rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .services-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .service-card {
          background: var(--light);
          padding: 3rem 2rem;
          border-radius: 20px;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(212, 165, 116, 0.1);
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.8s ease forwards;
        }

        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          border-color: var(--primary);
        }

        .service-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          display: inline-block;
          transition: transform 0.4s ease;
        }

        .service-card:hover .service-icon {
          transform: scale(1.2) rotate(5deg);
        }

        .service-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 500;
          margin-bottom: 1rem;
          color: var(--dark);
        }

        .service-description {
          color: var(--gray);
          font-size: 0.95rem;
        }

        .testimonials-section {
          background: var(--bg-cream);
        }

        .testimonials-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .testimonial-card {
          background: var(--light);
          padding: 2.5rem;
          border-radius: 20px;
          border-left: 4px solid var(--primary);
          transition: all 0.4s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
        }

        .testimonial-text {
          font-style: italic;
          color: var(--gray);
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          line-height: 1.8;
        }

        .testimonial-author {
          font-weight: 600;
          color: var(--dark);
          margin-bottom: 0.5rem;
        }

        .testimonial-rating {
          color: var(--primary);
          font-size: 1.2rem;
        }

        .cta-section {
          background: linear-gradient(135deg, var(--dark) 0%, #1a1a1a 100%);
          color: var(--light);
          text-align: center;
          padding: 6rem 2rem;
        }

        .cta-section .section-title {
          color: var(--light);
        }

        .cta-section .section-subtitle {
          color: rgba(255, 255, 255, 0.7);
        }

        .features-section {
          background: var(--light);
        }

        .features-grid {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          text-align: center;
        }

        .feature-item {
          padding: 2rem;
        }

        .feature-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .feature-label {
          font-size: 1.1rem;
          color: var(--gray);
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 100svh;
            padding: 1.5rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .cta-buttons {
            flex-direction: column;
            width: 100%;
          }

          .btn {
            width: 100%;
            max-width: 300px;
          }

          .section {
            padding: 4rem 1.5rem;
          }

          .services-grid,
          .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 2rem;
          }

          .shape-1,
          .shape-2,
          .shape-3 {
            opacity: 0.05;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 0.75rem;
            letter-spacing: 2px;
          }

          .service-card,
          .testimonial-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        <div className="hero-content">
          <div className="hero-subtitle">Welcome to Luxury</div>
          <h1 className="hero-title">
            Your Beauty, <strong>Our Passion</strong>
          </h1>
          <p className="hero-description">
            Experience luxury beauty treatments with expert care and premium
            products. Where elegance meets excellence.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Book Appointment</button>
            <button className="btn btn-secondary">View Services</button>
          </div>
        </div>

        <div className="scroll-indicator">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="section services-section">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          Discover our comprehensive range of beauty treatments designed to
          enhance your natural radiance
        </p>
        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card"
              style={{ animationDelay: service.delay }}
            >
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-number">10+</div>
            <div className="feature-label">Years Experience</div>
          </div>
          <div className="feature-item">
            <div className="feature-number">5000+</div>
            <div className="feature-label">Happy Clients</div>
          </div>
          <div className="feature-item">
            <div className="feature-number">50+</div>
            <div className="feature-label">Expert Stylists</div>
          </div>
          <div className="feature-item">
            <div className="feature-number">100%</div>
            <div className="feature-label">Satisfaction</div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials-section">
        <h2 className="section-title">What Our Clients Say</h2>
        <p className="section-subtitle">
          Don't just take our word for it - hear from our satisfied clients
        </p>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">{testimonial.name}</div>
              <div className="testimonial-rating">
                {"★".repeat(testimonial.rating)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="section-title">Ready to Transform?</h2>
        <p className="section-subtitle">
          Book your appointment today and experience the luxury you deserve
        </p>
        <div className="cta-buttons">
          <button className="btn btn-primary" onClick={() => navigate("/booking")}>
            Book Appointment
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/services")}
          >
            View Services
          </button>
        </div>
      </section>
    </>
  );
};

export default Home;
