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

  // 加载定时器数据
  const loadTimers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/timers');
      
      if (!response.ok) {
        throw new Error('获取定时器数据失败');
      }
      
      const data = await response.json();
      setTimers(data);
    } catch (err) {
      console.error('加载定时器错误:', err);
      setError('加载定时器数据时发生错误，请刷新页面重试');
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
    setTimers(prevTimers => [...prevTimers, newTimer]);
  };

  // 处理重置定时器
  const handleTimerReset = (updatedTimer) => {
    setTimers(prevTimers => 
      prevTimers.map(timer => 
        timer.id === updatedTimer.id ? updatedTimer : timer
      )
    );
  };

  return (
    <main className="container">
      <header className="header">
        <h1>倒计时工具</h1>
        <p>创建并跟踪您的重要事项倒计时</p>
      </header>
      
      <TimerForm onTimerAdded={handleTimerAdded} />
      
      {error && <div className="error-message">{error}</div>}
      
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