
Erwin Schrodinger is in charge of moderation in discord servers

He is available using the prefix defined in the config file at erwin.merkletreelabs.com/dashboard. *You will need to use your discord login to authenticate with the dashboard.*

prefix = `!` 

## Mod Actions

### Ban (temp-ban)

> [!info]  **Ban a user from the Guild**
> 
> Use the `!ban` command to remove a user from the server with an optional reason and duration.

`!ban <@USERID> Reason for the ban`

`!ban <@USERID> 1h Reason for the ban`

- User
- duration 
- reason* Optional

**Command Access**

```yaml
Level 0: FALSE
Level 50: FALSE
Level 100: TRUE
```

---

### Un-Ban (temp-ban)

>[!info]  **Un-Ban a user from the Guild**
> 
> Use the `!unban` command to allow a removed user back into the server with an optional reason.

`!unban <@USERID> Reason for the unban`

- User
- reason* Optional

**Command Access**

```yaml
Level 0: FALSE
Level 50: FALSE
Level 100: TRUE
```

---

### Forceban

Force-ban the specified user, even if they aren't on the server

> [!info]  **Ban a user that has left**
>
> Force-ban the specified user, even if they aren't on the server

`!forceban <@USERID> Reason`

- user ID
- Reason string

**Command Access**

```yaml
Level 0: FALSE
Level 50: FALSE
Level 100: TRUE
```

---

### Kick

> [!info]  **Kick user from guild**
>
> Kick the user from the guild

`!kick <@USERID> Reason`

- user ID
- Reason string

**Command Access**

```yaml
Level 0: FALSE
Level 50: TRUE
Level 100: TRUE
```

---

### Mute

> [!info]  **Mute a user**
>
> Assigns the @muted role to a user for an optional given time frame

`!mute <@USERID> 5m for fighting`

- User ID
- Time eg. 5m, 1h, 2d
- reason

**Command Access**

```yaml
Level 0: FALSE
Level 50: TRUE
Level 100: TRUE
```

---

### Warn

>[!info]   **Warn a user**
>
> Use this command to send a warning to the user for the reason given. This will create a new [Case](#case) to the user with the reason given and reference to the message

`!warn <@USERID> Reason`

- User ID
- Reason String

**Command Access**

```yaml
Level 0: FALSE
Level 50: TRUE
Level 100: TRUE
```

---

## Case

Users that have moderation actions taken against them will be assigned a case. These are typically created automatically and can be found in the #mod-case-log channel.

### Case

> [!info] **Show information for a specified case**
>
> This command will show information on the case indicated. 

`!case 34`

- Case Number

**Command Access**

```yaml
Level 0: FALSE
Level 50: TRUE
Level 100: TRUE
```

---

### Cases

> [!info] **Show list of cases for a specified user**
>
> This command will show all cases for the user given in a paginated view using emoji 
>
> If passed with no user ID it will print the last 5 cases

`!cases <@USERID>`

- User ID

**Command Access**

```yaml
Level 0: FALSE
Level 50: TRUE
Level 100: TRUE
```

---

### Add/Delete Case

> [!info] **Manage user cases**
>
> The `!addcase` and `!deletecase` are used to manage user cases. 
> Types:
> "note" | "warn" | "mute" | "unmute" | "kick" | "ban" | "unban"
`!addcase NOTE <@USERID> Reason for case`

- param_1
- param_2

**Command Access**

```yaml
Level 0: FALSE
Level 50: TRUE
Level 100: TRUE
```

---

### Update Case

> [!info] **Update a users case**
>
> Add a note or update information for a user case

`full command example`

- param_1
- param_2

**Command Access**

```yaml
Level 0: FALSE
Level 50: TRUE
Level 100: TRUE
```

---


### Hide Case 

> [!info] **Title**
>
> Contents

`full command example`

- param_1
- param_2

**Command Access**

```yaml
Level 0: FALSE
Level 50: TRUE
Level 100: TRUE
```

---

### Note

> [!info] **Title**
>
> Contents

`full command example`

- param_1
- param_2

**Command Access**

```yaml
Level 0: FALSE
Level 50: TRUE
Level 100: TRUE
```

---







## General Commands

### POST

 
> [!info] **Post as Erwin Schrodinger**
>
> Using the `post` command, a moderator can ghostwrite content from the bot. 
> 
> This allows channel warnings to be issued to the guild without showing who is warning, giving some protection to the moderation team 

`!post #CHANNEL Say Something To The Group Erwin!`

- Channel to post the message to. Must be a valid channel mention.
- Message to send

**Command Access**

```yaml
Level 0: FALSE
Level 50: TRUE
Level 100: TRUE
```
---







### NAME


> **Title**
>
> Contents

`full command example`

- param_1
- param_2

**Command Access**

```yaml
Level 0: FALSE
Level 50: TRUE
Level 100: TRUE
```

---



























### NAME

 Description


> [!NOTE] Title
> Contents

`full command example`

- param_1
- param_2

**Command Access**

> Level 0:
> Level 50:
> Level 100:

---
