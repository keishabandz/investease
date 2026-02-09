create table if not exists learner_profiles (
  user_id uuid primary key,
  confidence smallint not null check (confidence between 1 and 10),
  valuation_skill smallint not null check (valuation_skill between 1 and 10),
  behavior_discipline smallint not null check (behavior_discipline between 1 and 10),
  updated_at timestamp with time zone default now()
);

create table if not exists lesson_progress (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  lesson_id text not null,
  completion_percent smallint not null default 0 check (completion_percent between 0 and 100),
  rubric_score smallint check (rubric_score between 1 and 5),
  reflection text,
  created_at timestamp with time zone default now()
);

create index if not exists idx_lesson_progress_user on lesson_progress(user_id);
