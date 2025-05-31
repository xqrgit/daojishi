import { NextResponse } from 'next/server';
import { getTimers } from '../utils/blob';

/**
 * @description 获取所有定时器数据的API路由
 * @returns {Promise<NextResponse>} API响应
 */
export async function GET() {
  try {
    const timers = await getTimers();
    return NextResponse.json(timers);
  } catch (error) {
    console.error('获取定时器失败:', error);
    return NextResponse.json(
      { error: '获取定时器数据时发生错误' }, 
      { status: 500 }
    );
  }
} 