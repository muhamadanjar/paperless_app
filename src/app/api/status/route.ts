import { NextResponse } from 'next/server';
import db from '@/db'; 
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: ServiceHealth;
  };
  uptime: number;
}

interface ServiceHealth {
  status: 'up' | 'down';
  responseTime?: number;
  error?: string;
}

async function checkDatabase(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    return {
      status: 'up',
      responseTime: Date.now() - start
    };
  } catch (error) {
    return {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}



export async function GET() {
  try {
    const [dbHealth] = await Promise.all([
      checkDatabase(),
    ]);

    const allHealthy = dbHealth.status === 'up';
    const anyDown = dbHealth.status === 'down';

    const healthStatus: HealthStatus = {
      status: allHealthy ? 'healthy' : anyDown ? 'unhealthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
      },
      uptime: process.uptime()
    };

    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;

    return NextResponse.json(healthStatus, { status: statusCode });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}