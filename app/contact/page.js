"use client";

import SiteHeader from "../components/SiteHeader";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", location: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="page">
      <SiteHeader active="contact" />

      <section className="contact-section">
        <h1>contact us.</h1>

        <div className="contact-grid">
          <div className="contact-card">
            <p className="contact-label">for membership support</p>
            <p>text us by clicking below.</p>
            <a href="sms:+12292223978" className="contact-link">
              +1 (229) 222-3978
            </a>
          </div>

          <div className="contact-card">
            <p className="contact-label">
              venue owner or event curator?
            </p>
            <p>message us by clicking below.</p>
            <a href="mailto:partners@wherewelanding.com" className="contact-link">
              become a partner
            </a>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <p className="contact-label">for all other inquiries, fill out the form below.</p>

          <form onSubmit={handleSubmit} className="contact-form">
            <input
              type="text"
              name="name"
              placeholder="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="location"
              placeholder="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              required
            />
            <button type="submit" className="btn-minimal">
              send message
            </button>
          </form>
        </div>
      </section>

      <footer className="footer">
        © 2026 where we landing
      </footer>
    </div>
  );
}
