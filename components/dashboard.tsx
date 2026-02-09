"use client";

import { useEffect, useState } from "react";
import { foundationalChecklist, intermediateLessons } from "@/lib/curriculum";
import { recommendPath } from "@/lib/adaptive";

const sampleLearnerProfile = {
  confidence: 4,
  valuationSkill: 3,
  behaviorDiscipline: 6,
};

const samplePath = recommendPath(sampleLearnerProfile);

interface CoachResult {
  headline?: string;
  summary?: string;
  nextStep?: string;
}

export function Dashboard() {
  const [coach, setCoach] = useState<CoachResult | null>(null);
  const [loadingCoach, setLoadingCoach] = useState(false);

  useEffect(() => {
    async function fetchCoach() {
      setLoadingCoach(true);
      try {
        const lessonTitles = samplePath
          .map((id) => intermediateLessons.find((entry) => entry.id === id)?.title)
          .filter(Boolean);

        const response = await fetch("/api/ai/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            learnerProfile: sampleLearnerProfile,
            nextLessons: lessonTitles,
          }),
        });

        if (!response.ok) return;

        const data = await response.json();
        setCoach(data);
      } catch {
        // Best-effort section; keep page functional when AI call fails.
      } finally {
        setLoadingCoach(false);
      }
    }

    fetchCoach();
  }, []);

  return (
    <main>
      <section className="hero">
        <span className="badge">MOOC + Adaptive</span>
        <span className="badge">AI-ready</span>
        <h1>Investease Learning Studio</h1>
        <p>
          A structured learning platform for investing fundamentals and intermediate practice. Learners
          move through guided modules, while an adaptive engine prioritizes the next lessons based on
          confidence, valuation skill, and behavior discipline.
        </p>
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
        <small>Sample learner profile → confidence 4/10, valuation 3/10, behavior discipline 6/10</small>
        <ol>
          {samplePath.map((id) => {
            const lesson = intermediateLessons.find((entry) => entry.id === id);
            return <li key={id}>{lesson?.title ?? id}</li>;
          })}
        </ol>
      </section>

      <section className="grid">
        {intermediateLessons.map((lesson) => (
          <article className="module" key={lesson.id}>
            <h3>{lesson.title}</h3>
            <p>{lesson.objective}</p>
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
          </article>
        ))}
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
        {loadingCoach ? <p>Generating guidance...</p> : null}
        {!loadingCoach && coach?.summary ? (
          <>
            {coach.headline ? <p><strong>{coach.headline}</strong></p> : null}
            <p>{coach.summary}</p>
            {coach.nextStep ? <p><strong>Next step:</strong> {coach.nextStep}</p> : null}
          </>
        ) : null}
        {!loadingCoach && !coach?.summary ? (
          <p>AI guidance unavailable. Configure OPEN_AI_API_KEY in Vercel.</p>
        ) : null}
      </section>
    </main>
  );
}
