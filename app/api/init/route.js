import { NextResponse } from 'next/server';
import { initStorage } from '../utils/blob';

/**
 * @description 初始化Blob存储的API路由
 * @returns {Promise<NextResponse>} API响应
 */
export async function POST() {
  try {
    const result = await initStorage();
    return NextResponse.json(result);
  } catch (error) {
    console.error('初始化存储API错误:', error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
} 