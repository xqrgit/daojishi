'use client';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * @description 创建定时器表单组件
 * @param {Object} props 组件属性 
 * @param {Function} props.onTimerAdded 添加定时器后的回调
 * @returns {React.ReactElement} 表单组件
 */
export default function TimerForm({ onTimerAdded }) {
  const [name, setName] = useState('');
  const [days, setDays] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * @description 处理表单提交
   * @param {Event} e 表单事件
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('请输入项目名称');
      return;
    }

    if (!days || isNaN(days) || days <= 0 || days > 5000) {
      setError('请输入有效的天数 (1-5000)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const timerId = uuidv4();
      const response = await fetch('/api/timers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: timerId,
          name: name.trim(),
          days: Number(days)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '创建定时器失败');
      }

      // 清空表单
      setName('');
      setDays('');
      
      // 调用父组件回调函数
      if (onTimerAdded) {
        onTimerAdded(data.timer);
      }
    } catch (err) {
      console.error('创建定时器出错:', err);
      setError(err.message || '创建定时器时发生错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="timer-form">
      <h2>创建新倒计时</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">项目名称</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入倒计时项目名称"
            maxLength="100"
            disabled={loading}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="days">倒计时天数</label>
          <input
            type="number"
            id="days"
            className="form-control"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="输入天数"
            min="1"
            max="5000"
            disabled={loading}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
        >
          {loading ? '创建中...' : '创建倒计时'}
        </button>
      </form>
    </div>
  );
} 