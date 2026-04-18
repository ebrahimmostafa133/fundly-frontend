/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { projectsApi } from '../../api/projectsApi'
import type { Category, Tag } from '../../types/project.types'
import { BACKEND_URL as BACKEND } from '../../config'
import ProjectForm from './ProjectForm'
import ConfirmModal from '../../components/shared/ConfirmModal'

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

function fixDate(val: string) {
  if (!val) return ''
  try {
    const d = new Date(val)
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
  } catch {
    return val
  }
}

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [cats, setCats] = useState<Category[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [pickedTags, setPickedTags] = useState<number[]>([])
  const [oldImgs, setOldImgs] = useState<string[]>([])
  const [newImgs, setNewImgs] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<Errors>({})
  const [serverErr, setServerErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [pageErr, setPageErr] = useState('')
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelErr, setCancelErr] = useState('')
  const [projectStatus, setProjectStatus] = useState('')
  const [projectProgress, setProjectProgress] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    target: '',
    start_time: '',
    end_time: '',
  })

  // load project data
  useEffect(() => {
    if (!id) return
    Promise.all([
      projectsApi.getProject(Number(id)),
      projectsApi.getCategories(),
      projectsApi.getTags(),
    ])
      .then(([projRes, catRes, tagRes]) => {
        const p = projRes.data
        setCats(catRes.data)
        setAllTags(tagRes.data)
        setPickedTags(p.tags?.map((t: any) => t.id) ?? [])
        setProjectStatus(p.status || 'active')
        setProjectProgress(p.progress || 0)

        // fix image urls because django return relative path
        setOldImgs(
          p.images?.map((img: any) =>
            img.image.startsWith('http') ? img.image : `${BACKEND}${img.image}`
          ) ?? []
        )

        setForm({
          title: p.title || '',
          description: p.description || '',
          category: String(p.category?.id ?? ''),
          target: String(p.target ?? ''),
          start_time: fixDate(p.start_time),
          end_time: fixDate(p.end_time),
        })
      })
      .catch(() => setPageErr('cant load this project'))
      .finally(() => setPageLoading(false))
  }, [id])

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined })
  }

  function handleTagClick(tagId: number) {
    if (pickedTags.includes(tagId)) {
      setPickedTags(pickedTags.filter((t) => t !== tagId))
    } else {
      setPickedTags([...pickedTags, tagId])
    }
  }

  function handleImgChange(e: any) {
    const files = Array.from(e.target.files || []).slice(0, 5) as File[]
    setNewImgs(files)
    setPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  function removeImg(i: number) {
    const updated = newImgs.filter((_, idx) => idx !== i)
    setNewImgs(updated)
    setPreviews(updated.map((f) => URL.createObjectURL(f)))
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
      pickedTags.forEach((tagId) => fd.append('tags', String(tagId)))
      newImgs.forEach((img) => fd.append('images', img))

      await projectsApi.updateProject(Number(id), fd)
      navigate(`/projects/${id}`)
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

  async function confirmCancel() {
    setCancelLoading(true)
    setCancelErr('')
    try {
      await projectsApi.cancelProject(Number(id))
      setProjectStatus('cancelled')
      setShowModal(false)
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'fail to cancel project'
      setCancelErr(msg)
      setShowModal(false)
    } finally {
      setCancelLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
      </div>
    )
  }

  if (pageErr) {
    return (
      <div className="text-center py-24">
        <p className="text-error-500 font-medium">{pageErr}</p>
        <a href="/projects" className="mt-4 inline-block text-primary-500 text-sm underline">
          Back to Projects
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit <span className="text-primary-500">Project</span></h1>
          <p className="text-gray-500 text-sm mt-1">update the info of your project</p>
        </div>
        {projectStatus === 'cancelled' && (
          <span className="px-3 py-1 bg-error-100 text-error-700 text-xs font-bold rounded-full uppercase tracking-wider">
            Cancelled
          </span>
        )}
      </div>

      <ProjectForm
        form={form}
        fieldErrors={fieldErrors}
        cats={cats}
        allTags={allTags}
        pickedTags={pickedTags}
        previews={previews}
        oldImgs={oldImgs}
        loading={loading || projectStatus === 'cancelled'}
        submitText="Save Changes"
        serverErr={serverErr}
        onChangeField={handleChange}
        onTagClick={handleTagClick}
        onImgChange={handleImgChange}
        onRemoveImg={removeImg}
        onSubmit={handleSubmit}
        onBack={() => navigate(`/projects/${id}`)}
      />

      {/* danger zone - only show if project is still active */}
      {projectStatus !== 'cancelled' ? (
        <div className="mt-12 pt-8 border-t border-error-200">
          <h2 className="text-xl font-bold text-error-600 mb-2">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">
            if you cancel this project it will not accept donations anymore. projects can only be cancelled if less than 25% funded.
          </p>
          {cancelErr && <p className="text-error-500 text-sm mb-3">{cancelErr}</p>}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            disabled={projectProgress >= 25}
            className="px-4 py-2 bg-error-50 hover:bg-error-100 text-error-600 font-semibold rounded-xl border border-error-200 transition-colors disabled:opacity-50"
          >
            Cancel This Project
          </button>
          {projectProgress >= 25 && (
            <p className="text-xs text-error-500 mt-2">cannot cancel: project reached {projectProgress}% (limit is 25%)</p>
          )}
        </div>
      ) : (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl text-sm font-medium text-center">
            this project is cancelled and cant be edited anymore
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmCancel}
        loading={cancelLoading}
        title="Cancel Project"
        message="are you sure you want to cancel?"
        confirmText="yes, cancel it"
        cancelText="no, go back"
        isDanger={true}
      />

    </div>
  )
}
