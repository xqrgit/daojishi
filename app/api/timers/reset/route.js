import { NextResponse } from 'next/server';
import { getTimers, putTimers } from '../../utils/blob';

/**
 * @description 重置定时器的API路由
 * @returns {Promise<NextResponse>} API响应
 */
export async function POST(request) {
  try {
    console.log('收到重置定时器请求');
    const { id } = await request.json();
    console.log('重置ID:', id);
    
    if (!id) {
      console.error('无效的定时器ID');
      return NextResponse.json(
        { error: '无效的定时器ID' }, 
        { status: 400 }
      );
    }
    
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
    
    const timerIndex = timers.findIndex(timer => timer.id === id);
    
    if (timerIndex === -1) {
      console.error('定时器不存在:', id);
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
    
    console.log('准备更新定时器:', updatedTimer);
    
    const updatedTimers = [...timers];
    updatedTimers[timerIndex] = updatedTimer;
    
    // 使用乐观锁进行写入
    const result = await putTimers(updatedTimers);
    console.log('更新成功, URL:', result.url);
    
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