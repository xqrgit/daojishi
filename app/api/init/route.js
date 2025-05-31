import { NextResponse } from 'next/server';
import { initTimersStorage } from '../utils/blob';

/**
 * @description 初始化Blob存储的API路由
 * @returns {Promise<NextResponse>} API响应
 */
export async function POST() {
  try {
    await initTimersStorage();
    return NextResponse.json({ success: true, message: 'Blob存储已初始化' });
  } catch (error) {
    console.error('初始化Blob存储失败:', error);
    return NextResponse.json(
      { error: '初始化Blob存储时发生错误' },
      { status: 500 }
    );
  }
} 