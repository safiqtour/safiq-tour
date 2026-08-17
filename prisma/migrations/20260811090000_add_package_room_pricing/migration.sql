-- AlterTable — optional room-based pricing for packages (nullable, no default,
-- fully backward compatible: existing rows get NULL = "not offered").
ALTER TABLE "packages" ADD COLUMN     "quadPrice" INTEGER,
ADD COLUMN     "triplePrice" INTEGER,
ADD COLUMN     "doublePrice" INTEGER;
