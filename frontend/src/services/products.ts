import { apiFetch } from "./http"

/* =====================
   TYPES
===================== */
export type Product = {
    id: number
    name: string
    price: number
    description?: string
    imageUrl?: string
    stock?: number
    categoryId?: number
}

/* =====================
   PUBLIC APIs
===================== */

// GET /api/products/public
export function getPublicProducts() {
    return apiFetch("/api/products/public") as Promise<Product[]>
}

// GET /api/products/public/{id}
export function getPublicProductById(id: number) {
    return apiFetch(`/api/products/public/${id}`) as Promise<Product>
}

// GET /api/products/public/search
export type ProductSearchParams = {
    name?: string
    categoryId?: number
    minPrice?: number
    maxPrice?: number
}

export function searchPublicProducts(params: ProductSearchParams) {
    const qs = new URLSearchParams()

    if (params.name) qs.append("name", params.name)
    if (params.categoryId !== undefined) qs.append("categoryId", String(params.categoryId))
    if (params.minPrice !== undefined) qs.append("minPrice", String(params.minPrice))
    if (params.maxPrice !== undefined) qs.append("maxPrice", String(params.maxPrice))

    const query = qs.toString()
    return apiFetch(`/api/products/public/search${query ? `?${query}` : ""}`) as Promise<Product[]>
}

/* =====================
   ADMIN APIs
===================== */

// POST /api/products/admin
export function createProduct(product: Partial<Product>) {
    return apiFetch("/api/products/admin", {
        method: "POST",
        body: JSON.stringify(product),
    }) as Promise<Product>
}

// PUT /api/products/admin/{id}
export function updateProduct(id: number, product: Partial<Product>) {
    return apiFetch(`/api/products/admin/${id}`, {
        method: "PUT",
        body: JSON.stringify(product),
    }) as Promise<Product>
}

// DELETE /api/products/admin/{id}
export function deleteProduct(id: number) {
    return apiFetch(`/api/products/admin/${id}`, {
        method: "DELETE",
    }) as Promise<void>
}

// PUT /api/products/admin/{id}/add-stock
export function addStock(id: number, quantity: number) {
    return apiFetch(`/api/products/admin/${id}/add-stock?quantity=${quantity}`, {
        method: "PUT",
    }) as Promise<void>
}

// PUT /api/products/admin/{id}/reduce-stock
export function reduceStock(id: number, quantity: number) {
    return apiFetch(`/api/products/admin/${id}/reduce-stock?quantity=${quantity}`, {
        method: "PUT",
    }) as Promise<void>
}
