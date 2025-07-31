import { defineStore } from "pinia";
import api from "../services/api";
import type { Product, ProductFormData } from "../types";

export const useProductStore = defineStore("products", {
    state: () => ({
        products: [] as Product[],
        currentProduct: null as Product | null,
        loading: false,
        pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0,
        },
    }),

    actions: {
        async fetchProducts(page = 1) {
            this.loading = true;
            try {
                const response = await api.get(`/api/products?page=${page}`);

                this.products = response.data.data;
                this.pagination = {
                    current_page: response.data.current_page,
                    last_page: response.data.last_page,
                    per_page: response.data.per_page,
                    total: response.data.total,
                };
            } catch (error) {
                console.log("Failed to fetch products", error);
            } finally {
                this.loading = false;
            }
        },
        async createProduct(productData: ProductFormData) {
            this.loading = true;
            try {
                const response = await api.post("/api/products", productData);
                this.products.unshift(response.data);
                return { success: true };
            } catch (error: any) {
                return {
                    success: false,
                    errors: error.response?.data?.errors || {
                        general: ["Failed to create product"],
                    },
                };
            } finally {
                this.loading = false;
            }
        },
        async updateProduct(id: number, productData: ProductFormData) {
            try {
                const response = await api.put(
                    `/api/products/${id}`,
                    productData
                );
                const index = this.products.findIndex((p) => p.id === id);
                if (index !== -1) {
                    this.products[index] = response.data;
                }

                return { success: true };
            } catch (error: any) {
                return {
                    success: false,
                    errors: error.response?.data?.errors || {
                        general: ["Failed to update product"],
                    },
                };
            }
        },

        async deleteProduct(id: number) {
            try {
                await api.delete(`/api/products/${id}`);
                this.products = this.products.filter((p) => p.id !== id);
                return { success: true };
            } catch (error: any) {
                return {
                    success: false,
                    error: "Failed to delete product",
                };
            }
        },
        async fetchProduct(id: number) {
            try {
                const response = await api.get(`/api/products/${id}`);
                this.currentProduct = response.data;
                return response.data;
            } catch (error) {
                console.error("Failed to fetch product:", error);
                return null;
            }
        },
    },
});
