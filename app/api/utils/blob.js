import { list, put, del, get } from '@vercel/blob';

const FILE = 'timers.json';

/**
 * @description 获取所有定时器数据
 * @returns {Promise<Array>} 定时器数组
 */
export async function getTimers() {
  try {
    const { url } = await get({ pathname: FILE });
    const response = await fetch(url);
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取定时器数据失败:', error);
    return [];
  }
}

/**
 * @description 存储定时器数据
 * @param {Array} data 定时器数组
 * @param {string|null} previousHash 前一个版本的哈希值，用于乐观锁
 * @returns {Promise<Object>} 存储结果
 */
export async function putTimers(data, previousHash = null) {
  try {
    if (!Array.isArray(data)) {
      throw new Error('数据必须是数组格式');
    }
    
    const result = await put(FILE, JSON.stringify(data), {
      access: 'public',
      addRandomSuffix: false,
      previousHash // 防止并发冲突
    });
    
    return result;
  } catch (error) {
    console.error('存储定时器数据失败:', error);
    throw error;
  }
}

/**
 * @description 初始化定时器存储
 * @returns {Promise<void>}
 */
export async function initTimersStorage() {
  try {
    const { blobs } = await list();
    const exists = blobs.some(blob => blob.pathname === FILE);
    
    if (!exists) {
      await putTimers([]);
      console.log('定时器存储已初始化');
    }
  } catch (error) {
    console.error('初始化定时器存储失败:', error);
  }
} 