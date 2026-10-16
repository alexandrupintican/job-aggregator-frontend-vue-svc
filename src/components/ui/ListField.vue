<script setup lang="ts">
import { ref, watch } from "vue";
import FormField from "@/components/ui/FormField.vue";

const model = defineModel<string[]>({ required: true });

defineProps<{
  label: string;
  name: string;
  placeholder?: string;
}>();

function parse(text: string): string[] {
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

// Kept separately from the model so a trailing ", " isn't erased while typing.
const text = ref(model.value.join(", "));

watch(model, (items) => {
  if (parse(text.value).join("\u0000") !== items.join("\u0000")) {
    text.value = items.join(", ");
  }
});

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  text.value = value;
  model.value = parse(value);
}
</script>

<template>
  <FormField :label="label" :name="name">
    <input
      :value="text"
      autocomplete="off"
      :placeholder="placeholder"
      type="text"
      @input="onInput"
    />
  </FormField>
</template>
