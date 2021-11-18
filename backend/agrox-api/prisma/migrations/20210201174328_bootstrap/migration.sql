-- CreateTable
CREATE TABLE "address" (
"id" SERIAL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "number" INTEGER,
    "km" INTEGER,
    "postal_code" TEXT,
    "complement" TEXT,
    "neighborhood" TEXT,
    "phone_number" TEXT,
    "contact_name" TEXT,
    "state_id" INTEGER NOT NULL,
    "mobile_number" TEXT,
    "email" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "area" (
"id" SERIAL,
    "code" INTEGER NOT NULL,
    "lat" DECIMAL(65,30) NOT NULL,
    "long" DECIMAL(65,30) NOT NULL,
    "coordinates" JSONB,
    "name" TEXT NOT NULL,
    "zone" TEXT,
    "state_initials" TEXT,
    "city" TEXT,
    "farm_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company" (
"id" SERIAL,
    "name" TEXT NOT NULL,
    "works_with_drone" BOOLEAN NOT NULL,
    "works_with_plane" BOOLEAN NOT NULL,
    "works_with_tractor" BOOLEAN NOT NULL,
    "lat" DECIMAL(65,30) NOT NULL,
    "long" DECIMAL(65,30) NOT NULL,
    "address_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crop" (
"id" SERIAL,
    "crop_type" TEXT NOT NULL,
    "variety" TEXT NOT NULL,
    "sowing_date" TIMESTAMP(3) NOT NULL,
    "expected_harvest_date" TIMESTAMP(3) NOT NULL,
    "number" INTEGER NOT NULL DEFAULT 1,
    "is_diagnosis_hired" BOOLEAN DEFAULT false,
    "field_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnosis" (
"id" SERIAL,
    "report_date" TIMESTAMP(3) NOT NULL,
    "affected_area_ha" DECIMAL(65,30) NOT NULL,
    "crop_id" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email" (
"id" SERIAL,
    "email" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farm" (
"id" SERIAL,
    "cnpj" TEXT,
    "social_name" TEXT,
    "fantasy_name" TEXT NOT NULL,
    "lat" DECIMAL(65,30),
    "long" DECIMAL(65,30),
    "address_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field" (
"id" SERIAL,
    "code" INTEGER NOT NULL,
    "area_ha" DECIMAL(65,30) NOT NULL,
    "lat" DECIMAL(65,30) NOT NULL,
    "long" DECIMAL(65,30) NOT NULL,
    "coordinates" JSONB NOT NULL,
    "name" TEXT NOT NULL,
    "image_uri" TEXT,
    "area_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infestation" (
"id" SERIAL,
    "area_ha" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "points" JSONB,
    "diagnosis_id" INTEGER NOT NULL,
    "plague_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "many_quotation_modal_package_has_many_field" (
    "id_quotation_modal_package" INTEGER NOT NULL,
    "id_field" INTEGER NOT NULL,

    PRIMARY KEY ("id_quotation_modal_package","id_field")
);

-- CreateTable
CREATE TABLE "many_user_has_many_farm" (
    "user_id" INTEGER NOT NULL,
    "farm_id" INTEGER NOT NULL,

    PRIMARY KEY ("user_id","farm_id")
);

-- CreateTable
CREATE TABLE "notification" (
"id" SERIAL,
    "type" INTEGER NOT NULL,
    "body" JSONB NOT NULL,
    "sent_date" TIMESTAMP(3) NOT NULL,
    "read_date" TIMESTAMP(3),
    "delivered_date" TIMESTAMP(3),
    "user_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plague" (
"id" SERIAL,
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "color" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription" (
"id" SERIAL,
    "date" TIMESTAMP(3) NOT NULL,
    "content" JSONB NOT NULL DEFAULT '[]',
    "pulverization_method" INTEGER NOT NULL,
    "author" TEXT,
    "phone_number" TEXT,
    "diagnosis_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privacy_policy" (
"id" SERIAL,
    "content" TEXT NOT NULL,
    "publish_date" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation" (
"id" SERIAL,
    "response_date" TIMESTAMP(3),
    "expiration_date" TIMESTAMP(3),
    "antecipated_price" INTEGER,
    "cash_price" INTEGER,
    "delayed_price" INTEGER,
    "company_id" INTEGER NOT NULL,
    "quotation_modal_package_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation_checkout" (
"id" SERIAL,
    "checkout_date" TIMESTAMP(3) NOT NULL,
    "selected_price" INTEGER NOT NULL,
    "quotation_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation_modal_package" (
"id" SERIAL,
    "pulverization_method" INTEGER NOT NULL,
    "quotation_package_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation_package" (
"id" SERIAL,
    "code" INTEGER NOT NULL,
    "request_date" TIMESTAMP(3) NOT NULL,
    "pulverization_start_date" TIMESTAMP(3) NOT NULL,
    "pulverization_end_date" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
"id" SERIAL,
    "name" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seed_revision" (
"id" SERIAL,
"revision" SERIAL,
    "seeding_timestamp" TIMESTAMP(3) NOT NULL,
    "version_major" INTEGER,
    "version_minor" INTEGER,
    "version_patch" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state" (
"id" SERIAL,
    "initials" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ibge_code" INTEGER,
    "country_code" INTEGER,
    "area_code" JSONB,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms_and_conditions" (
"id" SERIAL,
    "content" TEXT NOT NULL,
    "publish_date" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
"id" SERIAL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cpf" TEXT,
    "phone_number" TEXT NOT NULL,
    "email" TEXT,
    "active" BOOLEAN NOT NULL,
    "creation_date" TIMESTAMP(3) NOT NULL,
    "access_date" TIMESTAMP(3) NOT NULL,
    "update_date" TIMESTAMP(3) NOT NULL,
    "yellow_threshold" DECIMAL(65,30) NOT NULL DEFAULT 10.0,
    "red_threshold" DECIMAL(65,30) NOT NULL DEFAULT 31.6,
    "fcm_token" TEXT,
    "avatar" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_accepted_privacy_policy" (
"id" SERIAL,
    "accepted_date" TIMESTAMP(3) NOT NULL,
    "id_privacy_policy" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_accepted_terms" (
"id" SERIAL,
    "accepted_date" TIMESTAMP(3) NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_terms_and_conditions" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
"id" SERIAL,
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "name_per_farm_un" ON "area"("farm_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "farm.cnpj_unique" ON "farm"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "farm.social_name_unique" ON "farm"("social_name");

-- CreateIndex
CREATE UNIQUE INDEX "name_per_area_un" ON "field"("name", "area_id");

-- CreateIndex
CREATE UNIQUE INDEX "diagnosis_plague_un" ON "infestation"("plague_id", "diagnosis_id");

-- CreateIndex
CREATE UNIQUE INDEX "plague.name_unique" ON "plague"("name");

-- CreateIndex
CREATE UNIQUE INDEX "plague.color_unique" ON "plague"("color");

-- CreateIndex
CREATE UNIQUE INDEX "quotation_checkout.quotation_id_unique" ON "quotation_checkout"("quotation_id");

-- CreateIndex
CREATE UNIQUE INDEX "role.name_unique" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "state.initials_unique" ON "state"("initials");

-- CreateIndex
CREATE UNIQUE INDEX "user.username_unique" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user.password_unique" ON "user"("password");

-- AddForeignKey
ALTER TABLE "address" ADD FOREIGN KEY("state_id")REFERENCES "state"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "area" ADD FOREIGN KEY("farm_id")REFERENCES "farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company" ADD FOREIGN KEY("address_id")REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crop" ADD FOREIGN KEY("field_id")REFERENCES "field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosis" ADD FOREIGN KEY("crop_id")REFERENCES "crop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farm" ADD FOREIGN KEY("address_id")REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field" ADD FOREIGN KEY("area_id")REFERENCES "area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "infestation" ADD FOREIGN KEY("diagnosis_id")REFERENCES "diagnosis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "infestation" ADD FOREIGN KEY("plague_id")REFERENCES "plague"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "many_quotation_modal_package_has_many_field" ADD FOREIGN KEY("id_field")REFERENCES "field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "many_quotation_modal_package_has_many_field" ADD FOREIGN KEY("id_quotation_modal_package")REFERENCES "quotation_modal_package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "many_user_has_many_farm" ADD FOREIGN KEY("farm_id")REFERENCES "farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "many_user_has_many_farm" ADD FOREIGN KEY("user_id")REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD FOREIGN KEY("user_id")REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription" ADD FOREIGN KEY("diagnosis_id")REFERENCES "diagnosis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation" ADD FOREIGN KEY("company_id")REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation" ADD FOREIGN KEY("quotation_modal_package_id")REFERENCES "quotation_modal_package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_checkout" ADD FOREIGN KEY("quotation_id")REFERENCES "quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_modal_package" ADD FOREIGN KEY("quotation_package_id")REFERENCES "quotation_package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_accepted_privacy_policy" ADD FOREIGN KEY("id_privacy_policy")REFERENCES "privacy_policy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_accepted_privacy_policy" ADD FOREIGN KEY("id_user")REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_accepted_terms" ADD FOREIGN KEY("id_terms_and_conditions")REFERENCES "terms_and_conditions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_accepted_terms" ADD FOREIGN KEY("id_user")REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD FOREIGN KEY("role_id")REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD FOREIGN KEY("user_id")REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
