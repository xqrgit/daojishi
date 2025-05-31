import { put, get, list } from '@vercel/blob';

// 使用更简单的文件命名
const FILE_PATH = 'data/timers.json';

/**
 * @description 获取所有定时器数据
 * @returns {Promise<Array>} 定时器数组
 */
export async function getTimers() {
  console.log('尝试获取定时器数据...');
  try {
    // 检查文件是否存在
    try {
      const blob = await get({ pathname: FILE_PATH });
      if (blob && blob.url) {
        console.log('找到定时器文件，正在获取数据...');
        const response = await fetch(blob.url);
        if (response.ok) {
          const data = await response.json();
          console.log(`成功读取定时器数据，共 ${data.length} 项`);
          return Array.isArray(data) ? data : [];
        } else {
          console.error('读取定时器文件失败，状态码:', response.status);
        }
      }
    } catch (err) {
      console.log('定时器文件可能不存在，将创建新文件');
    }
    
    // 如果文件不存在或读取失败，创建空数据
    console.log('初始化空定时器数据');
    await saveTimers([]);
    return [];
  } catch (error) {
    console.error('获取定时器数据出错:', error);
    // 出错时返回空数组，确保应用不会崩溃
    return [];
  }
}

/**
 * @description 保存定时器数据
 * @param {Array} timers 定时器数组
 * @returns {Promise<Object>} 存储结果
 */
export async function saveTimers(timers) {
  if (!Array.isArray(timers)) {
    console.error('无效的定时器数据，必须是数组');
    throw new Error('无效的定时器数据，必须是数组');
  }
  
  console.log(`准备保存定时器数据，共 ${timers.length} 项`);
  
  try {
    // 直接保存数据，不使用乐观锁
    const result = await put(FILE_PATH, JSON.stringify(timers), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false
    });
    
    console.log('定时器数据保存成功:', result.url);
    return result;
  } catch (error) {
    console.error('保存定时器数据失败:', error);
    throw error;
  }
}

/**
 * @description 添加定时器
 * @param {Object} timer 新定时器
 * @returns {Promise<Array>} 更新后的定时器列表
 */
export async function addTimer(timer) {
  console.log('添加新定时器:', timer);
  try {
    // 获取当前所有定时器
    const timers = await getTimers();
    
    // 添加新定时器
    const updatedTimers = [...timers, timer];
    
    // 保存更新后的列表
    await saveTimers(updatedTimers);
    
    // 返回更新后的列表
    return updatedTimers;
  } catch (error) {
    console.error('添加定时器失败:', error);
    throw error;
  }
}

/**
 * @description 重置定时器
 * @param {string} timerId 定时器ID
 * @param {number} days 天数
 * @returns {Promise<Object>} 更新后的定时器
 */
export async function resetTimer(timerId) {
  console.log('重置定时器:', timerId);
  try {
    // 获取当前所有定时器
    const timers = await getTimers();
    
    // 查找定时器
    const timerIndex = timers.findIndex(t => t.id === timerId);
    if (timerIndex === -1) {
      console.error('定时器不存在:', timerId);
      throw new Error('定时器不存在');
    }
    
    const timer = timers[timerIndex];
    const now = new Date();
    const endDate = new Date(now.getTime() + timer.days * 24 * 60 * 60 * 1000);
    
    // 更新定时器
    const updatedTimer = {
      ...timer,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      updatedAt: now.toISOString()
    };
    
    // 更新列表
    const updatedTimers = [...timers];
    updatedTimers[timerIndex] = updatedTimer;
    
    // 保存更新后的列表
    await saveTimers(updatedTimers);
    
    // 返回更新后的定时器
    return updatedTimer;
  } catch (error) {
    console.error('重置定时器失败:', error);
    throw error;
  }
}

/**
 * @description 初始化存储
 * @returns {Promise<void>}
 */
export async function initStorage() {
  console.log('初始化Blob存储...');
  try {
    const { blobs } = await list();
    console.log('现有文件列表:', blobs.map(b => b.pathname));
    
    const exists = blobs.some(b => b.pathname === FILE_PATH);
    if (!exists) {
      console.log('定时器文件不存在，正在创建初始文件...');
      await saveTimers([]);
      console.log('初始文件创建成功');
    } else {
      console.log('定时器文件已存在，无需初始化');
    }
    
    return { success: true };
  } catch (error) {
    console.error('初始化存储失败:', error);
    return { success: false, error: error.message };
  }
} 