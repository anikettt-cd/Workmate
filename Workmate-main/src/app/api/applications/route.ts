import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

// GET /api/applications - Get applications for a user or job
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization') ?? undefined);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const userId = searchParams.get('userId');
    const contractor = searchParams.get('contractor');

    let applications;

    if (decoded.role === 'contractor') {
      if (jobId) {
        // Contractor viewing applications for a specific job
        applications = await prisma.application.findMany({
          where: { jobId: parseInt(jobId) },
          include: {
            labourer: {
              select: {
                id: true,
                name: true,
                skills: true,
                experience: true,
                location: true,
                imageUrl: true
              }
            },
            job: {
              select: {
                id: true,
                title: true
              }
            }
          },
          orderBy: { id: 'desc' }
        });
      } else if (contractor === 'true') {
        // Contractor viewing all applications for their jobs
        applications = await prisma.application.findMany({
          where: {
            job: {
              contractorId: decoded.userId
            }
          },
          include: {
            labourer: {
              select: {
                id: true,
                name: true,
                skills: true,
                experience: true,
                location: true,
                imageUrl: true
              }
            },
            job: {
              select: {
                id: true,
                title: true,
                description: true,
                wage: true,
                location: true,
                duration: true
              }
            }
          },
          orderBy: { id: 'desc' }
        });
      } else {
        return NextResponse.json(
          { error: 'Invalid request parameters for contractor' },
          { status: 400 }
        );
      }
    } else if (decoded.role === 'labourer' && userId) {
      // Job seeker viewing their own applications
      applications = await prisma.application.findMany({
        where: { labourerId: parseInt(userId) },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              description: true,
              skill: true,
              wage: true,
              location: true,
              duration: true,
              contractor: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true
                }
              }
            }
          }
        },
        orderBy: { id: 'desc' }
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    return NextResponse.json({ applications });

  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/applications - Apply for a job
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization') ?? undefined);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'labourer') {
      return NextResponse.json(
        { error: 'Only job seekers can apply for jobs' },
        { status: 403 }
      );
    }

    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Check if already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: parseInt(jobId),
        labourerId: decoded.userId
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Already applied for this job' },
        { status: 409 }
      );
    }

    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) }
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId: parseInt(jobId),
        labourerId: decoded.userId,
        status: 'PENDING'
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            contractor: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        labourer: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Application submitted successfully',
      application
    }, { status: 201 });

  } catch (error) {
    console.error('Create application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/applications - Update application status
export async function PATCH(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization') ?? undefined);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'contractor') {
      return NextResponse.json(
        { error: 'Only contractors can update application status' },
        { status: 403 }
      );
    }

    const { applicationId, status } = await request.json();

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: 'Application ID and status are required' },
        { status: 400 }
      );
    }

    if (!['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update application
    const application = await prisma.application.update({
      where: { id: parseInt(applicationId) },
      data: { status },
      include: {
        job: {
          select: {
            id: true,
            title: true
          }
        },
        labourer: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Application status updated successfully',
      application
    });

  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
