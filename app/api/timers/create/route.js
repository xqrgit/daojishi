import { NextResponse } from 'next/server';
import { getTimers, putTimers } from '../../utils/blob';

/**
 * @description 验证定时器输入数据
 * @param {string} name 定时器名称
 * @param {number} days 天数
 * @returns {boolean} 是否有效
 */
function isValidInput(name, days) {
  return (
    name && 
    typeof name === 'string' && 
    name.length >= 1 && 
    name.length <= 100 &&
    days !== undefined && 
    !isNaN(days) && 
    days >= 0 && 
    days <= 5000
  );
}

/**
 * @description 创建新定时器的API路由
 * @returns {Promise<NextResponse>} API响应
 */
export async function POST(request) {
  try {
    console.log('收到创建定时器请求');
    const { id, name, days } = await request.json();
    console.log('创建参数:', { id, name, days });
    
    if (!isValidInput(name, days)) {
      console.error('无效的输入参数');
      return NextResponse.json(
        { error: '无效的输入参数' }, 
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
    
    const now = new Date();
    const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    const newTimer = {
      id,
      name,
      days: Number(days),
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      createdAt: now.toISOString()
    };
    
    console.log('准备存储新定时器:', newTimer);
    
    // 使用乐观锁进行写入
    const result = await putTimers([...timers, newTimer]);
    console.log('存储成功, URL:', result.url);
    
    return NextResponse.json({ success: true, timer: newTimer });
  } catch (error) {
    console.error('创建定时器失败:', error);
    return NextResponse.json(
      { error: '创建定时器时发生错误' }, 
      { status: 500 }
    );
  }
} 