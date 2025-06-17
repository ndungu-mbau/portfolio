"use client";

import { motion } from "framer-motion";
import { Badge } from "~/components/ui/badge";

export default function Skills() {
  const skillCategories = [
    {
      title: "Frontend",
      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "Vue.js",
      ],
    },
    {
      title: "Backend",
      skills: [
        "Node.js",
        "Express",
        "Python",
        "PostgreSQL",
        "MongoDB",
        "Redis",
      ],
    },
    {
      title: "Tools & Others",
      skills: ["Git", "Docker", "AWS", "Figma", "Jest", "Cypress"],
    },
  ];

  return (
    <section id="skills" className="bg-neutral-950 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Skills & Technologies
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-neutral-400">
            Here are the technologies and tools I work with to bring ideas to
            life
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-neutral-700 bg-neutral-900/50 p-8 dark:border-neutral-800"
            >
              <h3 className="mb-6 text-center text-2xl font-bold text-white">
                {category.title}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: categoryIndex * 0.2 + skillIndex * 0.1,
                    }}
                    viewport={{ once: true }}
                  >
                    <Badge
                      variant="secondary"
                      className="border-neutral-600 bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-200 transition-colors hover:bg-neutral-700 dark:border-neutral-800 dark:bg-neutral-700"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
