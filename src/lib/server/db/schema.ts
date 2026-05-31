import { relations } from "drizzle-orm";
import {
	pgTable,
	text,
	timestamp,
	boolean,
	index,
	pgEnum,
	varchar,
	date,
	uniqueIndex,
	numeric,
	jsonb
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("role", [
	"customer",
	"support_agent",
	"compliance_officer",
	"branch_manager",
	"admin"
]);

export const auditActionEnum = pgEnum("audit_action", [
	"CREATE",
	"UPDATE",
	"DELETE",
	"LOGIN",
	"LOGOUT",
	"TRANSFER",
	"DEPOSIT",
	"WITHDRAWAL",
	"PASSWORD_CHANGE",
	"PIN_CHANGE",
	"ACCOUNT_FREEZE",
	"ACCOUNT_UNFREEZE"
]);
export const auditStatusEnum = pgEnum("audit_status", ["SUCCESS", "FAILED", "PENDING"]);

export const bankAccountTypeEnum = pgEnum("account_type", ["current", "savings", "fixed_deposit"]);
export const bankAccountStatusEnum = pgEnum("account_status", [
	"active",
	"inactive",
	"suspended",
	"closed"
]);
export const currencyEnum = pgEnum("currency", ["PKR", "USD", "GBP", "EUR", "SAR", "AED"]);

export const pakistanProvinceEnum = pgEnum("pakistan_province", [
	"sindh",
	"punjab",
	"kpk",
	"balochistan",
	"gilgit_baltistan",
	"ajk"
]);
export const pakistanCityEnum = pgEnum("pakistan_city", [
	"karachi",
	"lahore",
	"islamabad",
	"rawalpindi",
	"faisalabad",
	"multan",
	"peshawar",
	"quetta",
	"sialkot",
	"gujranwala"
]);

export const cardTypeEnum = pgEnum("card_type", ["debit", "credit", "prepaid"]);
export const cardStatusEnum = pgEnum("card_status", [
	"active",
	"inactive",
	"blocked",
	"expired",
	"lost",
	"stolen"
]);
export const cardProviderNameEnum = pgEnum("provider_name", ["visa", "mastercard", "paypal"]);
export const cardProviderCodeEnum = pgEnum("provider_code", ["VISA", "MASTERCARD", "PAYPAL"]);

export const transactionTypeEnum = pgEnum("transaction_type", [
	"deposit",
	"withdrawal",
	"transfer_in",
	"transfer_out",
	"loan_disbursement",
	"loan_repayment",
	"fee",
	"refund"
]);
export const transactionCategoryEnum = pgEnum("transaction_category", [
	"credit",
	"debit",
	"internal"
]);
export const transactionModeEnum = pgEnum("transaction_mode", [
	"ibft",
	"raast",
	"atm",
	"cash",
	"cheque",
	"internal"
]);
export const transactionStatusEnum = pgEnum("transaction_status", [
	"pending",
	"processing",
	"completed",
	"failed",
	"reversed",
	"cancelled"
]);

export const disputeTypeEnum = pgEnum("dispute_type", [
	"unauthorized_transaction",
	"duplicate_charge",
	"incorrect_amount",
	"merchant_not_received",
	"refund_not_processed",
	"card_fraud",
	"other"
]);
export const disputeStatusEnum = pgEnum("dispute_status", [
	"open",
	"under_review",
	"resolved",
	"rejected",
	"escalated"
]);
export const disputePriorityEnum = pgEnum("dispute_priority", [
	"low",
	"medium",
	"high",
	"critical"
]);

export const loanStatusEnum = pgEnum("loan_status", [
	"pending",
	"approved",
	"active",
	"completed",
	"defaulted",
	"rejected"
]);
export const loanPurposeEnum = pgEnum("loan_purpose", [
	"education",
	"medical",
	"business",
	"home_renovation",
	"wedding",
	"other"
]);

export const installmentStatusEnum = pgEnum("installment_status", [
	"pending",
	"paid",
	"late",
	"missed"
]);

export const kycDocumentTypeEnum = pgEnum("kyc_document_type", [
	"cnic",
	"passport",
	"driving_license",
	"ntn",
	"utility_bill"
]);
export const kycVerificationStatusEnum = pgEnum("kyc_verification_status", [
	"pending",
	"under_review",
	"verified",
	"rejected",
	"expired"
]);

export const notificationTypeEnum = pgEnum("notification_type", [
	"transaction",
	"loan_installment",
	"kyc_update",
	"dispute_update",
	"account_alert",
	"general"
]);
export const notificationChannelEnum = pgEnum("notification_channel", ["email", "push"]);

export const nisabTypeEnum = pgEnum("nisab_type", ["gold", "silver"]);

export const profileKycStatusEnum = pgEnum("profile_kyc_status", [
	"not_submitted",
	"pending",
	"under_review",
	"verified",
	"rejected"
]);
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	role: userRoleEnum("role").default("customer").notNull(),
	banned: boolean("banned").default(false),
	banReason: text("ban_reason"),
	banExpires: timestamp("ban_expires"),
	username: text("username").unique(),
	displayUsername: text("display_username")
});

