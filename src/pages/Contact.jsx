import React, { useState } from "react";
import { PageShell } from "../components/layout/PageShell";
import { profile } from "../data/profile";
import { SectionLabel } from "../components/ui/SectionLabel";
import { Button } from "../components/ui/Button";
import { Copy, Check, Mail, Send, ChevronRight, Clock, MapPin } from "lucide-react";
import { GithubIcon } from "../components/ui/GithubIcon";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${profile.contact.email}?subject=Project Inquiry from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message + "\n\nFrom: " + formData.email)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <PageShell>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-20 py-12 select-none">
        {/* Header */}
        <div className="mb-14">
          <SectionLabel number="01" label="COMMUNICATION & INQUIRIES" />
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-fg max-w-[950px] leading-[1.05]">
            Let's build something truly exceptional together.
          </h1>
          <p className="font-sans text-sm sm:text-base text-fg-muted mt-4 max-w-[620px] leading-relaxed">
            Whether you are looking to build autonomous AI systems,
            award-winning interactive web applications, or high-throughput microservices.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Links & Minimal AI-App Grouped Rows */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Primary Email Card with 1-Click Copy */}
            <div className="p-7 sm:p-8 rounded-[28px] bg-bg-elev border border-line flex flex-col justify-between gap-6">
              <div>
                <span className="font-mono text-xs text-accent uppercase tracking-widest block mb-2 font-semibold">
                  PRIMARY INBOX
                </span>
                <span className="font-display text-xl sm:text-2xl font-bold text-fg break-all">
                  {profile.contact.email}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleCopyEmail}
                  variant="primary"
                  size="sm"
                  icon={
                    copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )
                  }
                >
                  {copied ? "Copied" : "Copy Email"}
                </Button>
                <Button
                  href={`mailto:${profile.contact.email}`}
                  variant="secondary"
                  size="sm"
                  icon={<Mail className="w-4 h-4" />}
                >
                  Open Mail App
                </Button>
              </div>
            </div>

            {/* Grouped Information List Rows (Minimal AI Pattern) */}
            <div className="grouped-list">
              <a
                href={profile.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="grouped-row cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-bg-surface-raised flex items-center justify-center text-fg">
                    <GithubIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-fg block">GitHub Profile</span>
                    <span className="text-xs font-mono text-fg-muted block">@{profile.contact.githubUsername}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-fg-dim" />
              </a>

              <div className="grouped-row">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-bg-surface-raised flex items-center justify-center text-accent">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-fg block">Location</span>
                    <span className="text-xs font-mono text-fg-muted block">{profile.location}</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-fg-dim">Remote Ready</span>
              </div>

              <div className="grouped-row">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-bg-surface-raised flex items-center justify-center text-accent">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-fg block">Response Window</span>
                    <span className="text-xs font-mono text-fg-muted block">Within 24 Hours</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-accent font-semibold">Active</span>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Composer */}
          <div className="lg:col-span-7 p-7 sm:p-10 rounded-[28px] bg-bg-elev border border-line">
            <h3 className="font-display text-2xl font-bold text-fg mb-2">
              Send a direct dispatch
            </h3>
            <p className="font-sans text-xs sm:text-sm text-fg-muted mb-8 leading-relaxed">
              Fill in your project goals and requirements. It will trigger a ready-to-send draft directly in your preferred mail client.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 text-sm"
            >
              <div>
                <label className="block text-xs font-mono text-fg-dim mb-2 uppercase tracking-wider">
                  YOUR NAME
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Ashok Kumar"
                  className="w-full px-5 py-3.5 rounded-full bg-bg-surface border border-line text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-fg-dim mb-2 uppercase tracking-wider">
                  YOUR EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="contact@example.com"
                  className="w-full px-5 py-3.5 rounded-full bg-bg-surface border border-line text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-fg-dim mb-2 uppercase tracking-wider">
                  PROJECT SCOPE OR INQUIRY
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Describe your vision, timeline, and key requirements..."
                  className="w-full px-5 py-3.5 rounded-[20px] bg-bg-surface border border-line text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent text-sm resize-none transition-colors"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  iconRight={<Send className="w-4 h-4" />}
                >
                  Send Message Draft
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default Contact;
