/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { projectsApi } from '../../api/projectsApi'
import type { Category, Tag } from '../../types/project.types'
import ProjectForm from './ProjectForm'

// validation rules
const formSchema = z.object({
  title: z.string().min(5, 'title must be at least 5 characters'),
  description: z.string().min(20, 'description must be at least 20 characters'),
  category: z.string().min(1, 'please select category'),
  target: z.string().refine((val) => Number(val) >= 1, 'target must be more than 0'),
  start_time: z.string().min(1, 'start date is required'),
  end_time: z.string().min(1, 'end date is required'),
}).refine(
  (data) => new Date(data.end_time) > new Date(data.start_time),
  { message: 'end date must be after start date', path: ['end_time'] }
)

type Errors = {
  title?: string
  description?: string
  category?: string
  target?: string
  start_time?: string
  end_time?: string
}

export default function CreateProjectPage() {
  const navigate = useNavigate()

  const [cats, setCats] = useState<Category[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [pickedTags, setPickedTags] = useState<number[]>([])
  const [imgs, setImgs] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<Errors>({})
  const [serverErr, setServerErr] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    target: '',
    start_time: '',
    end_time: '',
  })

  useEffect(() => {
    projectsApi.getCategories().then((res) => setCats(res.data)).catch(() => {})
    projectsApi.getTags().then((res) => setAllTags(res.data)).catch(() => {})
  }, [])

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined })
  }

  function handleTagClick(id: number) {
    if (pickedTags.includes(id)) {
      setPickedTags(pickedTags.filter((t) => t !== id))
    } else {
      setPickedTags([...pickedTags, id])
    }
  }

  function handleImgChange(e: any) {
    const files = Array.from(e.target.files || []).slice(0, 5) as File[]
    setImgs(files)
    setPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  function removeImg(i: number) {
    const newList = imgs.filter((_, idx) => idx !== i)
    setImgs(newList)
    setPreviews(newList.map((f) => URL.createObjectURL(f)))
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    setServerErr('')

    const check = formSchema.safeParse(form)
    if (!check.success) {
      const errs: Errors = {}
      check.error.issues.forEach((issue) => {
        const f = issue.path[0] as keyof Errors
        if (!errs[f]) errs[f] = issue.message
      })
      setFieldErrors(errs)
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('category', form.category)
      fd.append('target', form.target)
      fd.append('start_time', form.start_time)
      fd.append('end_time', form.end_time)
      pickedTags.forEach((id) => fd.append('tags', String(id)))
      imgs.forEach((img) => fd.append('images', img))

      const res = await projectsApi.createProject(fd)
      navigate(`/projects/${res.data.id}`)
    } catch (err: any) {
      if (err.response?.data && typeof err.response.data === 'object') {
        const msgs = Object.values(err.response.data as Record<string, string[]>).flat().join(' ')
        setServerErr(msgs || 'somthing went wrong, try again')
      } else {
        setServerErr('somthing went wrong, try again')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create <span className="text-primary-500">Project</span></h1>
        <p className="text-gray-500 text-sm mt-1">fill the form to create your project</p>
      </div>

      <ProjectForm
        form={form}
        fieldErrors={fieldErrors}
        cats={cats}
        allTags={allTags}
        pickedTags={pickedTags}
        previews={previews}
        loading={loading}
        submitText="Create Project"
        serverErr={serverErr}
        onChangeField={handleChange}
        onTagClick={handleTagClick}
        onImgChange={handleImgChange}
        onRemoveImg={removeImg}
        onSubmit={handleSubmit}
        onBack={() => navigate('/projects')}
      />
    </div>
  )
}
