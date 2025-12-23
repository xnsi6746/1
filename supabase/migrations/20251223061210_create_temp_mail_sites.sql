/*
  # 创建临时邮箱站点表

  1. 新表
    - `temp_mail_sites`
      - `id` (uuid, 主键)
      - `name` (text, 站点名称)
      - `url` (text, 站点链接)
      - `description` (text, 站点描述)
      - `logo` (text, 站点图标/logo URL, 可选)
      - `features` (jsonb, 特性列表)
      - `sort_order` (integer, 排序)
      - `is_active` (boolean, 是否显示)
      - `created_at` (timestamptz, 创建时间)
      - `updated_at` (timestamptz, 更新时间)
  
  2. 安全策略
    - 启用 RLS
    - 允许所有人读取已激活的站点
*/

CREATE TABLE IF NOT EXISTS temp_mail_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  description text DEFAULT '',
  logo text,
  features jsonb DEFAULT '[]'::jsonb,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE temp_mail_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active temp mail sites"
  ON temp_mail_sites
  FOR SELECT
  USING (is_active = true);

-- 插入一些示例数据
INSERT INTO temp_mail_sites (name, url, description, features, sort_order) VALUES
('Yopmail', 'https://yopmail.com', '无需注册，即刻使用。支持自定义邮箱名，邮件保存8天', '["无需注册", "自定义邮箱名", "邮件保存8天", "无广告"]', 1),
('Temp Mail', 'https://temp-mail.org', '自动生成临时邮箱，界面简洁，支持多语言', '["自动生成", "简洁界面", "多语言支持", "即时刷新"]', 2),
('Guerrilla Mail', 'https://www.guerrillamail.com', '提供一小时临时邮箱，支持发送邮件', '["支持发送", "1小时有效", "可自定义", "无需注册"]', 3),
('10 Minute Mail', 'https://10minutemail.com', '提供10分钟临时邮箱，可延长使用时间', '["10分钟有效", "可延长时间", "自动生成", "简单易用"]', 4),
('Maildrop', 'https://maildrop.cc', '无需注册，支持自定义邮箱名，邮件保存24小时', '["自定义邮箱名", "保存24小时", "无需注册", "API支持"]', 5),
('Mailinator', 'https://www.mailinator.com', '公共临时邮箱，任何人都可以查看，适合测试', '["公共邮箱", "无需注册", "适合测试", "历史悠久"]', 6),
('Mohmal', 'https://www.mohmal.com', '提供阿拉伯语界面，支持45分钟临时邮箱', '["45分钟有效", "多语言", "可延长时间", "简洁界面"]', 7),
('Email On Deck', 'https://www.emailondeck.com', '提供随机临时邮箱，界面现代化', '["随机生成", "现代界面", "无需注册", "即时刷新"]', 8),
('Temp Mail.io', 'https://temp-mail.io', '支持多种域名，界面美观，响应速度快', '["多域名支持", "美观界面", "快速响应", "无广告"]', 9),
('Throwaway Mail', 'https://www.throwawaymail.com', '提供48小时临时邮箱，支持附件', '["48小时有效", "支持附件", "自动生成", "安全可靠"]', 10);
