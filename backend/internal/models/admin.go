package models

import "time"

type AdminRole string

const (
	RoleSuperAdmin AdminRole = "superadmin"
	RoleAdmin      AdminRole = "admin"
	RoleManager    AdminRole = "manager"
	RolePOS        AdminRole = "pos"
)

type Admin struct {
	ID           int       `json:"id" db:"id"`
	Username     string    `json:"username" db:"username"`
	PasswordHash string    `json:"-" db:"password_hash"`
	FullName     *string   `json:"full_name" db:"full_name"`
	Role         AdminRole `json:"role" db:"role"`
	IsActive     bool      `json:"is_active" db:"is_active"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

type AdminResponse struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	FullName  *string   `json:"full_name,omitempty"`
	Role      AdminRole `json:"role"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type LoginResponse struct {
	AccessToken  string        `json:"access_token"`
	RefreshToken string        `json:"refresh_token"`
	ExpiresIn    int64         `json:"expires_in"`
	Admin        AdminResponse `json:"admin"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

type CreateAdminRequest struct {
	Username string    `json:"username" validate:"required,min=3,max=100"`
	Password string    `json:"password" validate:"required,min=6"`
	FullName *string   `json:"full_name"`
	Role     AdminRole `json:"role" validate:"required,oneof=superadmin admin manager"`
}

type UpdateAdminRequest struct {
	Username *string    `json:"username" validate:"omitempty,min=3,max=100"`
	Password *string    `json:"password" validate:"omitempty,min=6"`
	FullName *string    `json:"full_name"`
	Role     *AdminRole `json:"role" validate:"omitempty,oneof=superadmin admin manager"`
	IsActive *bool      `json:"is_active"`
}

func (a *Admin) ToResponse() AdminResponse {
	return AdminResponse{
		ID:        a.ID,
		Username:  a.Username,
		FullName:  a.FullName,
		Role:      a.Role,
		IsActive:  a.IsActive,
		CreatedAt: a.CreatedAt,
	}
}
