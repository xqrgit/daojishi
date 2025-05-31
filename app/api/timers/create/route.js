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
    const { id, name, days } = await request.json();
    
    if (!isValidInput(name, days)) {
      return NextResponse.json(
        { error: '无效的输入参数' }, 
        { status: 400 }
      );
    }
    
    const timers = await getTimers();
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
    
    // 使用乐观锁进行写入
    const result = await putTimers([...timers, newTimer]);
    
    return NextResponse.json({ success: true, timer: newTimer });
  } catch (error) {
    console.error('创建定时器失败:', error);
    return NextResponse.json(
      { error: '创建定时器时发生错误' }, 
      { status: 500 }
    );
  }
} 