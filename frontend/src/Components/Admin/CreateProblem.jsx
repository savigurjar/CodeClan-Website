import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import axiosClient from "../../utils/axiosClient";

/* ------------------ SCHEMA ------------------ */
const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.array(
    z.enum([
      "array","string","linkedList","stack","queue","hashing",
      "twoPointers","slidingWindow","binarySearch","recursion",
      "backtracking","greedy","dynamicProgramming","tree",
      "binaryTree","bst","graph","heap","trie","bitManipulation",
      "math","sorting"
    ])
  ).min(1, "Select at least one tag"),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().min(1, "Explanation is required"),
    })
  ).min(1, "At least one visible test case required"),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
    })
  ).min(1, "At least one hidden test case required"),
  startCode: z.array(
    z.object({
      language: z.string(),
      initialCode: z.string().min(1, "Initial code is required"),
    })
  ),
  referenceSolution: z.array(
    z.object({
      language: z.string(),
      completeCode: z.string().min(1, "Complete code is required"),
    })
  ),
  constraints: z.array(z.string().min(1)).min(1, "At least one constraint required"),
  examples: z.array(
    z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().min(1, "Explanation is required"),
    })
  ).min(1, "At least one example required"),
  complexity: z.object({
    time: z.string().min(1, "Time complexity is required"),
    space: z.string().min(1, "Space complexity is required"),
  }),
  companies: z.array(z.string()),
  isPremium: z.boolean(),
  points: z.number().min(0, "Points must be >= 0"),
});

