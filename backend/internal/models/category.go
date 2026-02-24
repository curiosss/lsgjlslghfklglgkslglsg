package models

import "time"

type Category struct {
	ID               int       `json:"id" db:"id"`
	NameRu           string    `json:"name_ru" db:"name_ru"`
	NameTm           string    `json:"name_tm" db:"name_tm"`
	ImageUrl         *string   `json:"image_url" db:"image_url"`
	HasSubCategories bool      `json:"has_subcategories" db:"has_subcategories"`
	SortOrder        int       `json:"sort_order" db:"sort_order"`
	IsActive         bool      `json:"is_active" db:"is_active"`
	CreatedAt        time.Time `json:"created_at" db:"created_at"`
}

type CategoryResponse struct {
	ID               int                    `json:"id"`
	Name             string                 `json:"name"`
	ImageUrl         *string                `json:"image_url,omitempty"`
	HasSubCategories bool                   `json:"has_subcategories"`
	SubCategories    []SubCategoryResponse  `json:"subcategories,omitempty"`
}

type CreateCategoryRequest struct {
	NameRu    string  `json:"name_ru" validate:"required,min=1,max=255"`
	NameTm    string  `json:"name_tm" validate:"required,min=1,max=255"`
	ImageUrl  *string `json:"image_url"`
	SortOrder int     `json:"sort_order"`
	IsActive  *bool   `json:"is_active"`
}

type UpdateCategoryRequest struct {
	NameRu    *string `json:"name_ru" validate:"omitempty,min=1,max=255"`
	NameTm    *string `json:"name_tm" validate:"omitempty,min=1,max=255"`
	ImageUrl  *string `json:"image_url"`
	SortOrder *int    `json:"sort_order"`
	IsActive  *bool   `json:"is_active"`
}

func (c *Category) ToResponse(lang string) CategoryResponse {
	name := c.NameRu
	if lang == "tm" {
		name = c.NameTm
	}
	return CategoryResponse{
		ID:               c.ID,
		Name:             name,
		ImageUrl:         c.ImageUrl,
		HasSubCategories: c.HasSubCategories,
	}
}
