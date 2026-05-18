import { RedisClientType } from '@redis/client';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let client: RedisClientType;

export const redisConnect = async() => {
    client = createClient({
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD || 'UfkFhWrk8MgQmwhTLhUWEjHP8tQ08eQs',
    socket: {
        host: process.env.REDIS_HOST || 'redis-16976.c84.us-east-1-2.ec2.cloud.redislabs.com',
        port: Number(process.env.REDIS_PORT) || 16976
    }
});

    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();

    console.log('auth service redis connected successfully');
}

const getRedisClient = () => {
    if (!client) {
        throw new Error("Redis client not initialized");
    }

    return client;
}