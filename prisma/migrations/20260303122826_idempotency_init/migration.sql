-- CreateTable
CREATE TABLE "Idempotency" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Idempotency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Idempotency_key_key" ON "Idempotency"("key");
