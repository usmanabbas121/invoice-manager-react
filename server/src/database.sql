// CREATE TABLE "invoices" ("invoice_id" serial NOT NULL, "client_name" TEXT NOT NULL, "client_email" varchar(255) NOT NULL, "client_phone" TEXT NOT NULL, "team_lead_name" TEXT NOT NULL, "team_lead_email" varchar(255) NOT NULL, "team_lead_phone" TEXT NOT NULL, "company_name" TEXT NOT NULL, "company_address" TEXT NOT NULL, "service_provider" TEXT NOT NULL, "project_name" TEXT NOT NULL, "project_tasks" TEXT NOT NULL, "time_duration" INT NOT NULL , "rate" INT NOT NULL, "currency" TEXT NOT NULL, "total" INT NOT NULL, CONSTRAINT "Invoice_pk" PRIMARY KEY ("invoice_id"));
// CREATE TABLE "users" ("user_id" serial NOT NULL,"name" TEXT NOT NULL, "email" varchar(255) NOT NULL, "password" varchar(255) NOT NULL, "role" TEXT NOT NULL, "created_at" TIMESTAMP NOT NULL,"updated_at" TIMESTAMP,"updated_by" int,"deleted_at" TIMESTAMP,"deleted_by" int, "status" TEXT, CONSTRAINT "Users_pk" PRIMARY KEY ("user_id")); 

// ALTER TABLE invoices ADD COLUMN created_at TIMESTAMP NOT NULL;
// ALTER TABLE invoices ADD COLUMN deleted_at TIMESTAMP;
// ALTER TABLE invoices ADD COLUMN updated_at TIMESTAMP;
// ALTER TABLE users ADD UNIQUE (email));
// ALTER TABLE users RENAME COLUMN password TO password_hash;
// ALTER TABLE invoices ADD COLUMN created_by INT;
// ALTER TABLE invoices ADD COLUMN updated_by INT;
// ALTER TABLE invoices ADD COLUMN deleted_by INT;

// INSERT INTO users (name, email, password, role, created_at, created_by, status) VALUES ('usman abbas', 'usman.abbas@nxb.com.pk', 'usman123', 'ADMIN', '2021-01-05T06:40:06.950Z', 40 ,'ACTIVATED');
