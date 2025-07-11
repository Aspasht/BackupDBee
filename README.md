# BackupDBee 🐝
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<img src="https://github.com/Aspasht/BackupDBee/blob/main/backupdbee_logo.svg" width=400&height400>

Effortlessly manage your database backups at one go. This easy-to-use tool supports MySQL & PostgreSQL allowing you to back up multiple databases at once.

#### Key features: 🚀

✅ Multiple Database Support: Seamlessly back up MySQL & PostgreSQL in one go. (Note: For now we support MySQL and PostgreSQl.)

✅ Support for GMAIL,S3 BUCKET for storing the backup. (Backups are transfered in zip format, reducing backup size.)

✅ Multiple Email Recipients: Send backups to multiple email recipients. (if `BACKUP_DEST` is set to `GMAIL`)

✅ Notify on Discord or Slack for successful and failed backups.

✅ Automated Backups: Schedule and automate backups (using crons or pm2) to ensure your data is always protected without manual intervention.

## Clone the project 📦

```
git clone https://github.com/28softwares/backupdbee.git
cd backupdbee
```

### Initial Setup

Make sure to install nodejs and zip in the linux server.

```bash
node index.mjs install #this creates .env file
```

### 📦 Basic Command

```bash
backupdbee [options]
```

---

### 🛠️ Available Options

| Flag | Alias | Description |
|------|-------|-------------|
| `--database [names]` | `-d` | Backup one or more databases (comma-separated). Omit value to backup all. |
| `--notify [platforms]` | `-n` | Notify via Slack, Discord, Telegram, or a custom webhook (comma-separated). Omit value to notify through all. |
| `--storage [services]` | `-s` | Store backup on cloud storage (e.g., `s3`). Omit value to use all configured storages. |
| `--list` | `-l` | List available databases, notification platforms, or storage options. Must be used with another flag like `--database`, `--notify`, or `--storage`. |
| `--list-backups` | `-b` | List all stored backups (currently supports S3). |
| `--help` | `-h` | Show help information. |
| `--version` | `-v` | Show CLI version. |

---

### 💡 Examples

#### ✅ Backup all configured databases
```bash
backupdbee --database
```

#### 🎯 Backup specific databases
```bash
backupdbee --database=postgres,mysql
```

#### ☁️ Upload backup to cloud (e.g., AWS S3)
```bash
backupdbee --database=postgres --storage=s3
```

#### 🔔 Notify via Slack and Discord
```bash
backupdbee --database=postgres --notify=slack,discord
```

#### 📜 List all available databases
```bash
backupdbee --database --list
```

#### 📜 List all available notification services
```bash
backupdbee --notify --list
```

#### 📜 List available storage services
```bash
backupdbee --storage --list
```

#### 📦 List existing remote backups
```bash
backupdbee --list-backups
```

---

### 🧠 Tips

- You can combine flags to perform complex operations in one step.
- If no flags are provided, the tool will prompt or exit silently.
- You can define all database, notification, and storage configs in a [`backupdbee.yml`](#️-configuration-with-backupdbeeyml) file.Current work updates can be found at:
[https://github.com/orgs/28softwares/projects/1](https://github.com/orgs/28softwares/projects/1)

## Contributors 🤝

<a href = "https://github.com/28softwares/backupdbee">
  <img src = "https://contrib.rocks/image?repo=28softwares/backupdbee"/>
</a>
