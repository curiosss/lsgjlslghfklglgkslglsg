package models

import (
	"time"

	"github.com/lib/pq"
)

type Product struct {
	ID              int            `json:"id" db:"id"`
	NameRu          string         `json:"name_ru" db:"name_ru"`
	NameTm          string         `json:"name_tm" db:"name_tm"`
	NameEn          string         `json:"name_en" db:"name_en"`
	BrandID         *int           `json:"brand_id" db:"brand_id"`
	CategoryID      *int           `json:"category_id" db:"category_id"`
	SubCategoryID   *int           `json:"subcategory_id" db:"subcategory_id"`
	DescriptionRu   *string        `json:"description_ru" db:"description_ru"`
	DescriptionTm   *string        `json:"description_tm" db:"description_tm"`
	DescriptionEn   *string        `json:"description_en" db:"description_en"`
	Price           float64        `json:"price" db:"price"`
	OldPrice        *float64       `json:"old_price" db:"old_price"`
	DiscountPercent *int           `json:"discount_percent" db:"discount_percent"`
	ImageUrl        string         `json:"image_url" db:"image_url"`
	Images          pq.StringArray `json:"images" db:"images"`
	Barcode         *string        `json:"barcode" db:"barcode"`
	IsActive        bool           `json:"is_active" db:"is_active"`
	IsNew           bool           `json:"is_new" db:"is_new"`
	IsDiscount      bool           `json:"is_discount" db:"is_discount"`
	SortOrder       int            `json:"sort_order" db:"sort_order"`
	CreatedAt       time.Time      `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at" db:"updated_at"`
	// Joined fields (not in DB)
	BrandName *string `json:"brand_name,omitempty" db:"brand_name"`
}

type ProductResponse struct {
	ID              int      `json:"id"`
	Name            string   `json:"name"`
	BrandName       string   `json:"brand_name"`
	BrandID         *int     `json:"brand_id,omitempty"`
	CategoryID      *int     `json:"category_id,omitempty"`
	SubCategoryID   *int     `json:"subcategory_id,omitempty"`
	Description     *string  `json:"description,omitempty"`
	Price           float64  `json:"price"`
	OldPrice        *float64 `json:"old_price,omitempty"`
	DiscountPercent *int     `json:"discount_percent,omitempty"`
	ImageUrl        string   `json:"image_url"`
	Images          []string `json:"images,omitempty"`
	Barcode         *string  `json:"barcode,omitempty"`
	IsNew           bool     `json:"is_new"`
	IsDiscount      bool     `json:"is_discount"`
}

type ProductFilters struct {
	CategoryID    *int
	SubCategoryID *int
	BrandID       *int
	Search        string
	Sort          string
	IsNew         *bool
	IsDiscount    *bool
}

type CreateProductRequest struct {
	NameRu          string   `json:"name_ru" validate:"required,min=1,max=500"`
	NameTm          string   `json:"name_tm" validate:"required,min=1,max=500"`
	NameEn          string   `json:"name_en" validate:"omitempty,max=500"`
	BrandID         *int     `json:"brand_id"`
	CategoryID      *int     `json:"category_id"`
	SubCategoryID   *int     `json:"subcategory_id"`
	DescriptionRu   *string  `json:"description_ru"`
	DescriptionTm   *string  `json:"description_tm"`
	DescriptionEn   *string  `json:"description_en"`
	Price           float64  `json:"price" validate:"required,gt=0"`
	OldPrice        *float64 `json:"old_price" validate:"omitempty,gt=0"`
	DiscountPercent *int     `json:"discount_percent"`
	ImageUrl        string   `json:"image_url" validate:"required"`
	Images          []string `json:"images"`
	Barcode         *string  `json:"barcode"`
	IsActive        *bool    `json:"is_active"`
	IsNew           *bool    `json:"is_new"`
	IsDiscount      *bool    `json:"is_discount"`
	SortOrder       int      `json:"sort_order"`
}

type UpdateProductRequest struct {
	NameRu          *string  `json:"name_ru" validate:"omitempty,min=1,max=500"`
	NameTm          *string  `json:"name_tm" validate:"omitempty,min=1,max=500"`
	NameEn          *string  `json:"name_en" validate:"omitempty,max=500"`
	BrandID         *int     `json:"brand_id"`
	CategoryID      *int     `json:"category_id"`
	SubCategoryID   *int     `json:"subcategory_id"`
	DescriptionRu   *string  `json:"description_ru"`
	DescriptionTm   *string  `json:"description_tm"`
	DescriptionEn   *string  `json:"description_en"`
	Price           *float64 `json:"price" validate:"omitempty,gt=0"`
	OldPrice        *float64 `json:"old_price"`
	DiscountPercent *int     `json:"discount_percent"`
	ImageUrl        *string  `json:"image_url"`
	Images          []string `json:"images"`
	Barcode         *string  `json:"barcode"`
	IsActive        *bool    `json:"is_active"`
	IsNew           *bool    `json:"is_new"`
	IsDiscount      *bool    `json:"is_discount"`
	SortOrder       *int     `json:"sort_order"`
}

func (p *Product) ToResponse(lang string) ProductResponse {
	name := p.NameRu
	description := p.DescriptionRu
	if lang == "tm" {
		name = p.NameTm
		if p.DescriptionTm != nil {
			description = p.DescriptionTm
		}
	} else if lang == "en" {
		if p.NameEn != "" {
			name = p.NameEn
		}
		if p.DescriptionEn != nil {
			description = p.DescriptionEn
		}
	}

	brandName := ""
	if p.BrandName != nil {
		brandName = *p.BrandName
	}

	var images []string
	if len(p.Images) > 0 {
		images = []string(p.Images)
	}

	return ProductResponse{
		ID:              p.ID,
		Name:            name,
		BrandName:       brandName,
		BrandID:         p.BrandID,
		CategoryID:      p.CategoryID,
		SubCategoryID:   p.SubCategoryID,
		Description:     description,
		Price:           p.Price,
		OldPrice:        p.OldPrice,
		DiscountPercent: p.DiscountPercent,
		ImageUrl:        p.ImageUrl,
		Images:          images,
		Barcode:         p.Barcode,
		IsNew:           p.IsNew,
		IsDiscount:      p.IsDiscount,
	}
}
