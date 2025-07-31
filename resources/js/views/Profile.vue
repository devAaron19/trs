<template>
    <h2 class="text-2xl font-bold text-gray-800">User Profile</h2>
    <div
        class="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-4"
    >
        <div class="border-gray-200 pt-4 space-y-2">
            <h3 class="text-lg font-semibold text-gray-700">
                Profile Information
            </h3>
            <p>
                <span class="font-medium text-gray-600">Name:</span>
                {{ authStore.currentUser?.name }}
            </p>
            <p>
                <span class="font-medium text-gray-600">Email:</span>
                {{ authStore.currentUser?.email }}
            </p>
            <p>
                <span class="font-medium text-gray-600">Member Since:</span>
                {{ formatDate(authStore.currentUser?.created_at) }}
            </p>
            <p>
                <span class="font-medium text-gray-600">Email Verified: </span>
                <span
                    class="font-semibold"
                    :class="{
                        'text-red-600':
                            !authStore.currentUser?.email_verified_at,
                    }"
                    >{{
                        authStore.currentUser?.email_verified_at
                            ? "Verified"
                            : "Not Verified"
                    }}</span
                >
            </p>
        </div>

        <button
            @click="refreshProfile"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
        >
            Refresh Profile
        </button>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
};

const refreshProfile = () => {
    authStore.fetchUser();
};
</script>
