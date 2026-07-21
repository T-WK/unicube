module.exports = {
  apps: [
    {
      name: 'unicube',
      script: 'npm',
      args: 'start',
      cwd: '/root/unicube',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 2025
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '512M',
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      merge_logs: true
    }
  ]
};
