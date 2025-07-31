<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactive, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { LoginData } from '@/types'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive<LoginData>({
  email: '',
  password: '',
})

const errors = ref<Record<string,string[]>>({})

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const handleLogin = async () => {
  errors.value = {}
  
  const result = await authStore.login(form)
  
  if (result.success) {
    router.push('/dashboard')
  } else {
    errors.value = result.errors
  }
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin">
          <div class="flex flex-col gap-6">
            <div class="grid gap-3">
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="mail@example.com"
                
                v-model="form.email"
              />
            </div>
            <div class="grid gap-3">
              <div class="flex items-center">
                <Label for="password">Password</Label>
              </div>
              <Input id="password" type="password"  v-model="form.password" />
            </div>
            <div v-if="errors.general" class="text-red-500">{{ errors.general[0] }}</div>
            <div class="flex flex-col gap-3">
              <Button type="submit" :disabled="authStore.loading" class="w-full">
                Login
              </Button>
            </div>
          </div>
          <div class="mt-4 text-center text-sm">
            Don't have an account?
            <a href="/register" class="underline underline-offset-4">
              Sign up
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