/* ------------------ COMPONENT ------------------ */
const CreateProblem = () => {
  const navigate = useNavigate();

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "easy",
      tags: ["array"],
      visibleTestCases: [{ input: "", output: "", explanation: "" }],
      hiddenTestCases: [{ input: "", output: "" }],
      startCode: [
        { language: "C++", initialCode: "// C++ starter code" },
        { language: "C", initialCode: "// C starter code" },
        { language: "Java", initialCode: "// Java starter code" },
        { language: "JavaScript", initialCode: "// JS starter code" },
        { language: "Python", initialCode: "# Python starter code" },
      ],
      referenceSolution: [
        { language: "C++", completeCode: "// C++ reference solution" },
        { language: "C", completeCode: "// C reference solution" },
        { language: "Java", completeCode: "// Java reference solution" },
        { language: "JavaScript", completeCode: "// JS reference solution" },
        { language: "Python", completeCode: "# Python reference solution" },
      ],
      constraints: [""],
      examples: [{ input: "", output: "", explanation: "" }],
      complexity: { time: "", space: "" },
      companies: [],
      isPremium: false,
      points: 100,
    },
  });

  const { fields: visible, append: addVisible, remove: removeVisible } = useFieldArray({ control, name: "visibleTestCases" });
  const { fields: hidden, append: addHidden, remove: removeHidden } = useFieldArray({ control, name: "hiddenTestCases" });
  const { fields: constraints, append: appendConstraint, remove: removeConstraint } = useFieldArray({ control, name: "constraints" });
  const { fields: examples, append: appendExample, remove: removeExample } = useFieldArray({ control, name: "examples" });

  const companyOptions = ["Amazon", "Google", "Microsoft", "Facebook", "Apple"];

  const onSubmit = async (data) => {
    try {
      console.log("Submitting data:", data);
      await axiosClient.post("/problem/create", data);
      alert("Problem created successfully!");
      navigate("/admin");
    } catch (err) {
      console.error("Error creating problem:", err.response?.data || err.message);
      alert("Problem creation failed. Check console for details.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <h1 className="text-4xl font-extrabold text-center text-primary-content">Create New Problem</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* ---------------- BASIC INFO ---------------- */}
        <div className="card bg-base-100 shadow-xl rounded-lg p-8 space-y-5">
          <h2 className="text-2xl font-bold mb-4 text-neutral-content">Basic Information</h2>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Title</span></label>
            <input {...register("title")} className={`input input-bordered w-full ${errors.title ? "input-error" : ""}`} />
            {errors.title && <span className="text-error text-sm">{errors.title.message}</span>}
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Description</span></label>
            <textarea {...register("description")} className={`textarea textarea-bordered w-full h-32 ${errors.description ? "textarea-error" : ""}`} />
            {errors.description && <span className="text-error text-sm">{errors.description.message}</span>}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Difficulty</span></label>
              <select {...register("difficulty")} className={`select select-bordered w-full ${errors.difficulty ? "select-error" : ""}`}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="label"><span className="label-text font-medium">Tags</span></label>
              <div className="flex flex-wrap gap-2">
                {[
                  "array","string","linkedList","stack","queue","hashing",
                  "twoPointers","slidingWindow","binarySearch","recursion",
                  "backtracking","greedy","dynamicProgramming","tree",
                  "binaryTree","bst","graph","heap","trie","bitManipulation",
                  "math","sorting"
                ].map(tag => (
                  <label key={tag} className="flex items-center gap-1">
                    <input type="checkbox" value={tag} {...register("tags")} /> {tag}
                  </label>
                ))}
              </div>
              {errors.tags && <span className="text-error text-sm">{errors.tags.message}</span>}
            </div>
          </div>
        </div>

        {/* ---------------- TEST CASES ---------------- */}
        <div className="card bg-base-100 shadow-xl rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold mb-4 text-neutral-content">Test Cases</h2>

          {/* Visible */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Visible Test Cases</span>
              <button type="button" className="btn btn-sm btn-outline btn-primary" onClick={() => addVisible({ input: "", output: "", explanation: "" })}>+ Add</button>
            </div>
            {visible.map((field, i) => (
              <div key={field.id} className="border p-4 rounded-lg bg-base-200 mb-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span>Case #{i + 1}</span>
                  <button type="button" className="btn btn-xs btn-error btn-square" onClick={() => removeVisible(i)}>✕</button>
                </div>
                <input {...register(`visibleTestCases.${i}.input`)} placeholder="Input" className="input input-bordered w-full" />
                <input {...register(`visibleTestCases.${i}.output`)} placeholder="Output" className="input input-bordered w-full" />
                <textarea {...register(`visibleTestCases.${i}.explanation`)} placeholder="Explanation" className="textarea textarea-bordered w-full h-20" />
              </div>
            ))}
          </div>

          {/* Hidden */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Hidden Test Cases</span>
              <button type="button" className="btn btn-sm btn-outline btn-primary" onClick={() => addHidden({ input: "", output: "" })}>+ Add</button>
            </div>
            {hidden.map((field, i) => (
              <div key={field.id} className="border p-4 rounded-lg bg-base-200 mb-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span>Case #{i + 1}</span>
                  <button type="button" className="btn btn-xs btn-error btn-square" onClick={() => removeHidden(i)}>✕</button>
                </div>
                <input {...register(`hiddenTestCases.${i}.input`)} placeholder="Input" className="input input-bordered w-full" />
                <input {...register(`hiddenTestCases.${i}.output`)} placeholder="Output" className="input input-bordered w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- CODE TEMPLATES ---------------- */}
        <div className="card bg-base-100 shadow-xl rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold mb-4 text-neutral-content">Code Templates</h2>
          {["C++", "C", "Java", "JavaScript", "Python"].map((lang, i) => (
            <div key={lang} className="bg-base-200 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold">{lang}</h3>
              <textarea {...register(`startCode.${i}.initialCode`)} placeholder="Starter Code" className="w-full font-mono h-28 p-2 rounded" />
              <textarea {...register(`referenceSolution.${i}.completeCode`)} placeholder="Reference Solution" className="w-full font-mono h-28 p-2 rounded" />
            </div>
          ))}
        </div>

        {/* ---------------- ADDITIONAL INFO ---------------- */}
        <div className="card bg-base-100 shadow-xl rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold mb-4 text-neutral-content">Additional Info</h2>

          {/* Constraints */}
          <div>
            <label className="font-medium">Constraints</label>
            {constraints.map((c, i) => (
              <div key={c.id} className="flex gap-2 mb-2">
                <input {...register(`constraints.${i}`)} placeholder="Constraint" className="input input-bordered w-full" />
                <button type="button" className="btn btn-xs btn-error" onClick={() => removeConstraint(i)}>✕</button>
              </div>
            ))}
            <button type="button" className="btn btn-sm" onClick={() => appendConstraint("")}>+ Add Constraint</button>
          </div>

          {/* Examples */}
          <div>
            <label className="font-medium">Examples</label>
            {examples.map((ex, i) => (
              <div key={ex.id} className="grid md:grid-cols-3 gap-2 mb-2">
                <input {...register(`examples.${i}.input`)} placeholder="Input" className="input input-bordered w-full" />
                <input {...register(`examples.${i}.output`)} placeholder="Output" className="input input-bordered w-full" />
                <input {...register(`examples.${i}.explanation`)} placeholder="Explanation" className="input input-bordered w-full" />
              </div>
            ))}
            <button type="button" className="btn btn-sm" onClick={() => appendExample({ input: "", output: "", explanation: "" })}>+ Add Example</button>
          </div>

          {/* Complexity */}
          <div className="grid md:grid-cols-2 gap-4">
            <input {...register("complexity.time")} placeholder="Time Complexity" className="input input-bordered w-full" />
            <input {...register("complexity.space")} placeholder="Space Complexity" className="input input-bordered w-full" />
          </div>

          {/* Points & Premium */}
          <div className="flex items-center gap-4">
            <input type="number" {...register("points")} placeholder="Points" className="input input-bordered w-32" />
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("isPremium")} /> Premium Problem
            </label>
          </div>

          {/* Companies */}
          <div className="flex flex-wrap gap-4">
            {companyOptions.map(c => (
              <label key={c} className="flex items-center gap-2">
                <input type="checkbox" value={c} {...register("companies")} /> {c}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-full">🚀 Create Problem</button>
      </form>
    </div>
  );
};

export default CreateProblem;
