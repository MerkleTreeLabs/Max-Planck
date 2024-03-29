require('module-alias/register');

const { Sequelize, DataTypes } = require('sequelize');
const { dbUser, dbPasword } = require('@config');

// Initialize Sequelize
const sequelize = new Sequelize({
	dialect: 'mysql',
	host: 'localhost',
	username: dbUser,
	password: dbPasword,
	logging: false,
});

// Define User Model
const User = sequelize.define('User', {
	UserID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	Email: {
		type: DataTypes.STRING,
		unique: true,
	},
	Phone: {
		type: DataTypes.STRING,
		unique: true,
	},
	TwoFA_Email: DataTypes.STRING,
	TwoFA_Phone: DataTypes.STRING,
}, {
	timestamps: true,
	createdAt: 'CreatedAt',
	updatedAt: 'UpdatedAt',
});

// Define Service Model
const Service = sequelize.define('Service', {
	ServiceID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	Name: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
}, {
	timestamps: false,
});

// Sample data for initial services
Service.bulkCreate([
	{ Name: 'Discord' },
	{ Name: 'Twitter' },
	{ Name: 'Slack' },
	{ Name: 'Telegram' },
]);

// Define ValidationKey Model
const ValidationKey = sequelize.define('ValidationKey', {
	KeyID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	UserID: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'UserID',
		},
	},
	ServiceID: {
		type: DataTypes.INTEGER,
		references: {
			model: Service,
			key: 'ServiceID',
		},
	},
	ValidationKey: DataTypes.STRING,
	ValidationKeyExpiry: DataTypes.DATE,
	IsInvalidated: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	IsAccepted: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
}, {
	timestamps: true,
	createdAt: 'CreatedAt',
	updatedAt: 'UpdatedAt',
});

// Define SocialMediaAccount Model
const SocialMediaAccount = sequelize.define('SocialMediaAccount', {
	AccountID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	UserID: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'UserID',
		},
	},
	Provider: DataTypes.STRING,
	AccountUserID: DataTypes.STRING,
	Username: DataTypes.STRING,
}, {
	timestamps: true,
	createdAt: 'CreatedAt',
	updatedAt: 'UpdatedAt',
});

// Define WalletAddress Model
const WalletAddress = sequelize.define('WalletAddress', {
	AddressID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	UserID: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'UserID',
		},
	},
	AddressType: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	Address: DataTypes.STRING,
	IsRevoked: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
}, {
	timestamps: true,
	createdAt: 'CreatedAt',
	updatedAt: 'UpdatedAt',
});


// Define UserCredential Model
const UserCredential = sequelize.define('UserCredential', {
	CredentialID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	UserID: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'UserID',
		},
	},
	PasswordHash: DataTypes.STRING,
	Salt: DataTypes.STRING,
}, {
	timestamps: true,
	createdAt: 'CreatedAt',
	updatedAt: 'UpdatedAt',
});

// Define OAuth2Provider Model
const OAuth2Provider = sequelize.define('OAuth2Provider', {
	ID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	UserID: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'UserID',
		},
	},
	Provider: {
		type: DataTypes.STRING,
		defaultValue: 'Discord',
	},
	ClientID: DataTypes.STRING,
	ClientSecret: DataTypes.STRING,
	RedirectURI: DataTypes.STRING,
}, {
	timestamps: true,
	createdAt: 'CreatedAt',
	updatedAt: 'UpdatedAt',
});

// Define OAuth2Authorization Model
const OAuth2Authorization = sequelize.define('OAuth2Authorization', {
	AuthorizationID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	UserID: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'UserID',
		},
	},
	Code: DataTypes.STRING,
	Scope: DataTypes.STRING,
	State: DataTypes.STRING,
	CreatedAt: DataTypes.DATE,
	ExpiresIn: DataTypes.INTEGER,
	IsUsed: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
}, {
	timestamps: true,
	createdAt: 'CreatedAt',
	updatedAt: 'UpdatedAt',
});

// Define OAuth2Token Model
const OAuth2Token = sequelize.define('OAuth2Token', {
	TokenID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	UserID: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'UserID',
		},
	},
	AccessToken: DataTypes.STRING,
	RefreshToken: DataTypes.STRING,
	ExpiresIn: DataTypes.INTEGER,
	Scope: DataTypes.STRING,
	TokenType: DataTypes.STRING,
}, {
	timestamps: true,
	createdAt: 'CreatedAt',
	updatedAt: 'UpdatedAt',
});

// Define TwoFactorAuth Model
const TwoFactorAuth = sequelize.define('TwoFactorAuth', {
	ID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	UserID: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'UserID',
		},
	},
	SecretKey: DataTypes.STRING,
	BackupCodes: DataTypes.JSON,
	UsedBackupCodes: DataTypes.JSON,
	IsEnabled: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	IsValid: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	},
	InvalidationTime: DataTypes.DATE,
}, {
	timestamps: true,
	createdAt: 'CreatedAt',
	updatedAt: 'UpdatedAt',
});

// Define Tip Model
const Tip = sequelize.define('Tip', {
	TipID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	FromUserID: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'UserID',
		},
	},
	ToUserID: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'UserID',
		},
	},
	Amount: DataTypes.FLOAT,
	Platform: DataTypes.STRING,
	Status: DataTypes.STRING,
	Time: DataTypes.DATE,
}, {
	timestamps: true,
	createdAt: 'CreatedAt',
	updatedAt: 'UpdatedAt',
});

