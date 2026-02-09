"use client";

import { useMemo, useState } from "react";
import { foundationalChecklist, intermediateLessons } from "@/lib/curriculum";
import { LearnerProfile, recommendPath } from "@/lib/adaptive";

interface CoachResult {
  headline?: string;
  summary?: string;
  nextStep?: string;
}

const initialProfile: LearnerProfile = {
  confidence: 4,
  valuationSkill: 3,
  behaviorDiscipline: 6,
};

export function Dashboard() {
  const [profile, setProfile] = useState<LearnerProfile>(initialProfile);
  const [selectedLessonId, setSelectedLessonId] = useState(intermediateLessons[0]?.id ?? "");
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({});
  const [coach, setCoach] = useState<CoachResult | null>(null);
  const [loadingCoach, setLoadingCoach] = useState(false);

  const path = useMemo(() => recommendPath(profile), [profile]);

  const selectedLesson =
    intermediateLessons.find((lesson) => lesson.id === selectedLessonId) ?? intermediateLessons[0];

  const completedCount = selectedLesson.activities.filter((_, index) => {
    const key = `${selectedLesson.id}:${index}`;
    return completedActivities[key];
  }).length;

  const lessonProgress = Math.round((completedCount / selectedLesson.activities.length) * 100);

  const courseProgress = Math.round(
    (Object.values(completedActivities).filter(Boolean).length /
      intermediateLessons.reduce((total, lesson) => total + lesson.activities.length, 0)) *
      100
  );

  function updateProfile(field: keyof LearnerProfile, value: number) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function toggleActivity(lessonId: string, activityIndex: number) {
    const key = `${lessonId}:${activityIndex}`;
    setCompletedActivities((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function fetchCoach() {
    setLoadingCoach(true);
    setCoach(null);

    try {
      const nextLessons = path
        .slice(0, 4)
        .map((id) => intermediateLessons.find((entry) => entry.id === id)?.title)
        .filter(Boolean);

      const response = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learnerProfile: profile, nextLessons }),
      });

      if (!response.ok) return;

      const data = await response.json();
      setCoach(data);
    } catch {
      // Keep UI usable when AI endpoint is unavailable.
    } finally {
      setLoadingCoach(false);
    }
  }

  return (
    <main className="learning-app">
      <header className="topbar">
        <div>
          <p className="eyebrow">Learning Platform</p>
          <h1>Investease Learning Studio</h1>
        </div>
        <div className="topbar-progress">
          <span>Course progress</span>
          <strong>{courseProgress}%</strong>
        </div>
      </header>

      <div className="learning-layout">
        <aside className="sidebar">
          <section className="panel">
            <h2>Curriculum</h2>
            <ol className="lesson-list">
              {intermediateLessons.map((lesson, index) => {
                const isActive = lesson.id === selectedLesson.id;
                return (
                  <li key={lesson.id}>
                    <button
                      type="button"
                      className={isActive ? "lesson-btn active" : "lesson-btn"}
                      onClick={() => setSelectedLessonId(lesson.id)}
                    >
                      <span className="lesson-index">{index + 1}</span>
                      <span>{lesson.title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="panel">
            <h3>Foundation Sprint</h3>
            <ul>
              {foundationalChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </aside>

        <section className="content">
          <section className="panel hero-panel">
            <p className="eyebrow">Current module</p>
            <h2>{selectedLesson.title}</h2>
            <p>{selectedLesson.objective}</p>
            <div className="progress-row">
              <span>Lesson completion</span>
              <strong>{lessonProgress}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${lessonProgress}%` }} />
            </div>
          </section>

          <div className="content-grid">
            <section className="panel">
              <h3>Activities</h3>
              <ul className="checklist">
                {selectedLesson.activities.map((activity, index) => {
                  const key = `${selectedLesson.id}:${index}`;
                  const checked = Boolean(completedActivities[key]);
                  return (
                    <li key={key}>
                      <label className={checked ? "check-item checked" : "check-item"}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleActivity(selectedLesson.id, index)}
                        />
                        <span>{activity}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="panel">
              <h3>Adaptive Queue</h3>
              <ol>
                {path.map((id) => {
                  const lesson = intermediateLessons.find((entry) => entry.id === id);
                  return <li key={id}>{lesson?.title ?? id}</li>;
                })}
              </ol>

              <h3>Personalization</h3>
              <div className="slider-grid">
                <label>
                  Confidence <strong>{profile.confidence}/10</strong>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={profile.confidence}
                    onChange={(event) => updateProfile("confidence", Number(event.target.value))}
                  />
                </label>
                <label>
                  Valuation Skill <strong>{profile.valuationSkill}/10</strong>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={profile.valuationSkill}
                    onChange={(event) => updateProfile("valuationSkill", Number(event.target.value))}
                  />
                </label>
                <label>
                  Behavior Discipline <strong>{profile.behaviorDiscipline}/10</strong>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={profile.behaviorDiscipline}
                    onChange={(event) =>
                      updateProfile("behaviorDiscipline", Number(event.target.value))
                    }
                  />
                </label>
              </div>
            </section>

            <section className="panel coach-panel">
              <h3>AI Coach</h3>
              <button type="button" className="primary-btn" onClick={fetchCoach} disabled={loadingCoach}>
                {loadingCoach ? "Generating..." : "Generate Guidance"}
              </button>

              {coach?.summary ? (
                <div className="coach-output">
                  {coach.headline ? (
                    <p>
                      <strong>{coach.headline}</strong>
                    </p>
                  ) : null}
                  <p>{coach.summary}</p>
                  {coach.nextStep ? (
                    <p>
                      <strong>Next step:</strong> {coach.nextStep}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="muted">Uses OPEN_AI_API_KEY in your server environment.</p>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
