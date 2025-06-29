import { Request, Response } from "express";

export class HealthController {
  public getHealth = (req: Request, res: Response) => {
    res.json({
      status: "OK",
      message: "Silverlight Backend is running",
      timestamp: new Date().toISOString(),
    });
  };
}
