package models

import "time"

type Banner struct {
	ID        int       `json:"id" db:"id"`
	ImageUrl  string    `json:"image_url" db:"image_url"`
	LinkType  *string   `json:"link_type" db:"link_type"`
	LinkValue *string   `json:"link_value" db:"link_value"`
	SortOrder int       `json:"sort_order" db:"sort_order"`
	IsActive  bool      `json:"is_active" db:"is_active"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type BannerResponse struct {
	ID        int     `json:"id"`
	ImageUrl  string  `json:"image_url"`
	LinkType  *string `json:"link_type,omitempty"`
	LinkValue *string `json:"link_value,omitempty"`
}

type CreateBannerRequest struct {
	ImageUrl  string  `json:"image_url" validate:"required"`
	LinkType  *string `json:"link_type"`
	LinkValue *string `json:"link_value"`
	SortOrder int     `json:"sort_order"`
	IsActive  *bool   `json:"is_active"`
}

type UpdateBannerRequest struct {
	ImageUrl  *string `json:"image_url"`
	LinkType  *string `json:"link_type"`
	LinkValue *string `json:"link_value"`
	SortOrder *int    `json:"sort_order"`
	IsActive  *bool   `json:"is_active"`
}

func (b *Banner) ToResponse() BannerResponse {
	return BannerResponse{
		ID:        b.ID,
		ImageUrl:  b.ImageUrl,
		LinkType:  b.LinkType,
		LinkValue: b.LinkValue,
	}
}
