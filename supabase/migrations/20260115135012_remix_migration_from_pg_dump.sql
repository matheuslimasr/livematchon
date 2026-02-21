CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: analytics_visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_visits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    visitor_id text NOT NULL,
    session_id text NOT NULL,
    page_url text,
    referrer text,
    user_agent text,
    device_type text,
    country text,
    city text,
    clicked_download boolean DEFAULT false,
    visit_start timestamp with time zone DEFAULT now() NOT NULL,
    visit_end timestamp with time zone,
    duration_seconds integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    browser text,
    traffic_source text
);


--
-- Name: app_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_versions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    version character varying(50) NOT NULL,
    file_url text NOT NULL,
    file_name text NOT NULL,
    file_size bigint,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tutorial_steps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tutorial_steps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    step_order integer NOT NULL,
    image_url text NOT NULL,
    title_pt text DEFAULT ''::text NOT NULL,
    title_en text DEFAULT ''::text NOT NULL,
    title_es text DEFAULT ''::text NOT NULL,
    description_pt text DEFAULT ''::text NOT NULL,
    description_en text DEFAULT ''::text NOT NULL,
    description_es text DEFAULT ''::text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tutorial_videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tutorial_videos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text DEFAULT 'Tutorial'::text NOT NULL,
    video_url text NOT NULL,
    file_name text NOT NULL,
    file_size bigint,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: admin_users admin_users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_email_key UNIQUE (email);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: analytics_visits analytics_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_visits
    ADD CONSTRAINT analytics_visits_pkey PRIMARY KEY (id);


--
-- Name: app_versions app_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_versions
    ADD CONSTRAINT app_versions_pkey PRIMARY KEY (id);


--
-- Name: tutorial_steps tutorial_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tutorial_steps
    ADD CONSTRAINT tutorial_steps_pkey PRIMARY KEY (id);


--
-- Name: tutorial_videos tutorial_videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tutorial_videos
    ADD CONSTRAINT tutorial_videos_pkey PRIMARY KEY (id);


--
-- Name: idx_analytics_clicked_download; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_clicked_download ON public.analytics_visits USING btree (clicked_download);


--
-- Name: idx_analytics_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_created_at ON public.analytics_visits USING btree (created_at);


--
-- Name: idx_analytics_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_session_id ON public.analytics_visits USING btree (session_id);


--
-- Name: idx_analytics_visitor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_visitor_id ON public.analytics_visits USING btree (visitor_id);


--
-- Name: tutorial_steps update_tutorial_steps_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_tutorial_steps_updated_at BEFORE UPDATE ON public.tutorial_steps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tutorial_videos update_tutorial_videos_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_tutorial_videos_updated_at BEFORE UPDATE ON public.tutorial_videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tutorial_steps Anyone can delete tutorial steps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete tutorial steps" ON public.tutorial_steps FOR DELETE USING (true);


--
-- Name: tutorial_videos Anyone can delete tutorial videos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete tutorial videos" ON public.tutorial_videos FOR DELETE USING (true);


--
-- Name: analytics_visits Anyone can delete visits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete visits" ON public.analytics_visits FOR DELETE USING (true);


--
-- Name: tutorial_steps Anyone can insert tutorial steps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert tutorial steps" ON public.tutorial_steps FOR INSERT WITH CHECK (true);


--
-- Name: tutorial_videos Anyone can insert tutorial videos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert tutorial videos" ON public.tutorial_videos FOR INSERT WITH CHECK (true);


--
-- Name: analytics_visits Anyone can insert visits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert visits" ON public.analytics_visits FOR INSERT WITH CHECK (true);


--
-- Name: tutorial_steps Anyone can update tutorial steps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update tutorial steps" ON public.tutorial_steps FOR UPDATE USING (true);


--
-- Name: tutorial_videos Anyone can update tutorial videos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update tutorial videos" ON public.tutorial_videos FOR UPDATE USING (true);


--
-- Name: analytics_visits Anyone can update visits by session; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update visits by session" ON public.analytics_visits FOR UPDATE USING (true);


--
-- Name: app_versions Anyone can view active app versions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active app versions" ON public.app_versions FOR SELECT USING ((is_active = true));


--
-- Name: tutorial_steps Anyone can view active tutorial steps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active tutorial steps" ON public.tutorial_steps FOR SELECT USING ((is_active = true));


--
-- Name: tutorial_videos Anyone can view active tutorial videos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active tutorial videos" ON public.tutorial_videos FOR SELECT USING ((is_active = true));


--
-- Name: analytics_visits Anyone can view visits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view visits" ON public.analytics_visits FOR SELECT USING (true);


--
-- Name: app_versions Authenticated users can delete app versions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can delete app versions" ON public.app_versions FOR DELETE USING (true);


--
-- Name: app_versions Authenticated users can insert app versions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can insert app versions" ON public.app_versions FOR INSERT WITH CHECK (true);


--
-- Name: app_versions Authenticated users can update app versions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can update app versions" ON public.app_versions FOR UPDATE USING (true);


--
-- Name: admin_users No public access to admin users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "No public access to admin users" ON public.admin_users FOR SELECT USING (false);


--
-- Name: admin_users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

--
-- Name: analytics_visits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.analytics_visits ENABLE ROW LEVEL SECURITY;

--
-- Name: app_versions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.app_versions ENABLE ROW LEVEL SECURITY;

--
-- Name: tutorial_steps; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tutorial_steps ENABLE ROW LEVEL SECURITY;

--
-- Name: tutorial_videos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tutorial_videos ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;