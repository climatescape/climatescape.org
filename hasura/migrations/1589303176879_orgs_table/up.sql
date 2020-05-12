CREATE TABLE public.organizations (	
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,	
    data jsonb NOT NULL,	
    created_at timestamp with time zone DEFAULT now() NOT NULL,	
    updated_at timestamp with time zone DEFAULT now() NOT NULL	
);

ALTER TABLE ONLY public.organizations	
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);	

CREATE TRIGGER set_public_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();	
COMMENT ON TRIGGER set_public_organizations_updated_at ON public.organizations IS 'trigger to set value of column "updated_at" to current timestamp on row update';
