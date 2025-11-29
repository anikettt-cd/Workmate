import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';
import { getJobRecommendationsForLabourer, getLabourerRecommendationsForJob } from '@/lib/ai-recommendations';

// GET /api/ai/recommendations - Get AI recommendations
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
    const type = searchParams.get('type'); // 'jobs' or 'labourers'
    const id = searchParams.get('id'); // jobId or labourerId

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID parameters are required' },
        { status: 400 }
      );
    }

    let recommendations;

    if (type === 'jobs' && decoded.role === 'labourer') {
      // Get job recommendations for labourer
      recommendations = await getJobRecommendationsForLabourer(decoded.userId);
    } else if (type === 'labourers' && decoded.role === 'contractor') {
      // Get labourer recommendations for job
      recommendations = await getLabourerRecommendationsForJob(parseInt(id));
    } else {
      return NextResponse.json(
        { error: 'Invalid recommendation type or user role' },
        { status: 400 }
      );
    }

    // Limit to top 10 recommendations
    const topRecommendations = recommendations.slice(0, 10);

    return NextResponse.json({
      recommendations: topRecommendations,
      total: recommendations.length,
      type,
      userId: decoded.userId
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/ai/recommendations - Generate new recommendations
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
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { type, jobId, labourerId } = await request.json();

    if (!type) {
      return NextResponse.json(
        { error: 'Recommendation type is required' },
        { status: 400 }
      );
    }

    let recommendations;

    if (type === 'jobs' && decoded.role === 'labourer') {
      // Generate job recommendations for labourer
      recommendations = await getJobRecommendationsForLabourer(decoded.userId);
    } else if (type === 'labourers' && decoded.role === 'contractor' && jobId) {
      // Generate labourer recommendations for specific job
      recommendations = await getLabourerRecommendationsForJob(parseInt(jobId));
    } else {
      return NextResponse.json(
        { error: 'Invalid recommendation type or missing parameters' },
        { status: 400 }
      );
    }

    // Store recommendation in database for analytics
    // This could be used to improve the recommendation algorithm
    // await prisma.aIRecommendation.create({
    //   data: {
    //     userId: decoded.userId,
    //     recommendedJobId: type === 'jobs' ? null : jobId,
    //     recommendedLabourerId: type === 'labourers' ? null : labourerId,
    //     score: recommendations.length > 0 ? recommendations[0].matchScore : 0
    //   }
    // });

    return NextResponse.json({
      message: 'Recommendations generated successfully',
      recommendations: recommendations.slice(0, 10),
      total: recommendations.length,
      type,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Generate recommendations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
