CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.favorites (
    user_id text NOT NULL,
    record_id text NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);
CREATE VIEW public.favorites_count AS
 SELECT favorites.record_id,
    count(DISTINCT favorites.user_id) AS count
   FROM public.favorites
  WHERE (favorites.deleted_at IS NULL)
  GROUP BY favorites.record_id;
CREATE TABLE public.users (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
CREATE UNIQUE INDEX favorites_user_id_record_id_uniq ON public.favorites USING btree (user_id, record_id) WHERE (deleted_at IS NULL);
ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
