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
CREATE TABLE public.list_organizations (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    list_id uuid NOT NULL,
    organization_id uuid NOT NULL
);
CREATE TABLE public.lists (
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL
);
CREATE TABLE public.organizations (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.list_organizations
    ADD CONSTRAINT list_organizations_list_id_organization_id_key UNIQUE (list_id, organization_id);
ALTER TABLE ONLY public.list_organizations
    ADD CONSTRAINT list_organizations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.lists
    ADD CONSTRAINT lists_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);
CREATE TRIGGER set_public_list_organizations_updated_at BEFORE UPDATE ON public.list_organizations FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_list_organizations_updated_at ON public.list_organizations IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_lists_updated_at BEFORE UPDATE ON public.lists FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_lists_updated_at ON public.lists IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_organizations_updated_at ON public.organizations IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.list_organizations
    ADD CONSTRAINT list_organizations_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.lists(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.list_organizations
    ADD CONSTRAINT list_organizations_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
