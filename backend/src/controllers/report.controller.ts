import { Request, Response, NextFunction } from 'express';
import { createReportService, getReportsService, verifyReportService } from '../services/report.service';

export const submitReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newReport = await createReportService(req.body, req.user?.walletAddress);
    res.status(201).json(newReport);
  } catch (err) {
    next(err);
  }
};

export const listReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, perPage = 20, status } = req.query;
    const reports = await getReportsService({
      page: Number(page),
      perPage: Number(perPage),
      status: status as string | undefined
    });
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

export const verifyReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;
    const result = await verifyReportService(id, verified);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
