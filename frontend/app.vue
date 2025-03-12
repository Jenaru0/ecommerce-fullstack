<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toast
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="hideToast"
    />
  </div>
</template>

<script setup>
import { useToast } from "~/composables/useToast";
import Toast from "~/components/ui/Toast.vue";

const { toast, hideToast } = useToast();
</script>
