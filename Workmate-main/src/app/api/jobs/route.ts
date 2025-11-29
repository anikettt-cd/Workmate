import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';
import { generateJobImage } from '@/lib/ai-images';

// GET /api/jobs - Get all jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const skill = searchParams.get('skill');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }
    if (skill) {
      where.skill = { contains: skill, mode: 'insensitive' };
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          contractor: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          },
          applications: {
            select: {
              id: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.job.count({ where })
    ]);

    // Add AI-generated images if not present
    const jobsWithImages = jobs.map(job => ({
      ...job,
      imageUrl: job.imageUrl || generateJobImage(job.id, job.title, job.skill)
    }));

    return NextResponse.json({
      jobs: jobsWithImages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job
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
    if (!decoded || decoded.role !== 'contractor') {
      return NextResponse.json(
        { error: 'Only contractors can create jobs' },
        { status: 403 }
      );
    }

    const { title, description, skill, category, wage, location, duration, tags } = await request.json();

    // Validate input
    if (!title || !description || !skill || !category || !wage || !location || !duration) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Generate AI job image
    const imageUrl = generateJobImage(Date.now(), title, skill);

    // Create job
    const job = await prisma.job.create({
      data: {
        title,
        description,
        skill,
        category,
        wage: parseFloat(wage),
        location,
        duration,
        tags,
        contractorId: decoded.userId,
        imageUrl
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
      message: 'Job created successfully',
      job
    }, { status: 201 });

  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
