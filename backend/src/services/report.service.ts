import prisma from '../config/prisma';

export const createReportService = async (data: any, walletAddress?: string) => {
  // Hash generation logic, validation, and blockchain call would be here
  return prisma.report.create({
    data: {
      ...data,
      walletAddress: walletAddress ?? '',
      status: 'PENDING',
      evidenceUrls: data.evidenceUrls ?? [],
    }
  });
};

export const getReportsService = async ({ page = 1, perPage = 20, status }: { page?: number, perPage?: number, status?: string }) => {
  return prisma.report.findMany({
    where: { status },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: 'desc' },
  });
};

export const verifyReportService = async (id: string, verified: boolean) => {
  return prisma.report.update({
    where: { id },
    data: {
      status: verified ? 'VERIFIED' : 'REJECTED',
      updatedAt: new Date()
    }
  });
};
