'use client';
import { useState, useEffect } from 'react';

/**
 * @description 格式化剩余时间
 * @param {number} timeRemaining 剩余毫秒数
 * @returns {Object} 格式化后的天、时、分、秒
 */
function formatTimeRemaining(timeRemaining) {
  // 如果剩余时间小于或等于0，返回全0
  if (timeRemaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const seconds = Math.floor((timeRemaining / 1000) % 60);
  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
  const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds };
}

/**
 * @description 定时器组件
 * @param {Object} props 组件属性 
 * @param {Object} props.timer 定时器数据
 * @param {Function} props.onReset 重置回调函数
 * @returns {React.ReactElement} 定时器组件
 */
export default function Timer({ timer, onReset }) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  // 计算剩余时间
  useEffect(() => {
    if (!timer?.endDate) return;

    // 初始计算
    const endDate = new Date(timer.endDate);
    const initialTimeRemaining = Math.max(0, endDate - new Date());
    setTimeRemaining(initialTimeRemaining);

    // 设置定时器每秒更新
    const intervalId = setInterval(() => {
      const currentTimeRemaining = Math.max(0, endDate - new Date());
      setTimeRemaining(currentTimeRemaining);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer?.endDate]);

  // 格式化后的剩余时间
  const formatted = formatTimeRemaining(timeRemaining);

  // 倒计时是否已结束
  const isCompleted = timeRemaining <= 0;

  // 处理重置按钮点击
  const handleReset = async () => {
    setIsResetting(true);
    setResetMessage('');

    try {
      const response = await fetch('/api/timers/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: timer.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '重置倒计时失败');
      }

      // 调用父组件回调函数
      if (onReset) {
        onReset(data.timer);
      }

      // 显示成功消息
      setResetMessage('重置成功！');
      
      // 3秒后清除消息
      setTimeout(() => {
        setResetMessage('');
      }, 3000);
    } catch (err) {
      console.error('重置倒计时错误:', err);
      setResetMessage(`错误: ${err.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="timer-card">
      <div className="timer-header">
        <div className="timer-name">{timer.name}</div>
        <div>{timer.days}天</div>
      </div>
      
      <div className="timer-countdown">
        {isCompleted ? (
          <span>已结束</span>
        ) : (
          <span>
            {formatted.days}天 {formatted.hours.toString().padStart(2, '0')}:
            {formatted.minutes.toString().padStart(2, '0')}:
            {formatted.seconds.toString().padStart(2, '0')}
          </span>
        )}
      </div>
      
      <div className="timer-details">
        <div>开始: {new Date(timer.startDate).toLocaleString()}</div>
        <div>结束: {new Date(timer.endDate).toLocaleString()}</div>
      </div>
      
      <div className="timer-actions">
        <button 
          onClick={handleReset} 
          className="btn btn-primary" 
          disabled={isResetting}
        >
          {isResetting ? '重置中...' : '重置倒计时'}
        </button>
      </div>
      
      {resetMessage && (
        <div className={resetMessage.includes('错误') ? 'error-message' : 'success-message'}>
          {resetMessage}
        </div>
      )}
    </div>
  );
} 