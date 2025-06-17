"use client";

import type React from "react";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import { TiptapEditor } from "~/components/ui/editor";

export default function NewProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    image: "",
    liveUrl: "",
    githubUrl: "",
    status: "Development",
    featured: false,
    duration: "",
    team: "",
    year: new Date().getFullYear().toString(),
  });
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [newTech, setNewTech] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [challenges, setChallenges] = useState<string[]>([]);
  const [newChallenge, setNewChallenge] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleLongDescriptionChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      longDescription: content,
    }));
  };

  const addTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      setTechnologies([...technologies, newTech.trim()]);
      setNewTech("");
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addChallenge = () => {
    if (newChallenge.trim()) {
      setChallenges([...challenges, newChallenge.trim()]);
      setNewChallenge("");
    }
  };

  const removeChallenge = (index: number) => {
    setChallenges(challenges.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save to a database
    console.log("Project data:", {
      ...formData,
      technologies,
      features,
      challenges,
    });
    alert("Project created successfully!");
    router.push("/admin/projects");
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-neutral-400 hover:text-white"
              asChild
            >
              <Link href="/admin/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Add New Project</h1>
              <p className="text-neutral-400">
                Create a new project for your portfolio
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className="border-neutral-700 bg-neutral-900/50">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                      Project Title
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter project title"
                      className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-neutral-600 bg-neutral-800/50 px-3 py-2 text-white"
                    >
                      <option value="Development">Development</option>
                      <option value="Beta">Beta</option>
                      <option value="Live">Live</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    Short Description
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the project"
                    rows={3}
                    className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    Long Description
                  </label>
                  <TiptapEditor
                    content={formData.longDescription}
                    onChange={handleLongDescriptionChange}
                    placeholder="Write a detailed description of your project. You can use formatting, lists, links, and more..."
                    className="min-h-[300px]"
                  />
                  <p className="mt-2 text-xs text-neutral-500">
                    Use the toolbar to format your text. You can add bold,
                    italic, lists, quotes, and links.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-neutral-300">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="rounded border-neutral-600 bg-neutral-800"
                    />
                    Featured Project
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card className="border-neutral-700 bg-neutral-900/50">
              <CardHeader>
                <CardTitle className="text-white">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                      Year
                    </label>
                    <Input
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="2024"
                      className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                      Duration
                    </label>
                    <Input
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="3 months"
                      className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                      Team Size
                    </label>
                    <Input
                      name="team"
                      value={formData.team}
                      onChange={handleInputChange}
                      placeholder="Solo / 3 developers"
                      className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                      Live URL
                    </label>
                    <Input
                      name="liveUrl"
                      value={formData.liveUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                      GitHub URL
                    </label>
                    <Input
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username/repo"
                      className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    Project Image URL
                  </label>
                  <Input
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Technologies */}
            <Card className="border-neutral-700 bg-neutral-900/50">
              <CardHeader>
                <CardTitle className="text-white">Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="Add technology"
                    className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTechnology())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addTechnology}
                    className="bg-white text-black hover:bg-neutral-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="border-neutral-600 bg-neutral-800 pr-1 text-neutral-200"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="ml-2 hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="border-neutral-700 bg-neutral-900/50">
              <CardHeader>
                <CardTitle className="text-white">Key Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add feature"
                    className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addFeature())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addFeature}
                    className="bg-white text-black hover:bg-neutral-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded border border-neutral-700 bg-neutral-800/30 p-2"
                    >
                      <span className="flex-1 text-neutral-300">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Challenges */}
            <Card className="border-neutral-700 bg-neutral-900/50">
              <CardHeader>
                <CardTitle className="text-white">
                  Technical Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newChallenge}
                    onChange={(e) => setNewChallenge(e.target.value)}
                    placeholder="Add challenge"
                    className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addChallenge())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addChallenge}
                    className="bg-white text-black hover:bg-neutral-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {challenges.map((challenge, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded border border-neutral-700 bg-neutral-800/30 p-2"
                    >
                      <span className="flex-1 text-neutral-300">
                        {challenge}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeChallenge(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="border-neutral-600 text-neutral-300"
                asChild
              >
                <Link href="/admin/projects">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="bg-white text-black hover:bg-neutral-200"
              >
                <Save className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
