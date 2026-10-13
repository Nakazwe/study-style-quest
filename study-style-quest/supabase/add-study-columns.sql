-- Optional: lets Study DNA remember each technique's study-phase score across visits.
-- The app works without this; until it is run, study scores only show for the current visit.
-- Run once in Supabase → SQL Editor.
alter table sessions
  add column if not exists study_score  integer check (study_score between 0 and 100),
  add column if not exists study_metric text;
