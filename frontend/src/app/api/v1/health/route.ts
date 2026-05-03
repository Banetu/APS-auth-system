import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('[Health] Check starting...');
    
    // 1. Check DATABASE_URL
    const databaseUrl = process.env.DATABASE_URL;
    console.log('[Health] DATABASE_URL exists:', !!databaseUrl);
    
    if (!databaseUrl) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'DATABASE_URL not configured',
          duration: Date.now() - startTime 
        },
        { status: 500 }
      );
    }

    // 2. Parse URL
    try {
      const urlObj = new URL(databaseUrl);
      console.log('[Health] Database host:', urlObj.hostname);
      console.log('[Health] Database port:', urlObj.port || '5432');
    } catch (e) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Invalid DATABASE_URL format',
          duration: Date.now() - startTime 
        },
        { status: 500 }
      );
    }

    // 3. Attempt actual connection with enhanced error handling
    console.log('[Health] Attempting database connection...');
    
    try {
      const { Pool } = await import('pg');
      
      // Create pool with optimized settings for Vercel serverless
      const pool = new Pool({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 10000,
        max: 1, // Minimize connections in serverless
        application_name: 'health-check',
      });

      console.log('[Health] Pool created, attempting query...');
      const result = await pool.query('SELECT NOW() as current_time');
      
      const serverTime = result.rows[0].current_time;
      await pool.end();
      
      console.log('[Health] Success:', serverTime);
      
      return NextResponse.json({
        status: 'ok',
        database: 'connected',
        server_time: serverTime,
        duration_ms: Date.now() - startTime,
        environment: process.env.NODE_ENV || 'unknown',
      });
    } catch (pgError) {
      const errorMsg = pgError instanceof Error ? pgError.message : String(pgError);
      console.error('[Health] Database Error:', errorMsg);
      
      // Return degraded status instead of hard error to allow graceful degradation
      return NextResponse.json(
        { 
          status: 'degraded',
          database: 'unavailable',
          message: `Database temporarily unavailable: ${errorMsg}`,
          duration_ms: Date.now() - startTime,
          environment: process.env.NODE_ENV || 'unknown',
        },
        { status: 200 } // Return 200 OK to indicate service is still operational
      );
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Health] Fatal error:', errorMsg);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: `Health check failed: ${errorMsg}`,
        duration: Date.now() - startTime 
      },
      { status: 503 }
    );
  }
}


