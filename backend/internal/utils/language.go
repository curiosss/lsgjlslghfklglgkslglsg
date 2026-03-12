package utils

import "github.com/gin-gonic/gin"

func GetLang(c *gin.Context) string {
	lang := c.Query("lang")
	if lang == "tm" {
		return "tm"
	}
	if lang == "en" {
		return "en"
	}
	return "ru"
}
