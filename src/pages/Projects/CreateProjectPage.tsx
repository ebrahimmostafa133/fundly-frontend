import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { projectsApi } from "../../api/projectsApi";
import type { Category, Tag } from "../../types/project.types";

const formSchema = z
  .object({
    title: z.string().min(5, "title must be at least 5 characters"),
    description: z
      .string()
      .min(20, "description must be at least 20 characters"),
    category: z.string().min(1, "please select category"),
    target: z
      .string()
      .refine((val) => Number(val) >= 1, "target must be more than 0"),
    start_time: z.string().min(1, "start date is required"),
    end_time: z.string().min(1, "end date is required"),
  })
  .refine((data) => new Date(data.end_time) > new Date(data.start_time), {
    message: "end date must be after start date",
    path: ["end_time"],
  });

type Errors = {
  title?: string;
  description?: string;
  category?: string;
  target?: string;
  start_time?: string;
  end_time?: string;
};

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [cats, setCats] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [pickedTags, setPickedTags] = useState<number[]>([]);
  const [imgs, setImgs] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Errors>({});
  const [serverErr, setServerErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    target: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    projectsApi
      .getCategories()
      .then((res) => setCats(res.data))
      .catch(() => {});
    projectsApi
      .getTags()
      .then((res) => setAllTags(res.data))
      .catch(() => {});
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  }

  function handleTagClick(id: number) {
    if (pickedTags.includes(id)) {
      setPickedTags(pickedTags.filter((t) => t !== id));
    } else {
      setPickedTags([...pickedTags, id]);
    }
  }

  function handleImgChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setImgs(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  function removeImg(i: number) {
    const newList = imgs.filter((_, idx) => idx !== i);
    setImgs(newList);
    setPreviews(newList.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerErr("");

    // check form validation
    const check = formSchema.safeParse(form);
    if (!check.success) {
      const errs: Errors = {};
      check.error.issues.forEach((issue) => {
        const f = issue.path[0] as keyof Errors;
        if (!errs[f]) errs[f] = issue.message;
      });
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("target", form.target);
      fd.append("start_time", form.start_time);
      fd.append("end_time", form.end_time);
      pickedTags.forEach((id) => fd.append("tags", String(id)));
      imgs.forEach((img) => fd.append("images", img));

      const res = await projectsApi.createProject(fd);
      navigate(`/projects/${res.data.id}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      if (e.response?.data && typeof e.response.data === "object") {
        const msgs = Object.values(e.response.data as Record<string, string[]>)
          .flat()
          .join(" ");
        setServerErr(msgs || "somthing went wrong, try again");
      } else {
        setServerErr("somthing went wrong, try again");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Project</h1>
        <p className="text-gray-500 text-sm mt-1">
          fill the form to create your project
        </p>
      </div>

      {serverErr && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-xl mb-6 text-sm">
          {serverErr}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Project Title <span className="text-error-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="enter project title"
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${
              fieldErrors.title
                ? "border-error-400 bg-error-50"
                : "border-gray-200 bg-gray-50"
            }`}
          />
          {fieldErrors.title && (
            <p className="text-error-500 text-xs mt-1">{fieldErrors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Description <span className="text-error-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="describe your project..."
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none ${
              fieldErrors.description
                ? "border-error-400 bg-error-50"
                : "border-gray-200 bg-gray-50"
            }`}
          />
          {fieldErrors.description && (
            <p className="text-error-500 text-xs mt-1">
              {fieldErrors.description}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Category <span className="text-error-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${
              fieldErrors.category
                ? "border-error-400 bg-error-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <option value="">select category</option>
            {cats.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {fieldErrors.category && (
            <p className="text-error-500 text-xs mt-1">
              {fieldErrors.category}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="target"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Funding Target (EGP) <span className="text-error-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              EGP
            </span>
            <input
              id="target"
              name="target"
              type="number"
              min="1"
              value={form.target}
              onChange={handleChange}
              placeholder="10000"
              className={`w-full border rounded-xl pl-14 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                fieldErrors.target
                  ? "border-error-400 bg-error-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            />
          </div>
          {fieldErrors.target && (
            <p className="text-error-500 text-xs mt-1">{fieldErrors.target}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="start_time"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Start Date <span className="text-error-500">*</span>
            </label>
            <input
              id="start_time"
              name="start_time"
              type="datetime-local"
              value={form.start_time}
              onChange={handleChange}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                fieldErrors.start_time
                  ? "border-error-400 bg-error-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            />
            {fieldErrors.start_time && (
              <p className="text-error-500 text-xs mt-1">
                {fieldErrors.start_time}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="end_time"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              End Date <span className="text-error-500">*</span>
            </label>
            <input
              id="end_time"
              name="end_time"
              type="datetime-local"
              value={form.end_time}
              onChange={handleChange}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                fieldErrors.end_time
                  ? "border-error-400 bg-error-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            />
            {fieldErrors.end_time && (
              <p className="text-error-500 text-xs mt-1">
                {fieldErrors.end_time}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tags <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagClick(tag.id)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  pickedTags.includes(tag.id)
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"
                }`}
              >
                {tag.name}
              </button>
            ))}
            {allTags.length === 0 && (
              <p className="text-gray-400 text-sm">no tags yet</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Images <span className="font-normal text-gray-400">(max 5)</span>
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImgChange}
            className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-primary-50 file:text-primary-700"
          />
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImg(i)}
                    className="absolute top-0.5 right-0.5 bg-error-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
