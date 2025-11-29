import { prisma } from './prisma';

export interface RecommendationScore {
  score: number;
  reason: string;
}

export interface JobWithScore {
  id: number;
  title: string;
  description: string;
  skill: string;
  wage: number;
  location: string;
  duration: string;
  contractorId: number;
  imageUrl?: string;
  createdAt: Date;
  contractor?: {
    name: string;
    ratings: any[];
  };
  matchScore: number;
  reason: string;
}

export interface LabourerWithScore {
  id: number;
  name: string;
  skills?: string;
  experience?: number;
  location?: string;
  imageUrl?: string;
  ratings: any[];
  matchScore: number;
  reason: string;
}

export async function getJobRecommendationsForLabourer(labourerId: number): Promise<JobWithScore[]> {
  const labourer = await prisma.user.findUnique({
    where: { id: labourerId },
    select: { skills: true, experience: true, location: true }
  });

  if (!labourer) return [];

  const jobs = await prisma.job.findMany({
    where: {
      applications: {
        none: {
          labourerId: labourerId
        }
      }
    },
    include: {
      contractor: {
        select: { name: true, ratings: true }
      }
    }
  });

  return jobs.map((job: any) => {
    const score = calculateJobMatchScore(job, labourer);
    return { ...job, matchScore: score.score, reason: score.reason };
  }).sort((a: JobWithScore, b: JobWithScore) => b.matchScore - a.matchScore);
}

export async function getLabourerRecommendationsForJob(jobId: number): Promise<LabourerWithScore[]> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { skill: true, location: true }
  });

  if (!job) return [];

  const labourers = await prisma.user.findMany({
    where: {
      role: 'labourer',
      applications: {
        none: {
          jobId: jobId
        }
      }
    },
    select: {
      id: true,
      name: true,
      skills: true,
      experience: true,
      location: true,
      imageUrl: true,
      ratings: true
    }
  });

  return labourers.map((labourer: any) => {
    const score = calculateLabourerMatchScore(job, labourer);
    return { ...labourer, matchScore: score.score, reason: score.reason };
  }).sort((a: LabourerWithScore, b: LabourerWithScore) => b.matchScore - a.matchScore);
}

function calculateJobMatchScore(job: any, labourer: any): RecommendationScore {
  let score = 0;
  let reasons: string[] = [];

  // Skill match (40% weight)
  if (labourer.skills && job.skill) {
    const skillMatch = calculateSkillMatch(labourer.skills, job.skill);
    score += skillMatch * 0.4;
    reasons.push(`Skill match: ${Math.round(skillMatch * 100)}%`);
  }

  // Experience bonus (20% weight)
  if (labourer.experience) {
    const experienceScore = Math.min(labourer.experience / 10, 1) * 0.2;
    score += experienceScore;
    reasons.push(`Experience: ${labourer.experience} years`);
  }

  // Location match (30% weight)
  if (labourer.location && job.location) {
    const locationMatch = calculateLocationMatch(labourer.location, job.location);
    score += locationMatch * 0.3;
    reasons.push(`Location match: ${Math.round(locationMatch * 100)}%`);
  }

  // Contractor rating (10% weight)
  if (job.contractor?.ratings?.length > 0) {
    const avgRating = job.contractor.ratings.reduce((acc: number, r: any) => acc + r.score, 0) / job.contractor.ratings.length;
    score += (avgRating / 5) * 0.1;
    reasons.push(`Contractor rating: ${avgRating.toFixed(1)}/5`);
  }

  return {
    score: Math.round(score * 100) / 100,
    reason: reasons.join(', ')
  };
}

function calculateLabourerMatchScore(job: any, labourer: any): RecommendationScore {
  let score = 0;
  let reasons: string[] = [];

  // Skill match (50% weight)
  if (labourer.skills && job.skill) {
    const skillMatch = calculateSkillMatch(labourer.skills, job.skill);
    score += skillMatch * 0.5;
    reasons.push(`Skill match: ${Math.round(skillMatch * 100)}%`);
  }

  // Experience bonus (30% weight)
  if (labourer.experience) {
    const experienceScore = Math.min(labourer.experience / 10, 1) * 0.3;
    score += experienceScore;
    reasons.push(`Experience: ${labourer.experience} years`);
  }

  // Location match (20% weight)
  if (labourer.location && job.location) {
    const locationMatch = calculateLocationMatch(labourer.location, job.location);
    score += locationMatch * 0.2;
    reasons.push(`Location match: ${Math.round(locationMatch * 100)}%`);
  }

  return {
    score: Math.round(score * 100) / 100,
    reason: reasons.join(', ')
  };
}

function calculateSkillMatch(labourerSkills: string, jobSkill: string): number {
  const labourerSkillList = labourerSkills.toLowerCase().split(',').map(s => s.trim());
  const jobSkillList = jobSkill.toLowerCase().split(',').map(s => s.trim());
  
  let matches = 0;
  for (const skill of jobSkillList) {
    if (labourerSkillList.some(ls => ls.includes(skill) || skill.includes(ls))) {
      matches++;
    }
  }
  
  return matches / jobSkillList.length;
}

function calculateLocationMatch(labourerLocation: string, jobLocation: string): number {
  const labourerLoc = labourerLocation.toLowerCase();
  const jobLoc = jobLocation.toLowerCase();
  
  if (labourerLoc === jobLoc) return 1;
  if (labourerLoc.includes(jobLoc) || jobLoc.includes(labourerLoc)) return 0.8;
  if (labourerLoc.split(' ').some(word => jobLoc.includes(word))) return 0.6;
  
  return 0.3;
}
