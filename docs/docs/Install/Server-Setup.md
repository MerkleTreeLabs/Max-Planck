
Install and configure the system to run the bot.

1. **Add new user to run the bot:**
	1. [ ] `adduser fr1t2`
	2. [ ] `adduser fr1t2 sudo`
2. **Secure SSH to only key based login:**
	1. [ ] Modify the `/etc/sshd_conf` file to disallow password and root login. Ensure keys are in place and functional.
3. **Enable UFW firewall rules:**
	1. [ ] Rules are defined below
		```sh
		[ 1] 22/tcp                     ALLOW IN    Anywhere
		[ 2] OpenSSH                    ALLOW IN    Anywhere
		[ 3] 19000                      ALLOW IN    Anywhere
		[ 4] 30303/tcp                  ALLOW IN    Anywhere
		[ 5] 30303/udp                  ALLOW IN    Anywhere
		[ 6] 22/tcp (v6)                ALLOW IN    Anywhere (v6)
		[ 7] OpenSSH (v6)               ALLOW IN    Anywhere (v6)
		[ 8] 19000 (v6)                 ALLOW IN    Anywhere (v6)
		[ 9] 30303/tcp (v6)             ALLOW IN    Anywhere (v6)
		[10] 30303/udp (v6)             ALLOW IN    Anywhere (v6)
		```

5. **Fail2ban:**
	1. [ ] Install `fail2ban` with `sudo apt install fail2ban`
	2. [ ] Copy the config file and edit to enable the SSHD protection using UFW
	3. [ ] Enable fail2ban in `systemd`
6. **Mount QRL and ZOND Block storage to server and mount the block device.** 
	1. [ ] Create directory and mount in `/etc/fstab` for each drive/chain
	
		```bash
		echo /dev/vdb1               /home/fr1t2/ZOND       ext4    defaults,noatime,nofail 0 0 >> /etc/fstab
		
		echo /dev/vdc1               /home/fr1t2/QRL       ext4    defaults,noatime,nofail 0 0 >> /etc/fstab
		```

7. **update and upgrade the system**
	1. [ ] `sudo apt update && sudo apt upgrade`
8. Install all required packages for the application
	1. [ ] MySQL
	2. [ ] NVM and NodeJS latest
	3. [ ] git, screen, ...

> [!WARNING] Add all required packages!
> This list is not complete...
