import { getRedisClient } from '@/lib/redis';
import { NextResponse } from 'next/server';

export const POST = async () => {
    try {
        const redis = await getRedisClient();
        // Fetch data from Redis
        const result = await redis.get("item");

        // Return the result in the response
        return new NextResponse(JSON.stringify({ result }), { status: 200 });
    } catch (error: any) {
        console.error("Redis Error:", error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
