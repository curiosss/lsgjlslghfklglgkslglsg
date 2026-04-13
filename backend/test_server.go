package main

import (
	"fmt"
	"io"
	"net/http"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	// Handle /token/ specially
	e.POST("/token/", func(c echo.Context) error {
		body, err := io.ReadAll(c.Request().Body)
		if err != nil {
			return c.String(http.StatusInternalServerError, "Failed to read body")
		}

		fmt.Printf("\n--- NEW POST REQUEST TO /token/ ---\n")
		fmt.Printf("From: %s\n", c.RealIP())
		fmt.Printf("Body:\n%s\n", string(body))
		fmt.Printf("-----------------------------------\n\n")

		return c.JSON(http.StatusOK, map[string]interface{}{
			"access": "fake-jwt-access-token-12345",
		})
	})

	// Catch-all for any other path (Echo allows wildcard routes)
	e.POST("/import-product/", func(c echo.Context) error {
		body, err := io.ReadAll(c.Request().Body)
		if err != nil {
			return c.String(http.StatusInternalServerError, "Failed to read body")
		}

		fmt.Printf("\n--- NEW POST REQUEST ---\n")
		fmt.Printf("From: %s\n", c.RealIP())
		fmt.Printf("Path: %s\n", c.Request().URL.Path)
		fmt.Printf("Body:\n%s\n", string(body))
		fmt.Printf("------------------------\n\n")

		return c.String(http.StatusOK, "Received successfully")
	})

	port := 8090
	fmt.Printf("Starting simple Echo test server on http://localhost:%d\n", port)
	fmt.Println("Waiting for POST requests...")

	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", port)))
}

// --- NEW POST REQUEST ---
// From: 192.168.0.105
// Path: /import-product/
// Body:
// {"rows":[{"goods_id":"{E0BA8E75-6C0A-4980-8E50-B56F539112DA}","count_goods":"10","price":"20","discount_price":"0","code":"1234576785","name":"TEST \u0422\u043E\u0432\u0430\u0440","group_title":"Topar","measure_title":"\u0448\u0442.","barcode":"","goods_color":"","goods_size":"","model":"","producer":""}]}
