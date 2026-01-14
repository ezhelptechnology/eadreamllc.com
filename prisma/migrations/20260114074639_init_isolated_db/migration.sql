-- CreateTable
CREATE TABLE "CateringRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "favoriteDishes" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING'
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "estimatedCost" REAL NOT NULL,
    "finalPrice" REAL,
    "requestId" TEXT NOT NULL,
    CONSTRAINT "Menu_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "CateringRequest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_requestId_key" ON "Menu"("requestId");
