<template>
  <Card>
    <CardContent>
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-bold">Products</h2>
        <RouterLink to="/products/create">
          <Button>Add Product</Button>
        </RouterLink>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="product in paginatedData" :key="product.id">
            <TableCell>{{ product.name }}</TableCell>
            <TableCell>{{ product.price }}</TableCell>
            <TableCell>
              <div class="flex gap-2">
                <RouterLink :to="`/products/${product.id}/edit`">
                  <Button variant="outline" size="sm">Edit</Button>
                </RouterLink>
                <Button variant="destructive" size="sm" @click="deleteProduct(product.id)">Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Pagination class="mt-4" :total="totalPages" v-model:page="currentPage" />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/types'

const props = defineProps<{ products: Product[] }>()

const currentPage = ref(1)
const perPage = 10

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return props.products.slice(start, start + perPage)
})

const totalPages = computed(() =>
  Math.ceil(props.products.length / perPage)
)

const emit = defineEmits(['delete'])

function deleteProduct(id: number) {
  if (confirm('Are you sure to delete this product?')) {
    emit('delete', id)
  }
}
</script>
