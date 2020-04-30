ALTER TABLE "public"."lists" ADD COLUMN "name" text;
ALTER TABLE "public"."lists" ALTER COLUMN "name" DROP NOT NULL;
