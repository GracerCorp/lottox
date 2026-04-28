import { mockReset, DeepMockProxy } from "vitest-mock-extended";
import { prisma } from "@/lib/prisma";
import { beforeEach } from "vitest";

export const prismaMock = prisma as unknown as DeepMockProxy<typeof prisma>;

beforeEach(() => {
  mockReset(prismaMock);
});

beforeEach(() => {
  mockReset(prismaMock);
});
