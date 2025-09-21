import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { neon } from '@neondatabase/serverless';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string;
    const altText = formData.get('altText') as string || '';
    const description = formData.get('description') as string || '';
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const isPublic = formData.get('isPublic') === 'true';

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        message: 'No file provided' 
      }, { status: 400 });
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${randomUUID()}.${fileExtension}`;
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'media');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Save file to disk
    const filePath = join(uploadDir, uniqueFilename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate URLs
    const storageUrl = `/uploads/media/${uniqueFilename}`;
    let thumbnailUrl = null;

    // For images, we could generate thumbnails here
    // For now, we'll use the original image as thumbnail for images
    if (fileType === 'image') {
      thumbnailUrl = storageUrl;
    }

    // Save to database
    const result = await sql`
      INSERT INTO media_assets (
        filename,
        original_filename,
        file_type,
        mime_type,
        file_size,
        storage_url,
        thumbnail_url,
        alt_text,
        description,
        tags,
        is_public,
        uploaded_by,
        usage_count
      ) VALUES (
        ${uniqueFilename},
        ${file.name},
        ${fileType},
        ${file.type},
        ${file.size},
        ${storageUrl},
        ${thumbnailUrl},
        ${altText},
        ${description},
        ${JSON.stringify(tags)},
        ${isPublic},
        ${userId},
        0
      )
      RETURNING 
        id,
        filename,
        original_filename,
        file_type,
        mime_type,
        file_size,
        storage_url,
        thumbnail_url,
        alt_text,
        description,
        tags,
        is_public,
        usage_count,
        created_at,
        updated_at
    `;

    const mediaFile = {
      id: result[0].id,
      filename: result[0].filename,
      originalFilename: result[0].original_filename,
      fileType: result[0].file_type,
      mimeType: result[0].mime_type,
      fileSize: result[0].file_size,
      storageUrl: result[0].storage_url,
      thumbnailUrl: result[0].thumbnail_url,
      altText: result[0].alt_text,
      description: result[0].description,
      tags: result[0].tags || [],
      isPublic: result[0].is_public,
      usageCount: result[0].usage_count,
      createdAt: result[0].created_at,
      updatedAt: result[0].updated_at
    };

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      file: mediaFile
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
