-- ============================================================
-- Portfolio Personal — Supabase Schema (DDL)
-- Feature: 001-portfolio-personal
-- Date: 2026-03-11
-- Run: Supabase SQL Editor → execute in order
-- ============================================================

-- Enable UUID extension (usually already enabled on Supabase)
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLE: profile (singleton)
-- ============================================================
create table if not exists public.profile (
  id           uuid primary key default gen_random_uuid(),
  name         text not null check (char_length(name) <= 100),
  title        text not null check (char_length(title) <= 100),
  bio          text not null check (char_length(bio) <= 2000),
  email        text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  linkedin_url text check (linkedin_url is null or linkedin_url ~* '^https?://'),
  github_url   text check (github_url is null or github_url ~* '^https?://'),
  avatar_url   text check (avatar_url is null or avatar_url ~* '^https?://'),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ============================================================
-- TABLE: projects
-- ============================================================
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null check (char_length(title) <= 150),
  description   text not null check (char_length(description) <= 2000),
  preview_url   text check (preview_url is null or preview_url ~* '^https?://'),
  repo_url      text check (repo_url is null or repo_url ~* '^https?://'),
  tags          text[] not null default '{}',
  thumbnail_url text check (thumbnail_url is null or thumbnail_url ~* '^https?://'),
  featured      boolean not null default false,
  published     boolean not null default false,
  sort_order    integer not null default 0 check (sort_order >= 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists projects_published_idx on public.projects (published);
create index if not exists projects_sort_order_idx on public.projects (sort_order);

-- ============================================================
-- TABLE: certifications
-- ============================================================
create table if not exists public.certifications (
  id             uuid primary key default gen_random_uuid(),
  title          text not null check (char_length(title) <= 200),
  institution    text not null check (char_length(institution) <= 150),
  issued_at      date not null,
  credential_url text check (credential_url is null or credential_url ~* '^https?://'),
  image_url      text check (image_url is null or image_url ~* '^https?://'),
  category       text not null check (char_length(category) <= 50),
  sort_order     integer not null default 0 check (sort_order >= 0),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists certifications_category_idx on public.certifications (category);

-- ============================================================
-- TABLE: skills
-- ============================================================
create table if not exists public.skills (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) <= 50),
  category   text not null check (char_length(category) <= 50),
  icon       text,
  level      text not null check (level in ('beginner', 'intermediate', 'advanced', 'expert')),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists skills_category_idx on public.skills (category);

-- ============================================================
-- TRIGGER: auto-update updated_at on all tables
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger profile_updated_at
  before update on public.profile
  for each row execute function public.handle_updated_at();

create or replace trigger projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

create or replace trigger certifications_updated_at
  before update on public.certifications
  for each row execute function public.handle_updated_at();

create or replace trigger skills_updated_at
  before update on public.skills
  for each row execute function public.handle_updated_at();

-- ============================================================
-- MIGRATION: galería multi-imagen por proyecto
-- Ejecutar en Supabase SQL Editor si la tabla ya existe
-- ============================================================
alter table public.projects
  add column if not exists images text[] not null default '{}';

-- Cambiar issued_at: de date NOT NULL → text NULL
-- Permite ingresar solo el año ("2023") o dejar en blanco
alter table public.certifications
  alter column issued_at type text using issued_at::text,
  alter column issued_at drop not null;

-- ============================================================
-- SEED DATA — eliminado. Cargar datos reales desde el panel admin.
-- ============================================================
