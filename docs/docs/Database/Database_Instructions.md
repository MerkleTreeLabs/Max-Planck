# Database

Setup and configuration of the database is documented here.

## Install

Server is installed and hardened using the [guide provided here](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-22-04). Thanks Digital Ocean!

## User

The user creation process:

### New User:

Add a non-root user to the system we will use to interact with the bot.

```sql
CREATE USER 'sammy'@'localhost' IDENTIFIED BY 'password';
```

Add a root user as well and grant all permissions
```sql
 CREATE USER 'admin'@'localhost' IDENTIFIED BY 'password';
 
 GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost' WITH GRANT OPTION;

FLUSH PRIVILEGES;
```

### Grant privileges:

```sql
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, INDEX, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'sammy'@'localhost' WITH GRANT OPTION;
```

### FLUSH PRIVILEGES:

```sql
FLUSH PRIVILEGES;
```

### Login

```bash
mysql -u sammy -p
```


## Setup Database & Tables

With a new user to perform a lookup or write data we need to create a database and tables.

Using the nodeJS package `sequelize`, we will manage the creation and interaction with the bot.

> In Sequelize 6, MySQL requires the installation of the `mysql2` npm package.

Install both the `mysql2` and `sequelize` package

```bash
npm install sequelize mysql2
```

### Create Database

> There is a script for that!

Under the scripts directory there is a database folder with some cool things

These create and destroy the database that is defined in the config file.

`npm run create-db` gets you there.



















