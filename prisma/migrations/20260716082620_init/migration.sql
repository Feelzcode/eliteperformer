-- CreateTable
CREATE TABLE "SiteContent" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "profilePhoto" TEXT,
    "video1Caption" TEXT NOT NULL DEFAULT 'A STRATEGY THAT WORKS',
    "video1Type" TEXT NOT NULL DEFAULT 'youtube',
    "video1Url" TEXT,
    "video2Caption" TEXT NOT NULL DEFAULT 'AND STAY CONSISTENTLY BOOKED',
    "video2Type" TEXT NOT NULL DEFAULT 'youtube',
    "video2Url" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registrant" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "creditScore" TEXT,
    "hasCapital" TEXT,
    "timeline" TEXT,
    "strExperience" TEXT,
    "learningGoal" TEXT,
    "zoomJoinUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registrant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Registrant_email_idx" ON "Registrant"("email");
