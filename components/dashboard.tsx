"use client";

import { useMemo, useState } from "react";
import {
  foundationalChecklist,
  intermediateLessons,
  moduleTrainingContent,
  ModuleTrainingContent,
} from "@/lib/curriculum";
import { LearnerProfile, recommendPath } from "@/lib/adaptive";

interface CoachResult {
  headline?: string;
  summary?: string;
  nextStep?: string;
}

type Stage = 0 | 1 | 2 | 3 | 4;

const STAGE_LABELS = [
  "Module Brief",
  "Guided Practice",
  "Deep Training",
  "Checkpoint",
  "Completion",
] as const;

const initialProfile: LearnerProfile = {
  confidence: 4,
  valuationSkill: 3,
  behaviorDiscipline: 6,
};

function fallbackTraining(title: string, objective: string, activities: string[]): ModuleTrainingContent {
  return {
    overview: [
      `${title} focuses on applying evidence-first analysis instead of narrative-only conclusions.`,
      objective,
      "Use a clear claim -> evidence -> risk format for every conclusion you write.",
    ],
    frameworkCards: [
      {
        title: "Claim",
        detail: "Write one clear conclusion about quality, risk, or opportunity.",
      },
      {
        title: "Evidence",
        detail: "Attach one numeric datapoint and one qualitative source to support the claim.",
      },
      {
        title: "Risk",
        detail: "List one condition that would invalidate your conclusion.",
      },
      {
        title: "Decision",
        detail: "Convert analysis into an explicit next action: continue, watch, or stop.",
      },
    ],
    workedExamples: [
      {
        business: "Sample Business",
        revenueModel: "Mixed revenue stream",
        costShape: "Part fixed, part variable",
        customer: "Primary and secondary customer groups",
        riskSignal: "Assumption fails if demand or margins break trend",
      },
    ],
    openSourceTasks: [
      {
        source: "SEC EDGAR APIs",
        url: "https://www.sec.gov/edgar/sec-api-documentation",
        task: "Pull latest annual filing and identify one metric tied to this module objective.",
        whyItMatters: "Primary-source evidence improves reliability of your conclusions.",
      },
    ],
    checkpoint: activities.slice(0, 3).map((activity, index) => ({
      question: `Which action best demonstrates this step? (${activity})`,
      options: [
        "Write a claim without evidence",
        "Attach explicit evidence and risk conditions",
        "Skip analysis and rely on opinion",
      ],
      correctIndex: 1,
      explanation: `The module expects evidence-backed reasoning for: ${activity}`,
    })),
  };
}

