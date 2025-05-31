import { NextResponse } from 'next/server';
import { addTimer } from '../../utils/blob';

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
    console.log('处理创建定时器请求');
    const { id, name, days } = await request.json();
    console.log('创建参数:', { id, name, days });
    
    if (!isValidInput(name, days)) {
      console.error('无效的输入参数');
      return NextResponse.json(
        { error: '无效的输入参数' }, 
        { status: 400 }
      );
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
    
    // 使用新的添加定时器函数
    await addTimer(newTimer);
    console.log('定时器创建成功');
    
    return NextResponse.json({ success: true, timer: newTimer });
  } catch (error) {
    console.error('创建定时器API错误:', error);
    return NextResponse.json(
      { error: error.message || '创建定时器时发生错误' }, 
      { status: 500 }
    );
  }
} 