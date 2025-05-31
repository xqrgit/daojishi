import { list, put, del, get } from '@vercel/blob';

// 使用完整路径命名，确保Blob存储能够正确识别
const FILE = 'data/timers.json';

/**
 * @description 获取所有定时器数据
 * @returns {Promise<Array>} 定时器数组
 */
export async function getTimers() {
  try {
    // 尝试获取文件
    try {
      const { url } = await get({ pathname: FILE });
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      console.log('文件可能不存在，将返回空数组', err);
    }
    
    // 如果获取失败，初始化并返回空数组
    await putTimers([]);
    return [];
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
    
    console.log('正在存储数据:', data.length, '个项目');
    
    const result = await put(FILE, JSON.stringify(data), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
      previousHash // 防止并发冲突
    });
    
    console.log('存储完成，URL:', result.url);
    
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
    console.log('开始初始化定时器存储...');
    
    const { blobs } = await list({ prefix: 'data/' });
    console.log('已找到文件:', blobs.map(b => b.pathname).join(', '));
    
    const exists = blobs.some(blob => blob.pathname === FILE);
    
    if (!exists) {
      console.log('定时器文件不存在，正在创建...');
      await putTimers([]);
      console.log('定时器存储已初始化');
    } else {
      console.log('定时器文件已存在');
    }
  } catch (error) {
    console.error('初始化定时器存储失败:', error);
  }
} 