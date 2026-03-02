import { getRedisClient } from '@/lib/redis';
import { NextResponse } from 'next/server';

// GET: Fetch all or specific keys from the cloud database
export async function GET(request: Request) {
    try {
        const redis = await getRedisClient();
        const { searchParams } = new URL(request.url);
        const keysParam = searchParams.get('keys');

        if (!keysParam) {
            return NextResponse.json({});
        }

        const keys = keysParam.split(',');
        const results: Record<string, any> = {};

        for (const key of keys) {
            const val = await redis.get(key);
            if (val) {
                try {
                    // Redis standard client returns strings, so we parse if it's JSON
                    results[key] = JSON.parse(val);
                } catch {
                    results[key] = val;
                }
            }
        }

        return NextResponse.json(results);
    } catch (error: any) {
        console.error("Redis fetch error:", error);
        return NextResponse.json({}, { status: 200 });
    }
}

// POST: Save a key-value pair to the cloud database
export async function POST(request: Request) {
    try {
        const redis = await getRedisClient();
        const { key, value } = await request.json();

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        // Store as stringified JSON for compatibility
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        await redis.set(key, stringValue);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Redis save error:", error);
        return NextResponse.json({ error: 'Failed to save to redis' }, { status: 500 });
    }
}
