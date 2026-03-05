import prisma from '../config/db.config';

export const salaryService = {
  async recordSalary(companyId: string, data: any) {
    return await prisma.salary.create({
      data: {
        userId: data.userId, // The staff receiving the money
        companyId: companyId,
        amount: parseFloat(data.amount),
        month: parseInt(data.month),
        year: parseInt(data.year),
        status: data.status,
        paymentMethod: data.paymentMethod,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
        notes: data.notes
      }
    });
  },

  async getCompanySalaries(companyId: string) {
    return await prisma.salary.findMany({
      where: { companyId },
      include: {
        user: { select: { id: true, email: true, metadata: true } }
      },
      orderBy: { paymentDate: 'desc' }
    });
  }
};