import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dirPath = searchParams.get('path');

  if (!dirPath) {
    return NextResponse.json(
      { success: false, error: 'Directory path query parameter is required' },
      { status: 400 }
    );
  }

  return inspectPath(dirPath);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dirPath = body?.path;

    if (!dirPath || typeof dirPath !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Path is required in request body' },
        { status: 400 }
      );
    }

    return inspectPath(dirPath);
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON request payload' },
      { status: 400 }
    );
  }
}

async function inspectPath(rawPath: string) {
  try {
    const trimmedPath = rawPath.trim();
    if (!trimmedPath) {
      return NextResponse.json({
        success: false,
        exists: false,
        error: 'Path cannot be empty',
      });
    }

    // Resolve path cleanly
    const resolvedPath = path.resolve(trimmedPath);

    if (!fs.existsSync(resolvedPath)) {
      return NextResponse.json({
        success: true,
        exists: false,
        path: resolvedPath,
        message: 'Directory does not exist on host filesystem. You can still save it as a designated or remote storage mount.',
      });
    }

    const stat = await fs.promises.stat(resolvedPath);
    const isDirectory = stat.isDirectory();

    // Query file system statistics
    const statfs = await fs.promises.statfs(resolvedPath);

    const bsize = BigInt(statfs.bsize);
    const blocks = BigInt(statfs.blocks);
    const bavail = BigInt(statfs.bavail);

    const totalBytes = Number(blocks * bsize);
    const freeBytes = Number(bavail * bsize);
    const usedBytes = Math.max(0, totalBytes - freeBytes);

    const BYTES_IN_GB = 1024 ** 3;
    const totalGb = Number((totalBytes / BYTES_IN_GB).toFixed(2));
    const freeGb = Number((freeBytes / BYTES_IN_GB).toFixed(2));
    const usedGb = Number((usedBytes / BYTES_IN_GB).toFixed(2));
    const usagePercent = totalBytes > 0 ? Number(((usedBytes / totalBytes) * 100).toFixed(1)) : 0;

    return NextResponse.json({
      success: true,
      exists: true,
      isDirectory,
      path: resolvedPath,
      totalBytes,
      freeBytes,
      usedBytes,
      totalGb,
      freeGb,
      usedGb,
      usagePercent,
      isHostPath: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to inspect filesystem path';
    return NextResponse.json({
      success: false,
      exists: false,
      error: message,
    });
  }
}
