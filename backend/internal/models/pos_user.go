package models

import "time"

type POSUser struct {
	ID           int       `json:"id" db:"id"`
	Username     string    `json:"username" db:"username"`
	PasswordHash string    `json:"-" db:"password_hash"`
	IsActive     bool      `json:"is_active" db:"is_active"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

type POSUserResponse struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}

type CreatePOSUserRequest struct {
	Username string `json:"username" validate:"required,min=3,max=100"`
	Password string `json:"password" validate:"required,min=6"`
	IsActive *bool  `json:"is_active"`
}

type UpdatePOSUserRequest struct {
	Username *string `json:"username" validate:"omitempty,min=3,max=100"`
	Password *string `json:"password" validate:"omitempty,min=6"`
	IsActive *bool   `json:"is_active"`
}

func (u *POSUser) ToResponse() POSUserResponse {
	return POSUserResponse{
		ID:        u.ID,
		Username:  u.Username,
		IsActive:  u.IsActive,
		CreatedAt: u.CreatedAt,
	}
}
