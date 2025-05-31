import { NextResponse } from 'next/server';
import { getTimers } from '../utils/blob';

/**
 * @description 获取所有定时器数据的API路由
 * @returns {Promise<NextResponse>} API响应
 */
export async function GET() {
  try {
    console.log('处理获取定时器列表请求');
    const timers = await getTimers();
    console.log(`API返回${timers.length}个定时器`);
    return NextResponse.json(timers);
  } catch (error) {
    console.error('获取定时器API错误:', error);
    return NextResponse.json(
      { error: error.message || '获取定时器数据时发生错误' }, 
      { status: 500 }
    );
  }
} 