export function Dashboard() {
  const [profile, setProfile] = useState<LearnerProfile>(initialProfile);
  const [viewMode, setViewMode] = useState<"dashboard" | "learning">("dashboard");
  const [selectedLessonId, setSelectedLessonId] = useState(intermediateLessons[0]?.id ?? "");
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({});
  const [moduleStarted, setModuleStarted] = useState<Record<string, boolean>>({});
  const [moduleStage, setModuleStage] = useState<Record<string, Stage>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [coach, setCoach] = useState<CoachResult | null>(null);
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [learningNavOpen, setLearningNavOpen] = useState(false);

  const path = useMemo(() => recommendPath(profile), [profile]);

  const selectedLesson =
    intermediateLessons.find((lesson) => lesson.id === selectedLessonId) ?? intermediateLessons[0];

  const training =
    moduleTrainingContent[selectedLesson.id] ??
    fallbackTraining(selectedLesson.title, selectedLesson.objective, selectedLesson.activities);

  const selectedActivities = selectedLesson.activities;
  const stage = moduleStage[selectedLesson.id] ?? 0;

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

  const quizPrefix = `${selectedLesson.id}:quiz:`;
  const passThreshold = Math.ceil(training.checkpoint.length * 0.67);
  const quizScore = training.checkpoint.reduce((score, question, index) => {
    const selected = quizAnswers[`${quizPrefix}${index}`];
    return score + (selected === question.correctIndex ? 1 : 0);
  }, 0);
  const hasSubmittedQuiz = Boolean(quizSubmitted[selectedLesson.id]);
  const passedQuiz = hasSubmittedQuiz && quizScore >= passThreshold;

  const allModulesCompleted = intermediateLessons.every((lesson) => {
    const stageValue = moduleStage[lesson.id] ?? 0;
    return stageValue === 4;
  });

  function updateProfile(field: keyof LearnerProfile, value: number) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function setStage(lessonId: string, next: Stage) {
    setModuleStage((prev) => ({ ...prev, [lessonId]: next }));
  }

  function startModule(lessonId: string) {
    setSelectedLessonId(lessonId);
    setModuleStarted((prev) => ({ ...prev, [lessonId]: true }));
    setStage(lessonId, 0);
    setViewMode("learning");
    setLearningNavOpen(false);
  }

  function completeActivity(activityIndex: number) {
    const key = `${selectedLesson.id}:${activityIndex}`;
    setCompletedActivities((prev) => ({ ...prev, [key]: true }));
  }

  function goStage(direction: -1 | 1) {
    const next = Math.min(Math.max(stage + direction, 0), 4) as Stage;
    setStage(selectedLesson.id, next);
  }

  function submitCheckpoint() {
    setQuizSubmitted((prev) => ({ ...prev, [selectedLesson.id]: true }));
    if (quizScore >= passThreshold) {
      setStage(selectedLesson.id, 4);
    }
  }

  function answerQuiz(questionIndex: number, optionIndex: number) {
    setQuizAnswers((prev) => ({ ...prev, [`${quizPrefix}${questionIndex}`]: optionIndex }));
    setQuizSubmitted((prev) => ({ ...prev, [selectedLesson.id]: false }));
  }

  function nextModule() {
    const currentIndex = intermediateLessons.findIndex((lesson) => lesson.id === selectedLesson.id);
    const next = intermediateLessons[currentIndex + 1];

    if (!next) {
      setViewMode("dashboard");
      return;
    }

    startModule(next.id);
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

  if (viewMode === "learning") {
    return (
      <main className="learning-mode">
        <header className="learn-header">
          <button
            type="button"
            className="burger-btn"
            onClick={() => setLearningNavOpen((prev) => !prev)}
          >
            Menu
          </button>
          <div>
            <p className="eyebrow">Learning Mode</p>
            <h1>{selectedLesson.title}</h1>
            <p className="muted">Step {stage + 1} of 5: {STAGE_LABELS[stage]}</p>
          </div>
          <button type="button" className="secondary-btn" onClick={() => setViewMode("dashboard")}>
            Exit To Overview
          </button>
        </header>

        <div className="learn-layout">
          <aside className={learningNavOpen ? "learn-sidebar open" : "learn-sidebar"}>
            <section className="panel">
              <h3>Module Progression</h3>
              <ol className="stage-list">
                {STAGE_LABELS.map((label, index) => {
                  const done = stage > index;
                  const active = stage === index;
                  return (
                    <li key={label} className={active ? "active" : done ? "done" : ""}>
                      <span>{index + 1}</span>
                      <p>{label}</p>
                    </li>
                  );
                })}
              </ol>
            </section>

            <section className="panel">
              <h3>What&apos;s Next</h3>
              <ul className="next-list">
                {intermediateLessons.map((lesson) => {
                  const status = (moduleStage[lesson.id] ?? 0) === 4
                    ? "Completed"
                    : moduleStarted[lesson.id]
                      ? "In Progress"
                      : "Locked";

                  return (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        className={lesson.id === selectedLesson.id ? "lesson-link active" : "lesson-link"}
                        onClick={() => {
                          setSelectedLessonId(lesson.id);
                          setLearningNavOpen(false);
                        }}
                      >
                        <span>{lesson.title}</span>
                        <small>{status}</small>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          </aside>

          <section className="learn-content panel">
            {stage === 0 ? (
              <section>
                <h2>Module Brief</h2>
                <p>{selectedLesson.objective}</p>
                <ul>
                  {training.overview.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <div className="actions-row">
                  <button type="button" className="primary-btn" onClick={() => setStage(selectedLesson.id, 1)}>
                    Begin Guided Practice
                  </button>
                </div>
              </section>
            ) : null}

            {stage === 1 ? (
              <section>
                <h2>Guided Practice</h2>
                <p className="muted">Complete each activity to unlock the next section.</p>
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
                            onChange={() => completeActivity(index)}
                          />
                          <span>{activity}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
                <div className="actions-row">
                  <button type="button" className="secondary-btn" onClick={() => goStage(-1)}>
                    Back
                  </button>
                  <button
                    type="button"
                    className="primary-btn"
                    disabled={completedCount !== selectedActivities.length}
                    onClick={() => setStage(selectedLesson.id, 2)}
                  >
                    Continue To Deep Training
                  </button>
                </div>
              </section>
            ) : null}

            {stage === 2 ? (
              <section>
                <h2>Deep Training</h2>

                <div className="training-group">
                  <h3>Framework Cards</h3>
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
                  <h3>Worked Examples</h3>
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
                  <h3>Open-Source Data Tasks</h3>
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

                <div className="actions-row">
                  <button type="button" className="secondary-btn" onClick={() => goStage(-1)}>
                    Back
                  </button>
                  <button type="button" className="primary-btn" onClick={() => setStage(selectedLesson.id, 3)}>
                    Continue To Checkpoint
                  </button>
                </div>
              </section>
            ) : null}

            {stage === 3 ? (
              <section>
                <h2>Checkpoint Assessment</h2>
                <p className="muted">Pass score: {passThreshold}/{training.checkpoint.length}</p>
                {training.checkpoint.map((question, questionIndex) => {
                  const selected = quizAnswers[`${quizPrefix}${questionIndex}`];
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
                      {hasSubmittedQuiz ? (
                        <p className="quiz-feedback">{question.explanation}</p>
                      ) : null}
                    </div>
                  );
                })}

                <div className="actions-row">
                  <button type="button" className="secondary-btn" onClick={() => goStage(-1)}>
                    Back
                  </button>
                  <button type="button" className="primary-btn" onClick={submitCheckpoint}>
                    Submit Assessment
                  </button>
                </div>

                {hasSubmittedQuiz ? (
                  <p className={passedQuiz ? "quiz-pass" : "quiz-fail"}>
                    Score: {quizScore}/{training.checkpoint.length}. {passedQuiz ? "Passed." : "Not passed yet. Review and retry."}
                  </p>
                ) : null}
              </section>
            ) : null}

            {stage === 4 ? (
              <section className="completion-screen">
                <h2>Module Completed</h2>
                <p>
                  Recognition unlocked: <strong>{selectedLesson.title} Completion Badge</strong>
                </p>
                <p className="muted">
                  You completed guided practice, deep training, and checkpoint assessment.
                </p>
                <div className="actions-row">
                  <button type="button" className="primary-btn" onClick={nextModule}>
                    {intermediateLessons.findIndex((lesson) => lesson.id === selectedLesson.id) < intermediateLessons.length - 1
                      ? "Start Next Module"
                      : "Return To Overview"}
                  </button>
                  <button type="button" className="secondary-btn" onClick={() => setViewMode("dashboard")}>
                    Back To Dashboard
                  </button>
                </div>
                {allModulesCompleted ? (
                  <p className="final-recognition">
                    Program milestone achieved: All modules completed.
                  </p>
                ) : null}
              </section>
            ) : null}
          </section>
        </div>
      </main>
    );
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

      <div className="overview-grid">
        <section className="panel">
          <h2>Recommended Path</h2>
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
                onChange={(event) => updateProfile("behaviorDiscipline", Number(event.target.value))}
              />
            </label>
          </div>
        </section>

        <section className="panel">
          <h2>Module Catalog</h2>
          <div className="module-list">
            {intermediateLessons.map((lesson) => {
              const status = (moduleStage[lesson.id] ?? 0) === 4
                ? "Completed"
                : moduleStarted[lesson.id]
                  ? "In Progress"
                  : "Not Started";

              return (
                <article key={lesson.id} className="module-item">
                  <h3>{lesson.title}</h3>
                  <p>{lesson.objective}</p>
                  <div className="module-item-footer">
                    <span className="lesson-status">{status}</span>
                    <button type="button" className="primary-btn" onClick={() => startModule(lesson.id)}>
                      {status === "Not Started" ? "Start Module" : "Resume Module"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <h2>Foundation Sprint</h2>
          <ul>
            {foundationalChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>AI Coach</h3>
          <button type="button" className="primary-btn" onClick={fetchCoach} disabled={loadingCoach}>
            {loadingCoach ? "Generating..." : "Generate Guidance"}
          </button>
          {coach?.summary ? (
            <div className="coach-output">
              {coach.headline ? <p><strong>{coach.headline}</strong></p> : null}
              <p>{coach.summary}</p>
              {coach.nextStep ? <p><strong>Next step:</strong> {coach.nextStep}</p> : null}
            </div>
          ) : (
            <p className="muted">Click Generate Guidance to get personalized coaching.</p>
          )}
        </section>
      </div>
    </main>
  );
}
