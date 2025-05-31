export const metadata = {
  title: '倒计时工具',
  description: '基于Vercel构建的轻量级倒计时工具',
}

/**
 * @description 应用根布局组件
 * @param {Object} props 组件属性
 * @param {React.ReactNode} props.children 子组件
 * @returns {React.ReactElement} 布局组件
 */
export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
} 