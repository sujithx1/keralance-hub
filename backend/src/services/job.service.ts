import { jobRepository } from "../repositories/job.repository";
import { applicationRepository } from "../repositories/application.repository";
import { notificationRepository } from "../repositories/notification.repository";

export class JobService {
  async listJobs(filters: {
    searchQuery?: string;
    location?: string;
    remoteOnly?: boolean;
    page?: number;
    limit?: number;
  }) {
    return await jobRepository.search(filters);
  }

  async getJob(id: string) {
    const job = await jobRepository.findById(id);
    if (!job) throw new Error("Job not found");
    return job;
  }

  async createJob(createdBy: string, title: string, description: string, budget: number, category: string, deadline?: string) {
    return await jobRepository.create({
      title,
      description,
      budget: budget.toString(),
      category,
      createdBy,
      deadline: deadline ? new Date(deadline) : null,
      status: "open",
    });
  }

  async applyToJob(freelancerId: string, jobId: string, proposal: string, amount: number) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw new Error("Job not found");

    if (job.status !== "open") {
      throw new Error("Job is no longer open for applications");
    }

    const application = await applicationRepository.create({
      jobId,
      freelancerId,
      proposal,
      amount: amount.toString(),
      status: "pending",
    });

    // Notify job creator
    await notificationRepository.create({
      userId: job.createdBy,
      title: "New Job Application",
      message: `A freelancer has applied to your job: "${job.title}"`,
      type: "job_alert",
      read: false,
    });

    return application;
  }
}
export const jobService = new JobService();
