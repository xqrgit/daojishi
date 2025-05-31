import { NextResponse } from 'next/server';
import { getTimers } from '../utils/blob';

/**
 * @description 获取所有定时器数据的API路由
 * @returns {Promise<NextResponse>} API响应
 */
export async function GET() {
  try {
    console.log('收到获取定时器列表请求');
    
    // 确保获取最新数据
    let retries = 3;
    let timers = [];
    
    while (retries > 0) {
      try {
        timers = await getTimers();
        break;
      } catch (error) {
        console.error(`获取定时器失败，剩余重试次数: ${retries - 1}`, error);
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 500)); // 延迟500ms重试
      }
    }
    
    console.log(`成功获取${timers.length}个定时器数据`);
    return NextResponse.json(timers);
  } catch (error) {
    console.error('获取定时器失败:', error);
    return NextResponse.json(
      { error: '获取定时器数据时发生错误' }, 
      { status: 500 }
    );
  }
} 