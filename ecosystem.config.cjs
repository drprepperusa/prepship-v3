module.exports = {
  apps: [
    {
      name: 'prepship-v3',
      script: 'npm',
      args: 'run dev -- --host 0.0.0.0 --port 4015',
      cwd: '/Users/djmac/projects/prepship-v3-repo',
      env: {
        PORT: 4015,
        NODE_ENV: 'development'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
