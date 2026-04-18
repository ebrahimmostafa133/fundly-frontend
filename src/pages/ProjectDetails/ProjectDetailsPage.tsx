import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { projectsApi } from "../../api/projectsApi";
import commentsApi from "../../api/commentsApi";
import ratingsApi from "../../api/ratingsApi";
import donationsApi from "../../api/donationsApi";
import type { Project } from "../../types/project.types";
import type { Comment } from "../../types/comment.types";

import { GLOBAL_STYLES } from "./utils/constants";
import {
  Breadcrumb,
  ImageSlider,
  ProjectAbout,
  FundingCard,
  CommentsSection,
  RateSection,
  ReportProjectSection,
  SimilarProjects,
  Loader,
  ErrorState,
} from "./components";

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);

  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [similarProjects, setSimilarProjects] = useState<Project[]>([]);
  const [totalFunded, setTotalFunded] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isLoggedIn = !!localStorage.getItem("access");

  /* ── Inject keyframe animations once ── */
  useEffect(() => {
    if (document.getElementById("pd-global-styles")) return;
    const tag = document.createElement("style");
    tag.id = "pd-global-styles";
    tag.textContent = GLOBAL_STYLES;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  /* ── Fetch all data on mount / id change ── */
  useEffect(() => {
    if (!projectId) return;
    fetchAll();
  }, [projectId]);

  async function fetchAll() {
    try {
      setLoading(true);
      setError("");

      const [projRes, commentsRes, ratingsRes, similarRes, donationsRes] =
        await Promise.allSettled([
          projectsApi.getProject(projectId),
          commentsApi.getProjectComments(projectId),
          ratingsApi.getProjectRatings(projectId),
          projectsApi.getSimilarProjects(projectId),
          donationsApi.getProjectDonations(projectId),
        ]);

      if (projRes.status === "fulfilled") setProject(projRes.value.data);
      else throw new Error("Could not load project");

      if (commentsRes.status === "fulfilled") setComments(commentsRes.value);

      if (ratingsRes.status === "fulfilled") {
        const rd = ratingsRes.value;
        setAvgRating(rd.average ?? rd.avg_rating ?? 0);
        setRatingCount(rd.count ?? 0);
      }

      if (similarRes.status === "fulfilled") {
        const data = similarRes.value.data;
        setSimilarProjects(Array.isArray(data) ? data : data.results ?? []);
      }

      if (donationsRes.status === "fulfilled") {
        const dd = donationsRes.value;
        setTotalFunded(dd.progress.total_donations ?? 0);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;
  if (!project) return null;

  const progress = project.target > 0
    ? Math.round((totalFunded / project.target) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb title={project.title} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="animate-fadeUp" style={{ animationDelay: "0.05s" }}>
              <ImageSlider images={project.images} title={project.title} />
            </div>

            <ProjectAbout project={project} />

            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeUp"
              style={{ animationDelay: "0.15s" }}
            >
              <CommentsSection
                projectId={projectId}
                comments={comments}
                setComments={setComments}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <FundingCard
              project={project}
              progress={progress}
              totalFunded={totalFunded}
              avgRating={avgRating}
              ratingCount={ratingCount}
              projectId={projectId}
              isLoggedIn={isLoggedIn}
              onDonated={fetchAll}
            />

            {isLoggedIn && (
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeUp"
                style={{ animationDelay: "0.1s" }}
              >
                <RateSection projectId={projectId} onRated={fetchAll} />
              </div>
            )}

            {isLoggedIn && (
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeUp"
                style={{ animationDelay: "0.15s" }}
              >
                <ReportProjectSection projectId={projectId} />
              </div>
            )}
          </div>
        </div>

        <SimilarProjects projects={similarProjects} />
      </div>
    </div>
  );
}
