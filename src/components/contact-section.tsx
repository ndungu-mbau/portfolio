"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-neutral-300" />,
      title: "Email",
      value: "john.doe@example.com",
      href: "mailto:john.doe@example.com",
    },
    {
      icon: <Phone className="h-6 w-6 text-neutral-300" />,
      title: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: <MapPin className="h-6 w-6 text-neutral-300" />,
      title: "Location",
      value: "San Francisco, CA",
      href: "#",
    },
  ];

  return (
    <section id="contact" className="bg-neutral-950 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Get In Touch
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-neutral-400">
            Have a project in mind or just want to chat? I&apos;d love to hear
            from you!
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="border-neutral-700 bg-neutral-900/50">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  Send a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="resize-none border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white py-3 font-medium text-black hover:bg-neutral-200"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="mb-6 text-2xl font-bold text-white">
                Contact Information
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={info.href}
                      className="group flex items-center space-x-4 rounded-lg border border-neutral-700 bg-neutral-900/50 p-4 transition-colors hover:border-neutral-500 dark:border-neutral-800"
                    >
                      <div className="flex-shrink-0">{info.icon}</div>
                      <div>
                        <h4 className="font-medium text-white transition-colors group-hover:text-neutral-300">
                          {info.title}
                        </h4>
                        <p className="text-sm text-neutral-400">{info.value}</p>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-600 bg-gradient-to-r from-neutral-800 to-neutral-700 p-8 text-white dark:border-neutral-800">
              <h3 className="mb-4 text-xl font-bold">
                Let&apos;s Work Together
              </h3>
              <p className="text-lg leading-relaxed text-neutral-300">
                I&apos;m always interested in new opportunities and exciting
                projects. Whether you have a specific project in mind or just
                want to explore possibilities, let&apos;s start a conversation!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
