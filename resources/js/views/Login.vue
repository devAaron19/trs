<template>
    <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <LoginForm class="w-md"/>
    </div>
</template>
<script lang="ts">
import LoginForm from '@/components/LoginForm.vue'
export default {
    components: {
        LoginForm
    }
}
</script>