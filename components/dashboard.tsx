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
  const [coach, setCoach] = useState<CoachResult | null>(null);
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const path = useMemo(() => recommendPath(profile), [profile]);

  async function fetchCoach() {
    setLoadingCoach(true);
    setCoach(null);

    try {
      const lessonTitles = path
        .map((id) => intermediateLessons.find((entry) => entry.id === id)?.title)
        .filter(Boolean);

      const response = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learnerProfile: profile,
          nextLessons: lessonTitles,
        }),
      });

      if (!response.ok) return;

      const data = await response.json();
      setCoach(data);
    } catch {
      // Keep UI functional when AI call fails.
    } finally {
      setLoadingCoach(false);
    }
  }

  function updateProfile(field: keyof LearnerProfile, value: number) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <main>
      <section className="hero">
        <span className="badge">MOOC + Adaptive</span>
        <span className="badge">AI-ready</span>
        <h1>Investease Learning Studio</h1>
        <p>
          A structured learning platform for investing fundamentals and intermediate practice. Adjust the
          sliders to simulate learner readiness and watch the adaptive pathway reorder instantly.
        </p>
      </section>

      <section className="card controls">
        <h2>Learner Profile Simulator</h2>
        <div className="slider-grid">
          <label>
            Confidence: <strong>{profile.confidence}/10</strong>
            <input
              type="range"
              min={1}
              max={10}
              value={profile.confidence}
              onChange={(event) => updateProfile("confidence", Number(event.target.value))}
            />
          </label>
          <label>
            Valuation Skill: <strong>{profile.valuationSkill}/10</strong>
            <input
              type="range"
              min={1}
              max={10}
              value={profile.valuationSkill}
              onChange={(event) => updateProfile("valuationSkill", Number(event.target.value))}
            />
          </label>
          <label>
            Behavior Discipline: <strong>{profile.behaviorDiscipline}/10</strong>
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

      <section className="card">
        <h2>Foundation Sprint: Research Workflow</h2>
        <ul>
          {foundationalChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="pathway">
        <h2>Adaptive Pathway Suggestion</h2>
        <small>
          Live learner profile → confidence {profile.confidence}/10, valuation {profile.valuationSkill}
          /10, behavior discipline {profile.behaviorDiscipline}/10
        </small>
        <ol>
          {path.map((id) => {
            const lesson = intermediateLessons.find((entry) => entry.id === id);
            return <li key={id}>{lesson?.title ?? id}</li>;
          })}
        </ol>
      </section>

      <section className="grid">
        {intermediateLessons.map((lesson) => {
          const isOpen = activeLessonId === lesson.id;

          return (
            <article className="module" key={lesson.id}>
              <button
                type="button"
                className="module-toggle"
                onClick={() => setActiveLessonId(isOpen ? null : lesson.id)}
              >
                <h3>{lesson.title}</h3>
                <span>{isOpen ? "Hide" : "Show"}</span>
              </button>
              <p>{lesson.objective}</p>

              {isOpen ? (
                <>
                  <strong>Activities</strong>
                  <ul>
                    {lesson.activities.map((activity) => (
                      <li key={activity}>{activity}</li>
                    ))}
                  </ul>
                  <strong>Mastery signals</strong>
                  <ul>
                    {lesson.masterySignals.map((signal) => (
                      <li key={signal}>{signal}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </article>
          );
        })}
      </section>

      <section className="setup">
        <h2>AI Model Layer (Free Tier Friendly)</h2>
        <ul>
          <li>Session coach: generates hints from learner mistakes and confidence signals.</li>
          <li>Reflection analyzer: summarizes journal entries and flags recurring bias patterns.</li>
          <li>Assessment assistant: turns rubric scores into next-step recommendations.</li>
        </ul>
      </section>

      <section className="card">
        <h2>AI Coach Preview</h2>
        <button type="button" className="primary-btn" onClick={fetchCoach} disabled={loadingCoach}>
          {loadingCoach ? "Generating guidance..." : "Generate AI Coach Guidance"}
        </button>

        {!loadingCoach && coach?.summary ? (
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
        ) : null}

        {!loadingCoach && !coach?.summary ? (
          <p>Click generate to fetch guidance using OPEN_AI_API_KEY.</p>
        ) : null}
      </section>
    </main>
  );
}
