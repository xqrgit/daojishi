'use client';
import { useState, useEffect } from 'react';
import TimerForm from './components/TimerForm';
import Timer from './components/Timer';

/**
 * @description 主页面组件
 * @returns {React.ReactElement} 页面组件
 */
export default function Home() {
  const [timers, setTimers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 初始化Blob存储
  const initBlobStorage = async () => {
    try {
      console.log('正在初始化Blob存储...');
      const response = await fetch('/api/init', { method: 'POST' });
      const data = await response.json();
      console.log('初始化结果:', data);
      return data;
    } catch (err) {
      console.error('初始化存储失败:', err);
      return { success: false, error: err.message };
    }
  };

  // 加载定时器数据
  const loadTimers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 先尝试初始化Blob存储
      const initResult = await initBlobStorage();
      if (!initResult.success && initResult.error) {
        console.warn('初始化警告:', initResult.error);
      }
      
      console.log('正在获取定时器数据...');
      const response = await fetch('/api/timers');
      
      if (!response.ok) {
        throw new Error(`获取定时器数据失败：HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('获取到定时器数据:', data.length, '个项目');
      setTimers(data);
    } catch (err) {
      console.error('加载定时器错误:', err);
      setError(`加载定时器数据时发生错误: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 初次加载数据
  useEffect(() => {
    loadTimers();
  }, []);

  // 处理添加定时器
  const handleTimerAdded = (newTimer) => {
    // 仅更新UI状态，不触发重新加载
    setTimers(prevTimers => [...prevTimers, newTimer]);
  };

  // 处理重置定时器
  const handleTimerReset = (updatedTimer) => {
    // 仅更新UI状态，不触发重新加载
    setTimers(prevTimers => 
      prevTimers.map(timer => 
        timer.id === updatedTimer.id ? updatedTimer : timer
      )
    );
  };

  // 手动刷新数据
  const handleRefresh = () => {
    loadTimers();
  };

  return (
    <main className="container">
      <header className="header">
        <h1>倒计时工具</h1>
        <p>创建并跟踪您的重要事项倒计时</p>
      </header>
      
      <TimerForm onTimerAdded={handleTimerAdded} />
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="refresh-container">
        <button onClick={handleRefresh} className="btn btn-secondary" disabled={loading}>
          {loading ? '加载中...' : '刷新数据'}
        </button>
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="spin"></div>
        </div>
      ) : (
        <>
          {timers.length === 0 ? (
            <div className="no-timers">
              <p>还没有创建倒计时项目</p>
            </div>
          ) : (
            <div className="timers-list">
              {timers.map(timer => (
                <Timer 
                  key={timer.id} 
                  timer={timer} 
                  onReset={handleTimerReset} 
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
} 