import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
	...defaultStatements,
	user: [
		"create",
		"read",
		"update",
		"delete",
		"list",
		"ban",
		"impersonate",
		"set-role",
		"set-password"
	],
	userProfile: ["create", "read", "update", "delete", "list"],
	account: ["read", "list", "delete"],
	verification: ["read", "list", "delete"],
	bank: ["create", "read", "update", "delete", "list"],
	branch: ["create", "read", "update", "delete", "list"],
	cardProvider: ["create", "read", "update", "delete", "list"],
	bankAccount: ["create", "read", "update", "delete", "list", "freeze", "unfreeze"],
	card: ["create", "read", "update", "delete", "list", "block", "unblock"],
	transaction: ["create", "read", "list", "reverse", "flag"],
	beneficiary: ["create", "read", "update", "delete", "list"],
	dispute: ["create", "read", "update", "list", "approve", "reject", "close"],
	loan: ["create", "read", "update", "list", "approve", "reject", "disburse"],
	loanInstallment: ["read", "list", "mark-paid", "reschedule"],
	kycDocument: ["create", "read", "update", "delete", "list", "approve", "reject"],
	notification: ["create", "read", "delete", "list", "mark-read"],
	zakatCalculation: ["create", "read", "delete", "list"],
	auditLog: ["read", "list", "export"],
	session: ["list", "revoke"]
} as const;

export const ac = createAccessControl(statement);

export const customer = ac.newRole({
	userProfile: ["read", "update"],
	account: ["read", "list"],
	bankAccount: ["read", "list"],
	card: ["read", "list", "block", "unblock"],
	transaction: ["create", "read", "list"],
	beneficiary: ["create", "read", "update", "delete", "list"],
	dispute: ["create", "read", "list"],
	loan: ["create", "read", "list"],
	loanInstallment: ["read", "list"],
	kycDocument: ["create", "read", "list"],
	notification: ["read", "delete", "list", "mark-read"],
	zakatCalculation: ["create", "read", "delete", "list"],
	bank: ["read", "list"],
	branch: ["read", "list"],
	cardProvider: ["read", "list"]
});

export const support_agent = ac.newRole({
	user: ["read", "list"],
	userProfile: ["read", "list"],
	account: ["read", "list"],
	verification: ["read", "list"],
	bankAccount: ["read", "list"],
	card: ["read", "list"],
	transaction: ["read", "list"],
	beneficiary: ["read", "list"],
	dispute: ["read", "list", "update"],
	loan: ["read", "list"],
	loanInstallment: ["read", "list"],
	kycDocument: ["read", "list"],
	notification: ["create", "read", "delete", "list"],
	bank: ["read", "list"],
	branch: ["read", "list"],
	cardProvider: ["read", "list"],
	session: ["list"]
});

export const compliance_officer = ac.newRole({
	user: ["read", "list"],
	userProfile: ["read", "list"],
	account: ["read", "list"],
	verification: ["read", "list"],
	bankAccount: ["read", "list"],
	card: ["read", "list"],
	transaction: ["read", "list", "flag"],
	beneficiary: ["read", "list"],
	dispute: ["read", "list", "close"],
	loan: ["read", "list"],
	loanInstallment: ["read", "list"],
	kycDocument: ["read", "list", "approve", "reject", "update"],
	notification: ["create", "read", "delete", "list"],
	bank: ["read", "list"],
	branch: ["read", "list"],
	cardProvider: ["read", "list"],
	auditLog: ["read", "list", "export"],
	session: ["list"]
});

export const branch_manager = ac.newRole({
	user: ["read", "list", "update"],
	userProfile: ["read", "list", "update"],
	account: ["read", "list"],
	verification: ["read", "list"],
	bankAccount: ["create", "read", "update", "list", "freeze", "unfreeze"],
	card: ["create", "read", "update", "list", "block", "unblock"],
	cardProvider: ["create", "read", "update", "list"],
	transaction: ["create", "read", "list", "reverse", "flag"],
	beneficiary: ["read", "list"],
	dispute: ["create", "read", "update", "list", "approve", "reject", "close"],
	loan: ["create", "read", "update", "list", "approve", "reject", "disburse"],
	loanInstallment: ["read", "list", "mark-paid", "reschedule"],
	kycDocument: ["read", "list", "approve", "reject", "update"],
	notification: ["create", "read", "delete", "list"],
	bank: ["create", "read", "update", "list"],
	branch: ["create", "read", "update", "list"],
	auditLog: ["read", "list"],
	session: ["list", "revoke"]
});

export const admin = ac.newRole({
	...adminAc.statements,
	user: [
		"create",
		"read",
		"update",
		"delete",
		"list",
		"ban",
		"impersonate",
		"set-role",
		"set-password"
	],
	userProfile: ["create", "read", "update", "delete", "list"],
	account: ["read", "list", "delete"],
	verification: ["read", "list", "delete"],
	bank: ["create", "read", "update", "delete", "list"],
	branch: ["create", "read", "update", "delete", "list"],
	cardProvider: ["create", "read", "update", "delete", "list"],
	bankAccount: ["create", "read", "update", "delete", "list", "freeze", "unfreeze"],
	card: ["create", "read", "update", "delete", "list", "block", "unblock"],
	transaction: ["create", "read", "list", "reverse", "flag"],
	beneficiary: ["create", "read", "update", "delete", "list"],
	dispute: ["create", "read", "update", "list", "approve", "reject", "close"],
	loan: ["create", "read", "update", "list", "approve", "reject", "disburse"],
	loanInstallment: ["read", "list", "mark-paid", "reschedule"],
	kycDocument: ["create", "read", "update", "delete", "list", "approve", "reject"],
	notification: ["create", "read", "delete", "list", "mark-read"],
	zakatCalculation: ["create", "read", "delete", "list"],
	auditLog: ["read", "list", "export"],
	session: ["list", "revoke"]
});
