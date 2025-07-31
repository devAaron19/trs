<template>
    <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <RegisterForm class="w-md"/>
    </div>
</template>
<script lang="ts">
import RegisterForm from '@/components/RegisterForm.vue';
export default {
    components: {
        RegisterForm
    }
}
</script>