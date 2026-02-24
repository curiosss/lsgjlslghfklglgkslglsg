package models

import "time"

type Brand struct {
	ID        int       `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	LogoUrl   *string   `json:"logo_url" db:"logo_url"`
	SortOrder int       `json:"sort_order" db:"sort_order"`
	IsActive  bool      `json:"is_active" db:"is_active"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type BrandResponse struct {
	ID      int     `json:"id"`
	Name    string  `json:"name"`
	LogoUrl *string `json:"logo_url,omitempty"`
}

type CreateBrandRequest struct {
	Name      string  `json:"name" validate:"required,min=1,max=255"`
	LogoUrl   *string `json:"logo_url"`
	SortOrder int     `json:"sort_order"`
	IsActive  *bool   `json:"is_active"`
}

type UpdateBrandRequest struct {
	Name      *string `json:"name" validate:"omitempty,min=1,max=255"`
	LogoUrl   *string `json:"logo_url"`
	SortOrder *int    `json:"sort_order"`
	IsActive  *bool   `json:"is_active"`
}

func (b *Brand) ToResponse() BrandResponse {
	return BrandResponse{
		ID:      b.ID,
		Name:    b.Name,
		LogoUrl: b.LogoUrl,
	}
}