// Define BatchTip Model
const BatchTip = sequelize.define('BatchTip', {
	BatchTipID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	FromUserID: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'UserID',
		},
	},
	AmountPerUser: DataTypes.FLOAT,
	Platform: DataTypes.STRING,
	Status: DataTypes.STRING,
	Time: DataTypes.DATE,
}, {
	timestamps: true,
	createdAt: 'CreatedAt',
	updatedAt: 'UpdatedAt',
});

// Define BatchTipRecipient Model
const BatchTipRecipient = sequelize.define('BatchTipRecipient', {
	BatchTipRecipientID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	BatchTipID: {
		type: DataTypes.INTEGER,
		references: {
			model: BatchTip,
			key: 'BatchTipID',
		},
	},
	ToUserID: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'UserID',
		},
	},
	Amount: DataTypes.FLOAT,
	Status: DataTypes.STRING,
}, {
	timestamps: true,
	createdAt: 'CreatedAt',
	updatedAt: 'UpdatedAt',
});

// Define Withdrawal Model
const Withdrawal = sequelize.define('Withdrawal', {
	WithdrawalID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	UserID: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'UserID',
		},
	},
	ToAddress: DataTypes.STRING,
	Amount: DataTypes.FLOAT,
	Time: DataTypes.DATE,
}, {
	timestamps: true,
	createdAt: 'CreatedAt',
	updatedAt: 'UpdatedAt',
});

// Define Faucet Model
const Faucet = sequelize.define('Faucet', {
	FaucetID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	UserID: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'UserID',
		},
	},
	Amount: DataTypes.FLOAT,
	Time: DataTypes.DATE,
}, {
	timestamps: true,
	createdAt: 'CreatedAt',
	updatedAt: 'UpdatedAt',
});

// Define AdminLog Model
const AdminLog = sequelize.define('AdminLog', {
	LogID: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	Action: DataTypes.STRING,
	UserID: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'UserID',
		},
	},
	Time: DataTypes.DATE,
}, {
	timestamps: true,
	createdAt: 'CreatedAt',
	updatedAt: 'UpdatedAt',
});

// Associations
ValidationKey.belongsTo(User, {
	foreignKey: 'UserID',
});
User.hasMany(ValidationKey, {
	foreignKey: 'UserID',
	onDelete: 'CASCADE',
});

SocialMediaAccount.belongsTo(User, {
	foreignKey: 'UserID',
});
User.hasMany(SocialMediaAccount, {
	foreignKey: 'UserID',
	onDelete: 'CASCADE',
});

WalletAddress.belongsTo(User, {
	foreignKey: 'UserID',
});
User.hasMany(WalletAddress, {
	foreignKey: 'UserID',
	onDelete: 'CASCADE',
});

UserCredential.belongsTo(User, {
	foreignKey: 'UserID',
});
User.hasOne(UserCredential, {
	foreignKey: 'UserID',
	onDelete: 'CASCADE',
});

OAuth2Provider.belongsTo(User, {
	foreignKey: 'UserID',
});
User.hasOne(OAuth2Provider, {
	foreignKey: 'UserID',
	onDelete: 'CASCADE',
});

OAuth2Authorization.belongsTo(User, {
	foreignKey: 'UserID',
});
User.hasOne(OAuth2Authorization, {
	foreignKey: 'UserID',
	onDelete: 'CASCADE',
});

OAuth2Token.belongsTo(User, {
	foreignKey: 'UserID',
});
User.hasOne(OAuth2Token, {
	foreignKey: 'UserID',
	onDelete: 'CASCADE',
});

TwoFactorAuth.belongsTo(User, {
	foreignKey: 'UserID',
});
User.hasOne(TwoFactorAuth, {
	foreignKey: 'UserID',
	onDelete: 'CASCADE',
});

Tip.belongsTo(User, {
	foreignKey: 'FromUserID',
});
Tip.belongsTo(User, {
	foreignKey: 'ToUserID',
});

BatchTip.belongsTo(User, {
	foreignKey: 'FromUserID',
});
BatchTipRecipient.belongsTo(User, {
	foreignKey: 'ToUserID',
});

BatchTipRecipient.belongsTo(BatchTip, {
	foreignKey: 'BatchTipID',
});
BatchTip.hasMany(BatchTipRecipient, {
	foreignKey: 'BatchTipID',
	onDelete: 'CASCADE',
});

Withdrawal.belongsTo(User, {
	foreignKey: 'UserID',
});
User.hasOne(Withdrawal, {
	foreignKey: 'UserID',
	onDelete: 'CASCADE',
});

Faucet.belongsTo(User, {
	foreignKey: 'UserID',
});
User.hasOne(Faucet, {
	foreignKey: 'UserID',
	onDelete: 'CASCADE',
});

AdminLog.belongsTo(User, {
	foreignKey: 'UserID',
});
User.hasOne(AdminLog, {
	foreignKey: 'UserID',
	onDelete: 'CASCADE',
});

// Sync the models with the database
async function syncModels() {
	try {
		await sequelize.authenticate();
		console.log('Connection to the database has been established successfully.');

		// Sync all models with the database, create tables if they don't exist
		await User.sync();
		await WalletAddress.sync();
		await SocialMediaAccount.sync();
		await UserCredential.sync();
		await OAuth2Provider.sync();
		await OAuth2Authorization.sync();
		await OAuth2Token.sync();
		await TwoFactorAuth.sync();
		await Tip.sync();
		await BatchTip.sync();
		await BatchTipRecipient.sync();
		await Withdrawal.sync();
		await Faucet.sync();
		await AdminLog.sync();
		await Service.sync();
		await ValidationKey.sync();

		console.log('Database and tables have been created/updated successfully.');
	}
	catch (error) {
		console.error('Error connecting to the database:', error);
	}
}

// Run the syncModels function
syncModels();
