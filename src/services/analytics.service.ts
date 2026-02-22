import prisma from '../config/db.config';

export const analyticsService = {

async getAdminAnalytics(userId: string) {

  const admin = await prisma.user.findUnique({
    where: { id: userId },
    include: { managedCompany: true }
  });

  if (!admin?.managedCompany)
    throw new Error("Workspace not found");

  const companyId = admin.managedCompany.id;

  const now = new Date();

  const startOfDay = new Date(now); startOfDay.setHours(0,0,0,0);
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0,0,0,0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth()-1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  /* ================= SALES AGGREGATES ================= */

  const [
    daily,
    weekly,
    monthly,
    yearly,

    dailyCash,
    dailyOnline,
    monthlyCash,
    monthlyOnline,

    totalOrdersToday,
    totalOrdersMonth,
    totalOrdersYear,

    monthlyDiscount,
    yearlyDiscount,

    lastMonthRevenue
  ] = await Promise.all([

    prisma.sale.aggregate({ _sum:{ totalAmount:true }, where:{ staff:{ companyId }, createdAt:{ gte:startOfDay }}}),
    prisma.sale.aggregate({ _sum:{ totalAmount:true }, where:{ staff:{ companyId }, createdAt:{ gte:startOfWeek }}}),
    prisma.sale.aggregate({ _sum:{ totalAmount:true }, where:{ staff:{ companyId }, createdAt:{ gte:startOfMonth }}}),
    prisma.sale.aggregate({ _sum:{ totalAmount:true }, where:{ staff:{ companyId }, createdAt:{ gte:startOfYear }}}),

    prisma.sale.aggregate({ _sum:{ totalAmount:true }, where:{ staff:{ companyId }, createdAt:{ gte:startOfDay }, paymentMethod:"CASH"}}),
    prisma.sale.aggregate({ _sum:{ totalAmount:true }, where:{ staff:{ companyId }, createdAt:{ gte:startOfDay }, paymentMethod:"ONLINE"}}),

    prisma.sale.aggregate({ _sum:{ totalAmount:true }, where:{ staff:{ companyId }, createdAt:{ gte:startOfMonth }, paymentMethod:"CASH"}}),
    prisma.sale.aggregate({ _sum:{ totalAmount:true }, where:{ staff:{ companyId }, createdAt:{ gte:startOfMonth }, paymentMethod:"ONLINE"}}),

    prisma.sale.count({ where:{ staff:{ companyId }, createdAt:{ gte:startOfDay }}}),
    prisma.sale.count({ where:{ staff:{ companyId }, createdAt:{ gte:startOfMonth }}}),
    prisma.sale.count({ where:{ staff:{ companyId }, createdAt:{ gte:startOfYear }}}),

    prisma.sale.aggregate({ _sum:{ discountAmount:true }, where:{ staff:{ companyId }, createdAt:{ gte:startOfMonth }}}),
    prisma.sale.aggregate({ _sum:{ discountAmount:true }, where:{ staff:{ companyId }, createdAt:{ gte:startOfYear }}}),

    prisma.sale.aggregate({ _sum:{ totalAmount:true }, where:{ staff:{ companyId }, createdAt:{ gte:startOfLastMonth, lte:endOfLastMonth }}})
  ]);

  /* ================= AVERAGE ORDER ================= */

  const avgOrderValue =
    totalOrdersMonth > 0
      ? (monthly._sum.totalAmount || 0) / totalOrdersMonth
      : 0;

  /* ================= GROWTH ================= */

  const currentMonth = monthly._sum.totalAmount || 0;
  const previousMonth = lastMonthRevenue._sum.totalAmount || 0;

  const monthlyGrowthPercent =
    previousMonth > 0
      ? ((currentMonth - previousMonth) / previousMonth) * 100
      : 0;

  const isGrowing = monthlyGrowthPercent >= 0;

  /* ================= LAST 7 DAYS TREND ================= */

  const last7Days = [];
  for (let i=6; i>=0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const start = new Date(date); start.setHours(0,0,0,0);
    const end = new Date(date); end.setHours(23,59,59,999);

    const revenue = await prisma.sale.aggregate({
      _sum:{ totalAmount:true },
      where:{ staff:{ companyId }, createdAt:{ gte:start, lte:end }}
    });

    last7Days.push({
      date: date.toLocaleDateString(),
      revenue: revenue._sum.totalAmount || 0
    });
  }

  /* ================= LAST 12 MONTHS TREND ================= */

  const last12Months = [];
  for (let i=11; i>=0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth()-i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth()-i+1, 0);

    const revenue = await prisma.sale.aggregate({
      _sum:{ totalAmount:true },
      where:{ staff:{ companyId }, createdAt:{ gte:monthStart, lte:monthEnd }}
    });

    last12Months.push({
      month: monthStart.toLocaleString('default',{ month:'short' }),
      revenue: revenue._sum.totalAmount || 0
    });
  }

  /* ================= STAFF RANKING ================= */

  const staffRankingRaw = await prisma.sale.groupBy({
    by:['staffId'],
    _sum:{ totalAmount:true },
    where:{ staff:{ companyId }},
    orderBy:{ _sum:{ totalAmount:'desc' }}
  });

  const staffRanking = await Promise.all(
    staffRankingRaw.map(async s => {
      const user = await prisma.user.findUnique({ where:{ id:s.staffId }});
      return {
        name: user?.email || "Unknown",
        revenue: s._sum.totalAmount || 0
      };
    })
  );

  return {
    daily: daily._sum.totalAmount || 0,
    weekly: weekly._sum.totalAmount || 0,
    monthly: monthly._sum.totalAmount || 0,
    yearly: yearly._sum.totalAmount || 0,

    dailyCash: dailyCash._sum.totalAmount || 0,
    dailyOnline: dailyOnline._sum.totalAmount || 0,

    monthlyCash: monthlyCash._sum.totalAmount || 0,
    monthlyOnline: monthlyOnline._sum.totalAmount || 0,

    totalOrdersToday,
    totalOrdersMonth,
    totalOrdersYear,

    totalDiscountMonth: monthlyDiscount._sum.discountAmount || 0,
    totalDiscountYear: yearlyDiscount._sum.discountAmount || 0,

    averageOrderValue: avgOrderValue,

    monthlyGrowthPercent,
    isGrowing,

    last7Days,
    last12Months,

    staffRanking
  };
},



  async getStaffAnalytics(userId: string) {

    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0,0,0,0);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0,0,0,0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [daily, weekly, monthly, dailyCash,
    dailyOnline,

    monthlyCash,
    monthlyOnline] = await Promise.all([

      prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: {
          staffId: userId,
          createdAt: { gte: startOfDay }
        }
      }),

      prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: {
          staffId: userId,
          createdAt: { gte: startOfWeek }
        }
      }),

      prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: {
          staffId: userId,
          createdAt: { gte: startOfMonth }
        }
      }),

      prisma.sale.aggregate({
      _sum: { totalAmount: true },
      where: {
        staffId: userId,
        createdAt: { gte: startOfDay },
        paymentMethod: "CASH"
      }
    }),

    prisma.sale.aggregate({
      _sum: { totalAmount: true },
      where: {
        staffId: userId,
        createdAt: { gte: startOfDay },
        paymentMethod: "ONLINE"
      }
    }),

    prisma.sale.aggregate({
      _sum: { totalAmount: true },
      where: {
        staffId: userId,
        createdAt: { gte: startOfMonth },
        paymentMethod: "CASH"
      }
    }),

    prisma.sale.aggregate({
      _sum: { totalAmount: true },
      where: {
        staffId: userId,
        createdAt: { gte: startOfMonth },
        paymentMethod: "ONLINE"
      }
    })

    ]);

    return {
      daily: daily._sum.totalAmount || 0,
      weekly: weekly._sum.totalAmount || 0,
      monthly: monthly._sum.totalAmount || 0,

      dailyCash: dailyCash._sum.totalAmount || 0,
      dailyOnline: dailyOnline._sum.totalAmount || 0,

      monthlyCash: monthlyCash._sum.totalAmount || 0,
      monthlyOnline: monthlyOnline._sum.totalAmount || 0
    };
  }

};
