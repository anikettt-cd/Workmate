import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

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
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { theme } = await request.json();

    if (!theme || !['LIGHT', 'DARK'].includes(theme)) {
      return NextResponse.json(
        { error: 'Invalid theme. Must be LIGHT or DARK' },
        { status: 400 }
      );
    }

    // Update user theme
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { theme },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        theme: true,
        imageUrl: true
      }
    });

    return NextResponse.json({
      message: 'Theme updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update theme error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