export const sessions = pgTable(
	"sessions",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		impersonatedBy: text("impersonated_by")
	},
	(table) => [index("sessions_userId_idx").on(table.userId)]
);

export const accounts = pgTable(
	"accounts",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [index("accounts_userId_idx").on(table.userId)]
);

export const verifications = pgTable(
	"verifications",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [index("verifications_identifier_idx").on(table.identifier)]
);

export const userProfiles = pgTable("user_profiles", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.unique()
		.references(() => users.id, { onDelete: "cascade" }),
	phoneNumber: varchar("phone_number", { length: 20 }).unique(),
	profileImageUrl: text("profile_image_url"),
	address: text("address"),
	city: pakistanCityEnum("city"),
	gender: genderEnum("gender"),
	dob: date("dob", { mode: "string" }),
	country: varchar("country", { length: 100 }).default("Pakistan"),
	zipCode: varchar("zip_code", { length: 20 }),
	kycStatus: profileKycStatusEnum("kyc_status").default("not_submitted"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const banks = pgTable(
	"banks",
	{
		id: text("id").primaryKey(),
		bankName: varchar("bank_name", { length: 256 }).notNull().unique(),
		bankCode: varchar("bank_code", { length: 50 }).notNull().unique(),
		swiftCode: varchar("swift_code", { length: 50 }).notNull().unique(),
		niftCode: varchar("nift_code", { length: 50 }),
		website: varchar("website", { length: 256 }),
		logoUrl: text("logo_url"),
		contactPhone: varchar("contact_phone", { length: 20 }),
		contactEmail: varchar("contact_email", { length: 256 }),
		isActive: boolean("is_active").default(true).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index("banks_bankCode_idx").on(table.bankCode),
		index("banks_swiftCode_idx").on(table.swiftCode)
	]
);

export const branches = pgTable(
	"branches",
	{
		id: text("id").primaryKey(),
		bankId: text("bank_id")
			.notNull()
			.references(() => banks.id, { onDelete: "restrict" }),
		branchName: varchar("branch_name", { length: 256 }).notNull(),
		branchCode: varchar("branch_code", { length: 50 }).notNull(),
		branchAddress: text("branch_address"),
		branchCity: pakistanCityEnum("branch_city"),
		branchProvince: pakistanProvinceEnum("branch_province"),
		branchPhone: varchar("branch_phone", { length: 20 }),
		branchEmail: varchar("branch_email", { length: 256 }),
		isActive: boolean("is_active").default(true).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index("branches_bankId_idx").on(table.bankId),
		uniqueIndex("branches_bankId_branchCode_unique").on(table.bankId, table.branchCode)
	]
);

export const cardProviders = pgTable("card_providers", {
	id: text("id").primaryKey(),
	providerName: cardProviderNameEnum("provider_name").notNull().unique(),
	providerCode: cardProviderCodeEnum("provider_code").notNull().unique(),
	website: varchar("website", { length: 256 }),
	logoUrl: text("logo_url"),
	contactEmail: varchar("contact_email", { length: 256 }),
	contactPhone: varchar("contact_phone", { length: 20 }),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const bankAccounts = pgTable(
	"bank_accounts",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		branchId: text("branch_id")
			.notNull()
			.references(() => branches.id, { onDelete: "restrict" }),
		accountHolderName: varchar("account_holder_name", { length: 256 }).notNull(),
		accountNumber: varchar("account_number", { length: 50 }).notNull().unique(),
		ibanNumber: varchar("iban_number", { length: 50 }).notNull().unique(),
		accountStatus: bankAccountStatusEnum("account_status").default("active").notNull(),
		accountType: bankAccountTypeEnum("account_type").default("current").notNull(),
		currency: currencyEnum("currency").default("PKR").notNull(),
		balance: numeric("balance", { precision: 18, scale: 2 }).notNull().default("0"),
		minimumBalance: numeric("minimum_balance", { precision: 18, scale: 2 })
			.default("0")
			.notNull(),
		openedAt: timestamp("opened_at").defaultNow().notNull(),
		closedAt: timestamp("closed_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index("bankAccounts_userId_idx").on(table.userId),
		index("bankAccounts_branchId_idx").on(table.branchId),
		index("bankAccounts_accountNumber_idx").on(table.accountNumber),
		index("bankAccounts_ibanNumber_idx").on(table.ibanNumber)
	]
);

export const cards = pgTable(
	"cards",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id")
			.notNull()
			.references(() => bankAccounts.id, { onDelete: "restrict" }),
		cardProviderId: text("card_provider_id")
			.notNull()
			.references(() => cardProviders.id, { onDelete: "restrict" }),
		cardNumberMasked: varchar("card_number_masked", { length: 20 }).notNull(),
		cardHolderName: varchar("card_holder_name", { length: 256 }).notNull(),
		cardCvvHash: text("card_cvv_hash").notNull(),
		cardPinHash: text("card_pin_hash").notNull(),
		cardExpiry: date("card_expiry", { mode: "string" }).notNull(),
		cardType: cardTypeEnum("card_type").notNull(),
		cardStatus: cardStatusEnum("card_status").notNull(),
		dailyLimit: numeric("daily_limit", { precision: 18, scale: 2 }),
		monthlyLimit: numeric("monthly_limit", { precision: 18, scale: 2 }),
		issuedAt: timestamp("issued_at").defaultNow().notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index("cards_accountId_idx").on(table.accountId),
		index("cards_cardProviderId_idx").on(table.cardProviderId),
		index("cards_cardExpiry_idx").on(table.cardExpiry)
	]
);

export const beneficiaries = pgTable(
	"beneficiaries",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id")
			.notNull()
			.references(() => bankAccounts.id, { onDelete: "cascade" }),
		bankId: text("bank_id")
			.notNull()
			.references(() => banks.id, { onDelete: "restrict" }),
		beneficiaryName: varchar("beneficiary_name", { length: 256 }).notNull(),
		beneficiaryAccountNumber: varchar("beneficiary_account_number", { length: 50 }).notNull(),
		beneficiaryIbanNumber: varchar("beneficiary_iban_number", { length: 50 }),
		nickName: varchar("nick_name", { length: 100 }),
		isVerified: boolean("is_verified").default(false).notNull(),
		transferLimit: numeric("transfer_limit", { precision: 18, scale: 2 }),
		isActive: boolean("is_active").default(true).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index("beneficiaries_accountId_idx").on(table.accountId),
		index("beneficiaries_bankId_idx").on(table.bankId),
		uniqueIndex("beneficiaries_accountId_accountNumber_unique").on(
			table.accountId,
			table.beneficiaryAccountNumber
		)
	]
);

export const transactions = pgTable(
	"transactions",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id")
			.notNull()
			.references(() => bankAccounts.id, { onDelete: "restrict" }),
		beneficiaryId: text("beneficiary_id").references(() => beneficiaries.id, {
			onDelete: "set null"
		}),
		transactionReference: varchar("transaction_reference", { length: 100 }).notNull().unique(),
		transactionType: transactionTypeEnum("transaction_type").notNull(),
		transactionCategory: transactionCategoryEnum("transaction_category").notNull(),
		transactionMode: transactionModeEnum("transaction_mode").notNull(),
		amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
		currency: varchar("currency", { length: 10 }).notNull().default("PKR"),
		balanceBefore: numeric("balance_before", { precision: 18, scale: 2 }).notNull(),
		balanceAfter: numeric("balance_after", { precision: 18, scale: 2 }).notNull(),
		status: transactionStatusEnum("status").notNull().default("pending"),
		description: text("description"),
		receiverAccountNumber: varchar("receiver_account_number", { length: 50 }),
		receiverName: varchar("receiver_name", { length: 256 }),
		transactionDate: timestamp("transaction_date").defaultNow().notNull(),
		completedAt: timestamp("completed_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index("transactions_accountId_idx").on(table.accountId),
		index("transactions_beneficiaryId_idx").on(table.beneficiaryId),
		index("transactions_date_idx").on(table.transactionDate),
		index("transactions_status_idx").on(table.status),
		index("transactions_type_idx").on(table.transactionType)
	]
);

export const disputes = pgTable(
	"disputes",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		transactionId: text("transaction_id")
			.notNull()
			.references(() => transactions.id, { onDelete: "restrict" }),
		disputeType: disputeTypeEnum("dispute_type").notNull(),
		description: text("description").notNull(),
		status: disputeStatusEnum("status").default("open").notNull(),
		priority: disputePriorityEnum("priority").default("medium").notNull(),
		resolution: text("resolution"),
		resolvedBy: text("resolved_by").references(() => users.id, { onDelete: "restrict" }),
		resolvedAt: timestamp("resolved_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index("disputes_userId_idx").on(table.userId),
		index("disputes_transactionId_idx").on(table.transactionId),
		index("disputes_status_idx").on(table.status)
	]
);

export const interestFreeLoans = pgTable(
	"interest_free_loans",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id")
			.notNull()
			.references(() => bankAccounts.id, { onDelete: "restrict" }),
		loanAmount: numeric("loan_amount", { precision: 18, scale: 2 }).notNull(),
		remainingAmount: numeric("remaining_amount", { precision: 18, scale: 2 }).notNull(),
		numberOfInstallments: numeric("number_of_installments", {
			precision: 5,
			scale: 0
		}).notNull(),
		monthlyInstallment: numeric("monthly_installment", { precision: 18, scale: 2 }).notNull(),
		purpose: loanPurposeEnum("purpose"),
		status: loanStatusEnum("status").default("pending").notNull(),
		approvedBy: text("approved_by").references(() => users.id, { onDelete: "restrict" }),
		approvedAt: timestamp("approved_at"),
		rejectedBy: text("rejected_by").references(() => users.id, { onDelete: "restrict" }),
		rejectedAt: timestamp("rejected_at"),
		expectedCompletionDate: date("expected_completion_date", { mode: "string" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index("interestFreeLoans_accountId_idx").on(table.accountId),
		index("interestFreeLoans_status_idx").on(table.status)
	]
);

export const loanInstallments = pgTable(
	"loan_installments",
	{
		id: text("id").primaryKey(),
		loanId: text("loan_id")
			.notNull()
			.references(() => interestFreeLoans.id, { onDelete: "cascade" }),
		installmentNumber: numeric("installment_number", { precision: 5, scale: 0 }).notNull(),
		expectedAmount: numeric("expected_amount", { precision: 18, scale: 2 }).notNull(),
		paidAmount: numeric("paid_amount", { precision: 18, scale: 2 }).notNull(),
		balanceBefore: numeric("balance_before", { precision: 18, scale: 2 }).notNull(),
		balanceAfter: numeric("balance_after", { precision: 18, scale: 2 }).notNull(),
		status: installmentStatusEnum("status").default("pending").notNull(),
		dueDate: date("due_date", { mode: "string" }).notNull(),
		paymentDate: timestamp("payment_date"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index("loanInstallments_loanId_idx").on(table.loanId),
		index("loanInstallments_status_idx").on(table.status),
		index("loanInstallments_dueDate_idx").on(table.dueDate)
	]
);

export const kycDocuments = pgTable(
	"kyc_documents",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		documentType: kycDocumentTypeEnum("document_type").notNull(),
		documentNumber: varchar("document_number", { length: 100 }).notNull(),
		frontImageUrl: text("front_image_url").notNull(),
		backImageUrl: text("back_image_url"),
		verificationStatus: kycVerificationStatusEnum("verification_status")
			.notNull()
			.default("pending"),
		verifiedBy: text("verified_by").references(() => users.id, { onDelete: "restrict" }),
		rejectedBy: text("rejected_by").references(() => users.id, { onDelete: "restrict" }),
		rejectionReason: text("rejection_reason"),
		uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
		verifiedAt: timestamp("verified_at"),
		rejectedAt: timestamp("rejected_at"),
		expiryDate: date("expiry_date", { mode: "string" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index("kycDocuments_userId_idx").on(table.userId),
		index("kycDocuments_verificationStatus_idx").on(table.verificationStatus),
		uniqueIndex("kycDocuments_documentType_documentNumber_unique").on(
			table.documentType,
			table.documentNumber
		)
	]
);

export const notifications = pgTable(
	"notifications",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		notificationType: notificationTypeEnum("notification_type").notNull(),
		title: varchar("title", { length: 256 }).notNull(),
		message: text("message").notNull(),
		channel: notificationChannelEnum("channel").notNull(),
		isRead: boolean("is_read").default(false).notNull(),
		readAt: timestamp("read_at"),
		sentAt: timestamp("sent_at").defaultNow(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index("notifications_userId_idx").on(table.userId),
		index("notifications_isRead_idx").on(table.isRead)
	]
);

export const zakatCalculations = pgTable(
	"zakat_calculations",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		accountId: text("account_id")
			.notNull()
			.references(() => bankAccounts.id, { onDelete: "restrict" }),
		nisabType: nisabTypeEnum("nisab_type").default("silver").notNull(),
		zakatYear: varchar("zakat_year", { length: 10 }).notNull(),
		totalAssets: numeric("total_assets", { precision: 18, scale: 2 }).notNull(),
		nisabThreshold: numeric("nisab_threshold", { precision: 18, scale: 2 }).notNull(),
		zakatableAmount: numeric("zakatable_amount", { precision: 18, scale: 2 }).notNull(),
		zakatDue: numeric("zakat_due", { precision: 18, scale: 2 }).notNull(),
		calculationDate: date("calculation_date", { mode: "string" }).notNull(),
		isPaid: boolean("is_paid").default(false).notNull(),
		paidAt: timestamp("paid_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index("zakatCalculations_userId_idx").on(table.userId),
		index("zakatCalculations_accountId_idx").on(table.accountId),
		index("zakatCalculations_calculationDate_idx").on(table.calculationDate)
	]
);

export const auditLogs = pgTable(
	"audit_logs",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		action: auditActionEnum("action").notNull(),
		status: auditStatusEnum("status").default("SUCCESS").notNull(),
		tableName: varchar("table_name", { length: 100 }).notNull(),
		recordId: text("record_id"),
		oldValue: jsonb("old_value"),
		newValue: jsonb("new_value"),
		ipAddress: varchar("ip_address", { length: 50 }),
		userAgent: text("user_agent"),
		createdAt: timestamp("created_at").defaultNow().notNull()
	},
	(table) => [
		index("auditLogs_userId_idx").on(table.userId),
		index("auditLogs_tableName_idx").on(table.tableName),
		index("auditLogs_createdAt_idx").on(table.createdAt),
		index("auditLogs_recordId_idx").on(table.recordId)
	]
);

export const usersRelations = relations(users, ({ many, one }) => ({
	sessions: many(sessions),
	accounts: many(accounts),
	userProfile: one(userProfiles),
	bankAccounts: many(bankAccounts),
	kycDocuments: many(kycDocuments, { relationName: "kycDocuments_user" }),
	notifications: many(notifications),
	zakatCalculations: many(zakatCalculations),
	disputes: many(disputes, { relationName: "disputes_user" }),
	auditLogs: many(auditLogs, { relationName: "auditLogs_user" })
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	users: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	users: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	})
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
	user: one(users, { fields: [userProfiles.userId], references: [users.id] })
}));

export const banksRelations = relations(banks, ({ many }) => ({
	branches: many(branches),
	beneficiaries: many(beneficiaries)
}));

export const branchesRelations = relations(branches, ({ one, many }) => ({
	bank: one(banks, { fields: [branches.bankId], references: [banks.id] }),
	bankAccounts: many(bankAccounts)
}));

export const cardProvidersRelations = relations(cardProviders, ({ many }) => ({
	cards: many(cards)
}));

export const bankAccountsRelations = relations(bankAccounts, ({ one, many }) => ({
	user: one(users, { fields: [bankAccounts.userId], references: [users.id] }),
	branch: one(branches, { fields: [bankAccounts.branchId], references: [branches.id] }),
	cards: many(cards),
	transactions: many(transactions),
	beneficiaries: many(beneficiaries),
	interestFreeLoans: many(interestFreeLoans),
	zakatCalculations: many(zakatCalculations)
}));

export const cardsRelations = relations(cards, ({ one }) => ({
	bankAccount: one(bankAccounts, { fields: [cards.accountId], references: [bankAccounts.id] }),
	cardProvider: one(cardProviders, {
		fields: [cards.cardProviderId],
		references: [cardProviders.id]
	})
}));

export const beneficiariesRelations = relations(beneficiaries, ({ one, many }) => ({
	bankAccount: one(bankAccounts, {
		fields: [beneficiaries.accountId],
		references: [bankAccounts.id]
	}),
	bank: one(banks, { fields: [beneficiaries.bankId], references: [banks.id] }),
	transactions: many(transactions)
}));

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
	bankAccount: one(bankAccounts, {
		fields: [transactions.accountId],
		references: [bankAccounts.id]
	}),
	beneficiary: one(beneficiaries, {
		fields: [transactions.beneficiaryId],
		references: [beneficiaries.id]
	}),
	disputes: many(disputes)
}));

