/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Category, Tag } from '../../types/project.types'

type Props = {
  form: any
  fieldErrors: any
  cats: Category[]
  allTags: Tag[]
  pickedTags: number[]
  previews: string[]
  oldImgs?: string[]
  loading: boolean
  submitText: string
  onChangeField: (e: any) => void
  onTagClick: (id: number) => void
  onImgChange: (e: any) => void
  onRemoveImg: (i: number) => void
  onSubmit: (e: any) => void
  onBack: () => void
  serverErr: string
}

export default function ProjectForm({
  form,
  fieldErrors,
  cats,
  allTags,
  pickedTags,
  previews,
  oldImgs,
  loading,
  submitText,
  onChangeField,
  onTagClick,
  onImgChange,
  onRemoveImg,
  onSubmit,
  onBack,
  serverErr,
}: Props) {

  const inputClass = (err?: string) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${err ? 'border-error-400 bg-error-50' : 'border-gray-200 bg-gray-50'}`

  return (
    <div>
      {serverErr && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-xl mb-6 text-sm">
          {serverErr}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-6">

        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
            Project Title <span className="text-error-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={onChangeField}
            placeholder="enter project title"
            className={inputClass(fieldErrors.title)}
          />
          {fieldErrors.title && <p className="text-error-500 text-xs mt-1">{fieldErrors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
            Description <span className="text-error-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={onChangeField}
            placeholder="describe your project..."
            className={inputClass(fieldErrors.description) + ' resize-none'}
          />
          {fieldErrors.description && <p className="text-error-500 text-xs mt-1">{fieldErrors.description}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">
            Category <span className="text-error-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={onChangeField}
            className={inputClass(fieldErrors.category)}
          >
            <option value="">select category</option>
            {cats.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {fieldErrors.category && <p className="text-error-500 text-xs mt-1">{fieldErrors.category}</p>}
        </div>

        <div>
          <label htmlFor="target" className="block text-sm font-semibold text-gray-700 mb-1">
            Funding Target (EGP) <span className="text-error-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">EGP</span>
            <input
              id="target"
              name="target"
              type="number"
              min="1"
              value={form.target}
              onChange={onChangeField}
              placeholder="10000"
              className={`w-full border rounded-xl pl-14 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${fieldErrors.target ? 'border-error-400 bg-error-50' : 'border-gray-200 bg-gray-50'}`}
            />
          </div>
          {fieldErrors.target && <p className="text-error-500 text-xs mt-1">{fieldErrors.target}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_time" className="block text-sm font-semibold text-gray-700 mb-1">
              Start Date <span className="text-error-500">*</span>
            </label>
            <input
              id="start_time"
              name="start_time"
              type="datetime-local"
              value={form.start_time}
              onChange={onChangeField}
              className={inputClass(fieldErrors.start_time)}
            />
            {fieldErrors.start_time && <p className="text-error-500 text-xs mt-1">{fieldErrors.start_time}</p>}
          </div>
          <div>
            <label htmlFor="end_time" className="block text-sm font-semibold text-gray-700 mb-1">
              End Date <span className="text-error-500">*</span>
            </label>
            <input
              id="end_time"
              name="end_time"
              type="datetime-local"
              value={form.end_time}
              onChange={onChangeField}
              className={inputClass(fieldErrors.end_time)}
            />
            {fieldErrors.end_time && <p className="text-error-500 text-xs mt-1">{fieldErrors.end_time}</p>}
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
                onClick={() => onTagClick(tag.id)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${pickedTags.includes(tag.id) ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'}`}
              >
                {tag.name}
              </button>
            ))}
            {allTags.length === 0 && <p className="text-gray-400 text-sm">no tags yet</p>}
          </div>
        </div>

        {/* show old images in edit mode */}
        {oldImgs && oldImgs.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Images</label>
            <div className="flex flex-wrap gap-3">
              {oldImgs.map((src, i) => (
                <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Images <span className="font-normal text-gray-400">{oldImgs ? '(this will replace old ones)' : '(max 5)'}</span>
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onImgChange}
            className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-primary-50 file:text-primary-700"
          />
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {previews.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onRemoveImg(i)}
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
            onClick={onBack}
            className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'wait...' : submitText}
          </button>
        </div>

      </form>
    </div>
  )
}
