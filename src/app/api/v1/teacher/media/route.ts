import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileType = searchParams.get('fileType');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Execute query with optional file type filter
    let result;
    
    if (fileType && fileType !== 'all') {
      result = await sql`
        SELECT 
          ma.id,
          ma.filename,
          ma.original_filename,
          ma.file_type,
          ma.mime_type,
          ma.file_size,
          ma.storage_url,
          ma.thumbnail_url,
          ma.alt_text,
          ma.description,
          ma.tags,
          ma.is_public,
          ma.usage_count,
          ma.created_at,
          ma.updated_at
        FROM media_assets ma
        WHERE ma.uploaded_by = ${userId} AND ma.file_type = ${fileType}
        ORDER BY ma.created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      result = await sql`
        SELECT 
          ma.id,
          ma.filename,
          ma.original_filename,
          ma.file_type,
          ma.mime_type,
          ma.file_size,
          ma.storage_url,
          ma.thumbnail_url,
          ma.alt_text,
          ma.description,
          ma.tags,
          ma.is_public,
          ma.usage_count,
          ma.created_at,
          ma.updated_at
        FROM media_assets ma
        WHERE ma.uploaded_by = ${userId}
        ORDER BY ma.created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    // Transform the results to match the expected interface
    const files = result.map(row => ({
      id: row.id,
      filename: row.filename,
      originalFilename: row.original_filename,
      fileType: row.file_type,
      mimeType: row.mime_type,
      fileSize: row.file_size,
      storageUrl: row.storage_url,
      thumbnailUrl: row.thumbnail_url,
      altText: row.alt_text,
      description: row.description,
      tags: row.tags || [],
      isPublic: row.is_public,
      usageCount: row.usage_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    return NextResponse.json({
      success: true,
      files,
      total: files.length,
      hasMore: files.length === limit
    });

  } catch (error) {
    console.error('Error loading media files:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to load media files',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
