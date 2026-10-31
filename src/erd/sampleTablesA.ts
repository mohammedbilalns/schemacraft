export const SAMPLE_TABLES_A = `users [icon: user, color: blue] {
  id string pk
  role string 
  email string
  phone string  
  passwordHash string
  isActive boolean
  createdAt timestamp
  updatedAt timestamp
}

companies [icon: building-2, color: blue] {
  id string pk
  name string
  contactPerson string
  contactPhone string
  contactEmail string
  address string
  otherInfo string
  driverPayoutPercent number
  companyPayoutPercent number
  createdAt timestamp
  updatedAt timestamp
}

drivers [icon: car, color: green] {
  id string pk
  userId string fk
  fullName string
  phone string
  activeStatus string
  isOnline boolean
  createdAt timestamp
  updatedAt timestamp
}

driver_documents [icon: file-text, color: green] {
  id string pk
  driverId string fk
  documentType string
  fileRef string
  createdAt timestamp
  updatedAt timestamp
}

driver_availability [icon: calendar, color: green] {
  id string pk
  driverId string fk
  availableDate date
  isAvailable boolean
  createdAt timestamp
  updatedAt timestamp
}

orders [icon: clipboard-list, color: orange] {
  id string pk
  companyId string fk
  createdByUserId string fk
  source  "admin" | "buisiness"
  pickup string
  drop string
  scheduledAt timestamp
  vehicleServiceNotes string
  contactName string
  contactPhone string
  contactEmail string  ??
  status string
  rejectionReason string
  rejectedAdminId string
  cancellationReason string  //
  createdAt timestamp
  updatedAt timestamp
}

trips [icon: route, color: orange] {
  id string pk
  orderId string fk
  driverId string fk
  amount number
  etaMinutes number
  etaSource string  // "map" | "admin"
  closeOtp string
  selfieFileRef string
  status string
  assignedAt timestamp
  startedAt timestamp
  closedAt timestamp
  createdAt timestamp
  updatedAt timestamp
}

trip_assignment_history [icon: history, color: orange] {
  id string pk
  tripId string fk
  driverId string fk
  assignedByUserId string fk
  assignedAt timestamp
  unassignedAt timestamp
}`;
