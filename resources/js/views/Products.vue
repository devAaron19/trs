<template>
    <div class="products">
        <div class="products-header">
            <h1 class="text-2xl font-bold text-gray-800">
                Products Management
            </h1>
            <button @click="showCreateModal = true" class="primary-btn">
                Add New Product
            </button>
        </div>

        <div v-if="productStore.loading" class="loading">
            Loading products...
        </div>

        <div v-else>
            <div v-if="productStore.products.length === 0" class="no-data">
                No products found. Click "Add New Product" to create your first
                product.
            </div>

            <div v-else>
                <div class="products-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="product in productStore.products"
                                :key="product.id"
                            >
                                <td>{{ product.name }}</td>
                                <td>${{ product.price }}</td>
                                <td class="actions">
                                    <button
                                        @click="editProduct(product)"
                                        class="edit-btn"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        @click="deleteProduct(product.id)"
                                        class="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div
                    class="pagination"
                    v-if="productStore.pagination.last_page > 1"
                >
                    <button
                        @click="
                            changePage(productStore.pagination.current_page - 1)
                        "
                        :disabled="productStore.pagination.current_page === 1"
                        class="page-btn"
                    >
                        Previous
                    </button>

                    <span class="page-info">
                        Page {{ productStore.pagination.current_page }} of
                        {{ productStore.pagination.last_page }}
                    </span>

                    <button
                        @click="
                            changePage(productStore.pagination.current_page + 1)
                        "
                        :disabled="
                            productStore.pagination.current_page ===
                            productStore.pagination.last_page
                        "
                        class="page-btn"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <div
            v-if="showCreateModal || showEditModal"
            class="modal-overlay"
            @click="closeModal"
        >
            <div class="modal" @click.stop>
                <div class="modal-header">
                    <h2>
                        {{
                            showEditModal
                                ? "Edit Product"
                                : "Create New Product"
                        }}
                    </h2>
                    <button @click="closeModal" class="close-btn">
                        &times;
                    </button>
                </div>

                <form @submit.prevent="submitForm">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input
                            id="name"
                            v-model="form.name"
                            type="text"
                            required
                            :class="{ error: errors.name }"
                        />
                        <span v-if="errors.name" class="error-text">{{
                            errors.name[0]
                        }}</span>
                    </div>

                    <div class="form-group">
                        <label for="price">Price</label>
                        <input
                            id="price"
                            v-model.number="form.price"
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            :class="{ error: errors.price }"
                        />
                        <span v-if="errors.price" class="error-text">{{
                            errors.price[0]
                        }}</span>
                    </div>

                    <div class="modal-actions">
                        <button
                            type="button"
                            @click="closeModal"
                            class="cancel-btn"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            :disabled="submitting"
                            class="submit-btn"
                        >
                            {{
                                submitting
                                    ? "Saving..."
                                    : showEditModal
                                    ? "Update"
                                    : "Create"
                            }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useProductStore } from "@/stores/products";
import type { Product, ProductFormData } from "@/types";

const productStore = useProductStore();

const showCreateModal = ref(false);
const showEditModal = ref(false);
const submitting = ref(false);
const editingProduct = ref<Product | null>(null);

const form = reactive<ProductFormData>({
    name: "",
    price: 0,
});

const errors = ref<Record<string, string[]>>({});

onMounted(() => {
    productStore.fetchProducts();
});

const resetForm = () => {
    form.name = "";
    form.price = 0;
    errors.value = {};
};

const closeModal = () => {
    showCreateModal.value = false;
    showEditModal.value = false;
    editingProduct.value = null;
    resetForm();
};

const editProduct = (product: Product) => {
    editingProduct.value = product;
    form.name = product.name;
    form.price = product.price;
    showEditModal.value = true;
};

const deleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
        await productStore.deleteProduct(id);
        productStore.fetchProducts();
    }
};

const submitForm = async () => {
    submitting.value = true;
    errors.value = {};

    let result;
    if (showEditModal.value && editingProduct.value) {
        result = await productStore.updateProduct(
            editingProduct.value.id,
            form
        );
    } else {
        result = await productStore.createProduct(form);
    }
    if (result.success) {
        closeModal();
        if (!showEditModal.value) {
            productStore.fetchProducts(); // Refresh list for new products
        }
    } else {
        errors.value = result.errors;
    }

    submitting.value = false;

    productStore.fetchProducts();
};

const changePage = (page: number) => {
    productStore.fetchProducts(page);
};
</script>

<style scoped>
/* Global Styles */
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
}

.auth-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.auth-card h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #2c3e50;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #34495e;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #3498db;
}

.form-group input.error,
.form-group textarea.error {
    border-color: #e74c3c;
}

.error-text {
    color: #e74c3c;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
}

.submit-btn {
    width: 100%;
    background-color: #3498db;
    color: white;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
    background-color: #2980b9;
}

.submit-btn:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}

.auth-link {
    text-align: center;
    margin-top: 1rem;
}

.auth-link a {
    color: #3498db;
    text-decoration: none;
}

.auth-link a:hover {
    text-decoration: underline;
}

/* Dashboard Styles */
.dashboard-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
}

.stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #3498db;
    margin: 0;
}

.recent-products {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.product-card {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: box-shadow 0.3s;
}

.product-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-card h4 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
}

.product-info {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
}

.price {
    font-weight: bold;
    color: #27ae60;
}

.stock {
    color: #7f8c8d;
}

/* Profile Styles */
.profile-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 600px;
}

.info-group {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid #eee;
}

.info-group:last-child {
    border-bottom: none;
}

.info-group label {
    font-weight: 500;
    color: #34495e;
}

.status.verified {
    color: #27ae60;
}

.status:not(.verified) {
    color: #e74c3c;
}

.profile-actions {
    margin-top: 2rem;
    text-align: center;
}

.refresh-btn {
    background-color: #3498db;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.refresh-btn:hover {
    background-color: #2980b9;
}

/* Products Styles */
.products-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.primary-btn {
    background-color: #27ae60;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.primary-btn:hover {
    background-color: #219a52;
}

.products-table {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.products-table table {
    width: 100%;
    border-collapse: collapse;
}

.products-table th,
.products-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.products-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #2c3e50;
}

.actions {
    display: flex;
    gap: 0.5rem;
}

.edit-btn {
    background-color: #f39c12;
    color: white;
    padding: 0.25rem 0.75rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
}

.edit-btn:hover {
    background-color: #d68910;
}

.delete-btn {
    background-color: #e74c3c;
    color: white;
    padding: 0.25rem 0.75rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
}

.delete-btn:hover {
    background-color: #c0392b;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
}

.page-btn {
    background-color: #3498db;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.page-btn:hover:not(:disabled) {
    background-color: #2980b9;
}

.page-btn:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}

.page-info {
    font-weight: 500;
    color: #34495e;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #eee;
}

.modal-header h2 {
    margin: 0;
    color: #2c3e50;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #7f8c8d;
}

.close-btn:hover {
    color: #2c3e50;
}

.modal form {
    padding: 1.5rem;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
}

.cancel-btn {
    background-color: #95a5a6;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.cancel-btn:hover {
    background-color: #7f8c8d;
}

/* Utility Styles */
.loading {
    text-align: center;
    padding: 2rem;
    color: #7f8c8d;
}

.no-data {
    text-align: center;
    padding: 2rem;
    color: #7f8c8d;
}

.no-data a {
    color: #3498db;
    text-decoration: none;
}

.no-data a:hover {
    text-decoration: underline;
}
</style>
