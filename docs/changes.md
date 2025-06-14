# 变更记录

## 版本 0.1.0 (初始版本)

初始项目架构设计和基础功能实现。

### 新增功能:

- 创建倒计时项目功能
- 基于Vercel Blob的数据持久化
- 倒计时实时显示（天、小时、分钟、秒）
- 重置倒计时功能
- 响应式界面设计

### 技术实现:

- 使用Next.js框架
- @vercel/blob作为数据存储
- UUIDv4生成唯一标识符
- 无状态API设计

### 限制与说明:

⚠️ **警告**: Blob存储作为数据源存在以下限制：
- 并发写入可能导致数据冲突，实现了基于previousHash的乐观锁机制
- 无法进行复杂查询操作
- 单次I/O限制为10MB

### 未来计划:

- 增加时间格式验证功能
- 改进错误处理机制
- 优化移动端体验 