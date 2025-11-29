import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

// GET /api/messages - Get messages between users
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
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get messages between current user and specified user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: decoded.userId,
            receiverId: parseInt(userId)
          },
          {
            senderId: parseInt(userId),
            receiverId: decoded.userId
          }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: parseInt(userId),
        receiverId: decoded.userId,
        isRead: false
      },
      data: { isRead: true }
    });

    return NextResponse.json({ messages });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Send a new message
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

    const { receiverId, message, jobId } = await request.json();

    if (!receiverId || !message) {
      return NextResponse.json(
        { error: 'Receiver ID and message are required' },
        { status: 400 }
      );
    }

    // Create message
    const newMessage = await prisma.message.create({
      data: {
        senderId: decoded.userId,
        receiverId: parseInt(receiverId),
        content: message,
        jobId: jobId ? parseInt(jobId) : null
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Message sent successfully',
      newMessage
    }, { status: 201 });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
