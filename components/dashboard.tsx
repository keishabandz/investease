"use client";

import { useMemo, useState } from "react";
import { foundationalChecklist, intermediateLessons, moduleTrainingContent } from "@/lib/curriculum";
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
  const [moduleStarted, setModuleStarted] = useState<Record<string, boolean>>({});
  const [moduleStepIndex, setModuleStepIndex] = useState<Record<string, number>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [coach, setCoach] = useState<CoachResult | null>(null);
  const [loadingCoach, setLoadingCoach] = useState(false);

  const path = useMemo(() => recommendPath(profile), [profile]);

  const selectedLesson =
    intermediateLessons.find((lesson) => lesson.id === selectedLessonId) ?? intermediateLessons[0];
  const training = moduleTrainingContent[selectedLesson.id];

  const selectedActivities = selectedLesson.activities;
  const stepIndex = moduleStepIndex[selectedLesson.id] ?? 0;

  const completedCount = selectedActivities.filter((_, index) => {
    const key = `${selectedLesson.id}:${index}`;
    return completedActivities[key];
  }).length;

  const lessonProgress = Math.round((completedCount / selectedActivities.length) * 100);

  const courseProgress = Math.round(
    (Object.values(completedActivities).filter(Boolean).length /
      intermediateLessons.reduce((total, lesson) => total + lesson.activities.length, 0)) *
      100
  );

  const moduleIsStarted = Boolean(moduleStarted[selectedLesson.id]);
  const moduleIsComplete = completedCount === selectedActivities.length;
  const currentStep = selectedActivities[Math.min(stepIndex, selectedActivities.length - 1)] ?? "";

  const quizAnswerKeyPrefix = `${selectedLesson.id}:quiz:`;
  const quizHasSubmitted = Boolean(quizSubmitted[selectedLesson.id]);

  const quizScore = training
    ? training.checkpoint.reduce((score, question, questionIndex) => {
        const selectedIndex = quizAnswers[`${quizAnswerKeyPrefix}${questionIndex}`];
        return score + (selectedIndex === question.correctIndex ? 1 : 0);
      }, 0)
    : 0;

  function updateProfile(field: keyof LearnerProfile, value: number) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function toggleActivity(lessonId: string, activityIndex: number) {
    const key = `${lessonId}:${activityIndex}`;
    setCompletedActivities((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function startModule(lessonId: string) {
    setModuleStarted((prev) => ({ ...prev, [lessonId]: true }));
    setModuleStepIndex((prev) => ({ ...prev, [lessonId]: prev[lessonId] ?? 0 }));
  }

  function completeCurrentStep() {
    const key = `${selectedLesson.id}:${stepIndex}`;

    setCompletedActivities((prev) => ({ ...prev, [key]: true }));
    setModuleStepIndex((prev) => ({
      ...prev,
      [selectedLesson.id]: Math.min(stepIndex + 1, selectedActivities.length - 1),
    }));
  }

  function goToStep(direction: -1 | 1) {
    const next = Math.min(
      Math.max(stepIndex + direction, 0),
      Math.max(selectedActivities.length - 1, 0)
    );

    setModuleStepIndex((prev) => ({ ...prev, [selectedLesson.id]: next }));
  }

  function answerQuiz(questionIndex: number, optionIndex: number) {
    setQuizAnswers((prev) => ({
      ...prev,
      [`${quizAnswerKeyPrefix}${questionIndex}`]: optionIndex,
    }));
  }

  function submitQuiz() {
    setQuizSubmitted((prev) => ({ ...prev, [selectedLesson.id]: true }));
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
                const lessonDone = lesson.activities.every((_, activityIndex) => {
                  const key = `${lesson.id}:${activityIndex}`;
                  return completedActivities[key];
                });
                const lessonInProgress = Boolean(moduleStarted[lesson.id]) && !lessonDone;

                return (
                  <li key={lesson.id}>
                    <button
                      type="button"
                      className={isActive ? "lesson-btn active" : "lesson-btn"}
                      onClick={() => setSelectedLessonId(lesson.id)}
                    >
                      <span className="lesson-index">{index + 1}</span>
                      <span>{lesson.title}</span>
                      <span className="lesson-status">
                        {lessonDone ? "Done" : lessonInProgress ? "In Progress" : "Not Started"}
                      </span>
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
            {!moduleIsStarted ? (
              <button
                type="button"
                className="primary-btn"
                onClick={() => startModule(selectedLesson.id)}
              >
                Start Module
              </button>
            ) : null}
          </section>

          <div className="content-grid">
            <section className="panel">
              <h3>Module Workflow</h3>
              {!moduleIsStarted ? (
                <p className="muted">
                  Start this module to unlock step-by-step activity guidance.
                </p>
              ) : (
                <div className="workflow">
                  <p className="step-label">
                    Step {Math.min(stepIndex + 1, selectedActivities.length)} of {selectedActivities.length}
                  </p>
                  <p>{currentStep}</p>
                  <div className="workflow-actions">
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => goToStep(-1)}
                      disabled={stepIndex === 0}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={completeCurrentStep}
                      disabled={moduleIsComplete}
                    >
                      {moduleIsComplete ? "Module Completed" : "Mark Step Complete"}
                    </button>
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => goToStep(1)}
                      disabled={stepIndex >= selectedActivities.length - 1}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              <h3>Activities</h3>
              <ul className="checklist">
                {selectedActivities.map((activity, index) => {
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

            {training ? (
              <section className="panel training-panel">
                <h3>Training Pack: {selectedLesson.title}</h3>

                <div className="training-group">
                  <h4>Concept Brief</h4>
                  <ul>
                    {training.overview.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="training-group">
                  <h4>Framework Cards</h4>
                  <div className="card-grid">
                    {training.frameworkCards.map((card) => (
                      <article key={card.title} className="micro-card">
                        <strong>{card.title}</strong>
                        <p>{card.detail}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="training-group">
                  <h4>Worked Examples</h4>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Business</th>
                          <th>Revenue Model</th>
                          <th>Cost Shape</th>
                          <th>Customer</th>
                          <th>Risk Signal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {training.workedExamples.map((row) => (
                          <tr key={row.business}>
                            <td>{row.business}</td>
                            <td>{row.revenueModel}</td>
                            <td>{row.costShape}</td>
                            <td>{row.customer}</td>
                            <td>{row.riskSignal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="training-group">
                  <h4>Open-Source Data Tasks</h4>
                  <ul className="resource-list">
                    {training.openSourceTasks.map((task) => (
                      <li key={task.source}>
                        <a href={task.url} target="_blank" rel="noreferrer">
                          {task.source}
                        </a>
                        <p><strong>Task:</strong> {task.task}</p>
                        <p><strong>Why:</strong> {task.whyItMatters}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="training-group">
                  <h4>Checkpoint Quiz</h4>
                  {training.checkpoint.map((question, questionIndex) => {
                    const selected = quizAnswers[`${quizAnswerKeyPrefix}${questionIndex}`];
                    const showResult = quizHasSubmitted;
                    return (
                      <div key={question.question} className="quiz-card">
                        <p><strong>Q{questionIndex + 1}.</strong> {question.question}</p>
                        <div className="quiz-options">
                          {question.options.map((option, optionIndex) => (
                            <label key={option} className="option-item">
                              <input
                                type="radio"
                                name={`${selectedLesson.id}-q-${questionIndex}`}
                                checked={selected === optionIndex}
                                onChange={() => answerQuiz(questionIndex, optionIndex)}
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                        {showResult ? (
                          <p className="quiz-feedback">{question.explanation}</p>
                        ) : null}
                      </div>
                    );
                  })}
                  <div className="quiz-footer">
                    <button type="button" className="primary-btn" onClick={submitQuiz}>
                      Submit Checkpoint
                    </button>
                    {quizHasSubmitted ? (
                      <p className="quiz-score">
                        Score: {quizScore}/{training.checkpoint.length}
                      </p>
                    ) : null}
                  </div>
                </div>
              </section>
            ) : null}

            <section className="panel coach-panel">
              <h3>AI Coach</h3>
              <button
                type="button"
                className="primary-btn"
                onClick={fetchCoach}
                disabled={loadingCoach}
              >
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
                <p className="muted">Click Generate Guidance to get personalized coaching.</p>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
