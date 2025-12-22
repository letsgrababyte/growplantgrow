// PM2 Ecosystem Configuration
// Manages multiple Next.js apps on the same server

module.exports = {
  apps: [
    {
      name: 'earthpalace',
      cwd: '/var/www/earthpalace',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
      error_file: '/var/log/pm2/earthpalace-error.log',
      out_file: '/var/log/pm2/earthpalace-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
    },
    {
      name: 'growplantgrow',
      cwd: '/var/www/growplantgrow',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 3001,
        NODE_ENV: 'production',
      },
      error_file: '/var/log/pm2/growplantgrow-error.log',
      out_file: '/var/log/pm2/growplantgrow-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
    },
  ],
};

