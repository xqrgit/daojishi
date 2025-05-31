import { NextResponse } from 'next/server';
import { resetTimer } from '../../utils/blob';

/**
 * @description 重置定时器的API路由
 * @returns {Promise<NextResponse>} API响应
 */
export async function POST(request) {
  try {
    console.log('处理重置定时器请求');
    const { id } = await request.json();
    
    if (!id) {
      console.error('无效的定时器ID');
      return NextResponse.json(
        { error: '无效的定时器ID' }, 
        { status: 400 }
      );
    }
    
    // 使用新的重置定时器函数
    const updatedTimer = await resetTimer(id);
    console.log('定时器重置成功');
    
    return NextResponse.json({ 
      success: true, 
      timer: updatedTimer 
    });
  } catch (error) {
    console.error('重置定时器API错误:', error);
    
    // 检查是否是"定时器不存在"错误
    if (error.message === '定时器不存在') {
      return NextResponse.json(
        { error: '定时器不存在' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || '重置定时器时发生错误' }, 
      { status: 500 }
    );
  }
} 