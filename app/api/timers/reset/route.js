import { NextResponse } from 'next/server';
import { getTimers, putTimers } from '../../utils/blob';

/**
 * @description 重置定时器的API路由
 * @returns {Promise<NextResponse>} API响应
 */
export async function POST(request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: '无效的定时器ID' }, 
        { status: 400 }
      );
    }
    
    const timers = await getTimers();
    const timerIndex = timers.findIndex(timer => timer.id === id);
    
    if (timerIndex === -1) {
      return NextResponse.json(
        { error: '定时器不存在' }, 
        { status: 404 }
      );
    }
    
    const timer = timers[timerIndex];
    const now = new Date();
    const endDate = new Date(now.getTime() + timer.days * 24 * 60 * 60 * 1000);
    
    const updatedTimer = {
      ...timer,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      updatedAt: now.toISOString()
    };
    
    const updatedTimers = [...timers];
    updatedTimers[timerIndex] = updatedTimer;
    
    // 使用乐观锁进行写入
    await putTimers(updatedTimers);
    
    return NextResponse.json({ 
      success: true, 
      timer: updatedTimer 
    });
  } catch (error) {
    console.error('重置定时器失败:', error);
    return NextResponse.json(
      { error: '重置定时器时发生错误' }, 
      { status: 500 }
    );
  }
} 