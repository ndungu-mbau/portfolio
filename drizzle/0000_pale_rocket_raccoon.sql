CREATE TABLE "portforlio_account" (
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
	CONSTRAINT "portforlio_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "portforlio_project_technology" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projectId" uuid NOT NULL,
	"technologyId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portforlio_project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"url" varchar(255) NOT NULL,
	"github" varchar(255),
	"image" varchar(255),
	"featured" boolean DEFAULT false,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "portforlio_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portforlio_technology" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"url" varchar(255) NOT NULL,
	"github" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "portforlio_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "portforlio_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "portforlio_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "portforlio_account" ADD CONSTRAINT "portforlio_account_userId_portforlio_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."portforlio_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portforlio_project_technology" ADD CONSTRAINT "portforlio_project_technology_projectId_portforlio_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."portforlio_project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portforlio_project_technology" ADD CONSTRAINT "portforlio_project_technology_technologyId_portforlio_technology_id_fk" FOREIGN KEY ("technologyId") REFERENCES "public"."portforlio_technology"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portforlio_session" ADD CONSTRAINT "portforlio_session_userId_portforlio_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."portforlio_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "portforlio_account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "project_technology_project_id_idx" ON "portforlio_project_technology" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "t_user_id_idx" ON "portforlio_session" USING btree ("userId");