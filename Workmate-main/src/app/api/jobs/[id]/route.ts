import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

// GET /api/jobs/[id] - Get a specific job
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = parseInt(params.id);

    if (isNaN(jobId)) {
      return NextResponse.json(
        { error: 'Invalid job ID' },
        { status: 400 }
      );
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        contractor: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            ratings: true
          }
        },
        applications: {
          include: {
            labourer: {
              select: {
                id: true,
                name: true,
                skills: true,
                experience: true,
                imageUrl: true
              }
            }
          }
        }
      }
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ job });

  } catch (error) {
    console.error('Get job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/jobs/[id] - Update a job
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        { error: 'Only contractors can update jobs' },
        { status: 403 }
      );
    }

    const jobId = parseInt(params.id);

    if (isNaN(jobId)) {
      return NextResponse.json(
        { error: 'Invalid job ID' },
        { status: 400 }
      );
    }

    // Check if job exists and belongs to the contractor
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (existingJob.contractorId !== decoded.userId) {
      return NextResponse.json(
        { error: 'You can only update your own jobs' },
        { status: 403 }
      );
    }

    const { title, description, skill, category, wage, location, duration, tags, status } = await request.json();

    // Validate input
    if (!title || !description || !skill || !category || !wage || !location || !duration) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Update job
    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        title,
        description,
        skill,
        category,
        wage: parseFloat(wage),
        location,
        duration,
        tags,
        status: status || existingJob.status
      },
      include: {
        contractor: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Job updated successfully',
      job
    });

  } catch (error) {
    console.error('Update job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Delete a job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        { error: 'Only contractors can delete jobs' },
        { status: 403 }
      );
    }

    const jobId = parseInt(params.id);

    if (isNaN(jobId)) {
      return NextResponse.json(
        { error: 'Invalid job ID' },
        { status: 400 }
      );
    }

    // Check if job exists and belongs to the contractor
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (existingJob.contractorId !== decoded.userId) {
      return NextResponse.json(
        { error: 'You can only delete your own jobs' },
        { status: 403 }
      );
    }

    // Delete job (this will cascade delete applications and ratings)
    await prisma.job.delete({
      where: { id: jobId }
    });

    return NextResponse.json({
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Delete job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
