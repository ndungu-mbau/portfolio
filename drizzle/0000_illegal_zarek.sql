CREATE TYPE "public"."project_status" AS ENUM('Development', 'Beta', 'Live', 'Archived');--> statement-breakpoint
CREATE TYPE "public"."technology_category" AS ENUM('Frontend', 'Backend', 'Database', 'Cloud', 'DevOps');--> statement-breakpoint
CREATE TABLE "portfolio_account" (
	"userId" uuid NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "portfolio_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "portfolio_project_technologies" (
	"projectId" uuid NOT NULL,
	"technologyId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "portfolio_project_technologies_projectId_technologyId_pk" PRIMARY KEY("projectId","technologyId")
);
--> statement-breakpoint
CREATE TABLE "portfolio_project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"longDescription" text NOT NULL,
	"image" uuid NOT NULL,
	"liveUrl" text,
	"githubUrl" text NOT NULL,
	"status" "project_status" DEFAULT 'Development' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"duration" text NOT NULL,
	"year" text NOT NULL,
	"features" jsonb NOT NULL,
	"challenges" jsonb NOT NULL,
	"gallery" uuid[],
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "portfolio_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_technology" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" "technology_category" NOT NULL,
	"url" text,
	"github" text,
	"image" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "portfolio_upload" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"key" text NOT NULL,
	"size" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "portfolio_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "portfolio_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "portfolio_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "portfolio_account" ADD CONSTRAINT "portfolio_account_userId_portfolio_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."portfolio_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_project_technologies" ADD CONSTRAINT "portfolio_project_technologies_projectId_portfolio_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."portfolio_project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_project_technologies" ADD CONSTRAINT "portfolio_project_technologies_technologyId_portfolio_technology_id_fk" FOREIGN KEY ("technologyId") REFERENCES "public"."portfolio_technology"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_project" ADD CONSTRAINT "portfolio_project_image_portfolio_upload_id_fk" FOREIGN KEY ("image") REFERENCES "public"."portfolio_upload"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_session" ADD CONSTRAINT "portfolio_session_userId_portfolio_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."portfolio_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_technology" ADD CONSTRAINT "portfolio_technology_image_portfolio_upload_id_fk" FOREIGN KEY ("image") REFERENCES "public"."portfolio_upload"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "portfolio_account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "project_technologies_project_id_idx" ON "portfolio_project_technologies" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "t_user_id_idx" ON "portfolio_session" USING btree ("userId");