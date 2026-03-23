<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps<{
  src: string;
  alt: string;
  title: string;
  description: string;
  closeLabel?: string;
  previewHint?: string;
}>();

const isOpen = ref(false);

const resolvedCloseLabel = computed(() => props.closeLabel ?? "Close");
const resolvedPreviewHint = computed(() => props.previewHint ?? "Preview image");

function openPreview() {
  isOpen.value = true;
}

function closePreview() {
  isOpen.value = false;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closePreview();
  }
}

watch(isOpen, (open) => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = open ? "hidden" : "";
  }
});

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <div class="vlt-preview-card">
    <button
      type="button"
      class="vlt-preview-card__image-button"
      :aria-label="resolvedPreviewHint"
      @click="openPreview"
    >
      <img :src="src" :alt="alt" />
    </button>
    <div class="vlt-preview-card__body">
      <strong>{{ title }}</strong>
      <span>{{ description }}</span>
    </div>

    <Teleport to="body">
      <div
        v-if="isOpen"
        class="vlt-lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        @click.self="closePreview"
      >
        <div class="vlt-lightbox__panel">
          <button
            type="button"
            class="vlt-lightbox__close"
            :aria-label="resolvedCloseLabel"
            @click="closePreview"
          >
            ×
          </button>
          <img class="vlt-lightbox__image" :src="src" :alt="alt" />
        </div>
      </div>
    </Teleport>
  </div>
</template>
