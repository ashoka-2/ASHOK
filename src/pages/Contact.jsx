import React, { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { profile } from '../data/profile';
import { SectionLabel } from '../components/ui/SectionLabel';
import { Button } from '../components/ui/Button';
import { Copy, Check, Mail, Send } from 'lucide-react';
import { GithubIcon } from '../components/ui/GithubIcon';

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

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
        <div className="mb-16">
          <SectionLabel number="05" label="COMMUNICATION & INQUIRIES" />
          <h1 className="font-display text-4xl sm:text-7xl font-bold tracking-tight text-fg max-w-[950px] leading-[1.05]">
            Let's build something truly exceptional together.
          </h1>
          <p className="font-mono text-xs sm:text-sm text-fg-muted mt-4 max-w-[600px] leading-relaxed">
            Whether you are looking to build autonomous AI systems, award-winning interactive web applications, or scalable backend APIs.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Links & Fast Copy */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Primary Email Card with 1-Click Copy */}
            <div className="p-8 rounded-[28px] bg-bg-elev border border-line flex flex-col justify-between gap-6">
              <div>
                <span className="font-mono text-xs text-accent uppercase tracking-widest block mb-2">
                  PRIMARY INBOX
                </span>
                <span className="font-display text-xl sm:text-2xl font-bold text-fg break-all">
                  {profile.contact.email}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleCopyEmail}
                  variant="primary"
                  size="sm"
                  icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                >
                  {copied ? "Copied to Clipboard" : "Copy Address"}
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

            {/* GitHub Card */}
            <div className="p-8 rounded-[28px] bg-bg-surface border border-line flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-line bg-bg-elev flex items-center justify-center text-fg">
                  <GithubIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-display font-bold text-fg block">
                    GitHub Profile
                  </span>
                  <span className="font-mono text-xs text-fg-muted block mt-0.5">
                    @{profile.contact.githubUsername}
                  </span>
                </div>
              </div>

              <Button
                href={profile.contact.github}
                variant="secondary"
                size="sm"
              >
                Visit →
              </Button>
            </div>

            {/* Timezone & Location */}
            <div className="p-6 rounded-[24px] bg-bg-surface/50 border border-line text-xs font-mono text-fg-muted">
              <div className="flex justify-between items-center mb-2">
                <span className="text-fg-dim">LOCATION</span>
                <span className="text-fg font-medium">{profile.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-fg-dim">RESPONSE TIME</span>
                <span className="text-accent font-medium">Within 24 Hours</span>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 rounded-[32px] bg-bg-elev border border-line">
            <h3 className="font-display text-2xl font-bold text-fg mb-2">
              Send a direct message
            </h3>
            <p className="font-mono text-xs text-fg-muted mb-8">
              Fill in your thoughts and it will open directly in your mail client.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-mono text-xs">
              <div>
                <label className="block text-fg-dim mb-2 uppercase tracking-wider">
                  YOUR NAME
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Satoshi Nakamoto"
                  className="w-full px-5 py-3.5 rounded-[14px] bg-bg-surface border border-line text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent text-sm"
                />
              </div>

              <div>
                <label className="block text-fg-dim mb-2 uppercase tracking-wider">
                  YOUR EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="satoshi@domain.com"
                  className="w-full px-5 py-3.5 rounded-[14px] bg-bg-surface border border-line text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent text-sm"
                />
              </div>

              <div>
                <label className="block text-fg-dim mb-2 uppercase tracking-wider">
                  PROJECT SCOPE OR MESSAGE
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about what you are building..."
                  className="w-full px-5 py-3.5 rounded-[14px] bg-bg-surface border border-line text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent text-sm resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                iconRight={<Send className="w-4 h-4" />}
                className="mt-2"
              >
                Dispatch Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default Contact;
