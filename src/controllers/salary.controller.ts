import { Request, Response } from 'express';
import { salaryService } from '../services/salary.service';

export const recordSalary = async (req: any, res: Response) => {
  try {
    // Only Admins managing a company can pay staff
    const companyId = req.user.managedCompany?.id;
    if (!companyId)  res.status(400).json({ message: "Admin workspace not found." });

    const salary = await salaryService.recordSalary(companyId, req.body);
    res.status(201).json({ success: true, data: salary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchSalaries = async (req: any, res: Response) => {
  try {
    const companyId = req.user.managedCompany?.id;
    if (!companyId)  res.status(400).json({ message: "Admin workspace not found." });

    const salaries = await salaryService.getCompanySalaries(companyId);
    res.json({ success: true, data: salaries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};