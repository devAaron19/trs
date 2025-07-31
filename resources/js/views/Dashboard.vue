<template>
    <div class="dashboard">
        <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>

        <div class="dashboard-stats">
            <div class="stat-card my-4">
                <h3>Welcome, {{ authStore.currentUser?.name }}!</h3>
                <p>You're successfully logged in to the TRS application.</p>
            </div>

            <div class="grid grid-cols-4 gap-2 my-4">
                <div class="border p-2 rounded-md w-full">
                    <h3 class="text-lg font-semibold">Total Products</h3>
                    <p class="text-lg">{{ productStore.pagination.total }}</p>
                </div>
            </div>
        </div>

        <div class="recent-products">
            <h2 class="text-xl font-semibold">Recent Products</h2>
            <div v-if="productStore.loading" class="loading">
                Loading products...
            </div>
            <div v-else-if="productStore.products.length === 0" class="no-data">
                No products found.
                <router-link to="/products">Add some products</router-link>
            </div>
            <div v-else class="grid grid-cols-5 gap-2">
                <div
                    v-for="product in productStore.products.slice(0, 10)"
                    :key="product.id"
                    class="border rounded-md p-2"
                >
                    <h4 class="text-lg font-semibold">{{ product.name }}</h4>
                    <div class="product-info">
                        <span class="price">${{ product.price }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useProductStore } from "@/stores/products";

const authStore = useAuthStore();
const productStore = useProductStore();

onMounted(() => {
    productStore.fetchProducts();
});
</script>
