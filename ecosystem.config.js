/**
 * @description pm2 configuration file.
 * @example
 *  production mode :: pm2 start ecosystem.config.js --only prod
 *  development mode :: pm2 start ecosystem.config.js --only dev
 */
module.exports = {
  apps: [
    {
      name: "operations_dashboard_proc_prod", // pm2 start App name
      script: "next", // node
      args: "start",
      exec_mode: "cluster", // 'cluster' or 'fork'
      instance_var: "INSTANCE_ID", // instance variable
      instances: 1, // pm2 instance count
      autorestart: true, // auto restart if process crash
      watch: false, // files change automatic restart
      ignore_watch: ["node_modules", "logs"], // ignore files change
      max_memory_restart: "5G", // restart if process use more than 5G memory
      merge_logs: true, // if true, stdout and stderr will be merged and sent to pm2 log
      output: "./logs/pm2/access.log", // pm2 log file
      error: "./logs/pm2/error.log", // pm2 error log file
      env: {
        // environment variable
        PORT: 3000,
        NODE_ENV: "production",
      },
    },
    {
      name: "operations_dashboard_proc_dev", // pm2 start App name
      script: "next", // node
      args: "start",
      exec_mode: "cluster", // 'cluster' or 'fork'
      instance_var: "INSTANCE_ID", // instance variable
      instances: 1, // pm2 instance count
      autorestart: true, // auto restart if process crash
      watch: false, // files change automatic restart
      ignore_watch: ["node_modules", "logs"], // ignore files change
      max_memory_restart: "1G", // restart if process use more than 1G memory
      merge_logs: true, // if true, stdout and stderr will be merged and sent to pm2 log
      output: "./logs/pm2/access.log", // pm2 log file
      error: "./logs/pm2/error.log", // pm2 error log file
      env: {
        // environment variable
        PORT: 3000,
        NODE_ENV: "development",
      },
    },
  ],
  deploy: {
    production: {
      user: "user",
      host: "0.0.0.0",
      ref: "origin/master",
      repo: "git@github.com:repo.git",
      path: "dist/src/execute_jobs.js",
      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --only operations_dashboard_proc_prod",
    },
  },
};