export const disputesRelations = relations(disputes, ({ one }) => ({
	user: one(users, {
		fields: [disputes.userId],
		references: [users.id],
		relationName: "disputes_user"
	}),
	resolver: one(users, {
		fields: [disputes.resolvedBy],
		references: [users.id],
		relationName: "disputes_resolver"
	}),
	transaction: one(transactions, {
		fields: [disputes.transactionId],
		references: [transactions.id]
	})
}));

export const interestFreeLoansRelations = relations(interestFreeLoans, ({ one, many }) => ({
	bankAccount: one(bankAccounts, {
		fields: [interestFreeLoans.accountId],
		references: [bankAccounts.id]
	}),
	approver: one(users, {
		fields: [interestFreeLoans.approvedBy],
		references: [users.id],
		relationName: "loans_approver"
	}),
	rejecter: one(users, {
		fields: [interestFreeLoans.rejectedBy],
		references: [users.id],
		relationName: "loans_rejecter"
	}),
	installments: many(loanInstallments)
}));

export const loanInstallmentsRelations = relations(loanInstallments, ({ one }) => ({
	loan: one(interestFreeLoans, {
		fields: [loanInstallments.loanId],
		references: [interestFreeLoans.id]
	})
}));

export const kycDocumentsRelations = relations(kycDocuments, ({ one }) => ({
	user: one(users, {
		fields: [kycDocuments.userId],
		references: [users.id],
		relationName: "kycDocuments_user"
	}),
	verifier: one(users, {
		fields: [kycDocuments.verifiedBy],
		references: [users.id],
		relationName: "kycDocuments_verifier"
	}),
	rejecter: one(users, {
		fields: [kycDocuments.rejectedBy],
		references: [users.id],
		relationName: "kycDocuments_rejecter"
	})
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
	user: one(users, { fields: [notifications.userId], references: [users.id] })
}));

export const zakatCalculationsRelations = relations(zakatCalculations, ({ one }) => ({
	user: one(users, { fields: [zakatCalculations.userId], references: [users.id] }),
	bankAccount: one(bankAccounts, {
		fields: [zakatCalculations.accountId],
		references: [bankAccounts.id]
	})
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
	user: one(users, {
		fields: [auditLogs.userId],
		references: [users.id],
		relationName: "auditLogs_user"
	})
}));
