"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Headphones, Handshake, Clock, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const { t } = useLanguage();
  const contact = t.staticParams.contact;

  const contactCards = [
    {
      icon: Mail,
      title: contact.generalTitle,
      desc: contact.generalDesc,
      email: contact.generalEmail,
      color: "blue",
    },
    {
      icon: Headphones,
      title: contact.supportTitle,
      desc: contact.supportDesc,
      email: contact.supportEmail,
      color: "emerald",
    },
    {
      icon: Handshake,
      title: contact.partnerTitle,
      desc: contact.partnerDesc,
      email: contact.partnerEmail,
      color: "purple",
    },
  ];

  const colorMap: Record<
    string,
    {
      bg: string;
      text: string;
      border: string;
      btnBg: string;
      btnHover: string;
    }
  > = {
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
      btnBg: "bg-blue-500/20",
      btnHover: "hover:bg-blue-500/30",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      btnBg: "bg-emerald-500/20",
      btnHover: "hover:bg-emerald-500/30",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/20",
      btnBg: "bg-purple-500/20",
      btnHover: "hover:bg-purple-500/30",
    },
  };

  return (
    <div className="container mx-auto px-4 py-12 text-white">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-green-500/10 text-green-400">
            <Mail className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">{contact.title}</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {contact.subtitle}
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {contactCards.map((card, index) => {
            const colors = colorMap[card.color];
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-xl bg-navy-900/50 border ${colors.border} backdrop-blur-sm flex flex-col`}
              >
                <div
                  className={`inline-flex p-3 rounded-full ${colors.bg} ${colors.text} mb-4 self-start`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>
                  {card.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 flex-1">{card.desc}</p>
                <a
                  href={`mailto:${card.email}`}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg ${colors.btnBg} ${colors.text} ${colors.btnHover} transition-colors text-sm font-medium`}
                >
                  <Mail className="w-4 h-4" />
                  {card.email}
                </a>
              </div>
            );
          })}
        </div>

        {/* Response Time */}
        <div className="p-6 rounded-xl bg-navy-900/50 border border-white/10 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400 flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gold-400 mb-2">
                {contact.responseTitle}
              </h3>
              <p className="text-gray-300 mb-1">{contact.responseDesc}</p>
              <p className="text-gray-400 text-sm">{contact.workingHours}</p>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-400 mb-1">
                {contact.noteTitle}
              </p>
              <p className="text-sm text-gray-400">{contact.noteDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
