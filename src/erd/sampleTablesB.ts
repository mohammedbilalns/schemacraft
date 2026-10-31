export const SAMPLE_TABLES_B = `expenses [icon: receipt, color: orange] {
  id string pk
  tripId string fk
  driverId string fk
  recieptImageRef string
  amount number
  description string
  createdAt timestamp
  updatedAt timestamp
}

trip_payroll_records [icon: wallet, color: purple] {
  id string pk
  tripId string fk
  driverId string fk
  companyId string fk
  tripAmount number
  driverPayoutPercent number
  companyPayoutPercent number
  driverShare number
  companyShare number
  totalAmount number
  paymentStatus string
  payoutStatus string
  createdAt timestamp
  creditedAt timestamp
}

wallets [icon: wallet-cards, color: purple] {
  id string pk
  driverId string fk
  balance number
  createdAt timestamp
  updatedAt timestamp
}

wallet_transactions [icon: arrow-up-right, color: purple] {
  id string pk
  walletId string fk
  driverId string fk
  tripId string fk
  tripPayrollRecordId string fk
  amount number
  transactionType string
  createdAt timestamp
}

statements [icon: file-text, color: red] {
  id string pk
  companyId string fk
  createdByUserId string fk
  periodStart date
  periodEnd date
  totalTripAmount number
  totalDriverShare number
  totalCompanyShare number
  status string
  publishedAt timestamp
  createdAt timestamp
  updatedAt timestamp
}

statement_trips [icon: list, color: red] {
  id string pk
  statementId string fk
  tripId string fk
  tripAmount number
  driverPayoutPercent number
  companyPayoutPercent number
  driverShare number
  companyShare number
  createdAt timestamp
} 

statement_verifications [icon: shield-check, color: red] {
  id string pk
  statementId string fk
  adminUserId string fk
  verificationOrder number
  verifiedAt timestamp
}

audit_logs [icon: history, color: gray] {
  id string pk
  userId string fk
  action string
  entityType string
  entityId string
  previousValue json
  newValue json
  createdAt timestamp
}

vehicles [icon: car, color: green] {
  id string pk
  companyId string fk
  registrationNumber string
  vehicleType string
  model string
  status string
  createdAt timestamp
  updatedAt timestamp
}`;
