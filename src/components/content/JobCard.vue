<script setup lang="ts">
import { computed } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import Chip from "@/components/ui/Chip.vue";
import type { JobListingModel } from "@/models/JobService/jobListingModel";

const props = defineProps<{
  job: JobListingModel;
}>();

const MARK_COLORS = ["lavender", "peach", "mint", "blue", "yellow", "rose"];
const DESCRIPTION_LENGTH = 220;

const initials = computed(() =>
  props.job
    .getCompany()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join(""),
);

const markColor = computed(() => {
  const hash = [...props.job.getCompany()].reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );
  return MARK_COLORS[hash % MARK_COLORS.length];
});

const posted = computed(() => {
  const publishedAt = props.job.getPublishedAt();
  if (!publishedAt) {
    return "";
  }

  const days = Math.floor((Date.now() - publishedAt.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
});

// The API returns the source board's HTML; show it as plain text instead of rendering it.
const summary = computed(() => {
  const text =
    new DOMParser()
      .parseFromString(props.job.getDescription(), "text/html")
      .body.textContent?.replace(/\s+/g, " ")
      .trim() ?? "";
  return text.length > DESCRIPTION_LENGTH
    ? `${text.slice(0, DESCRIPTION_LENGTH).trimEnd()}…`
    : text;
});

const contractTypes = computed(() => props.job.getContractTypes().join(", "));
const status = computed(() => props.job.getAssessment().getStatus());
const statusTone = computed(() =>
  status.value === "match" ? "success" : "warning",
);
</script>

<template>
  <article class="job-card">
    <div
      class="job-card__company-mark"
      :class="`job-card__company-mark--${markColor}`"
    >
      {{ initials }}
    </div>
    <div class="job-card__main">
      <div class="job-card__title-row">
        <h2>
          <a :href="job.getUrl()" rel="noopener noreferrer" target="_blank">{{
            job.getTitle()
          }}</a>
        </h2>
        <p v-if="posted" class="job-card__posted">{{ posted }}</p>
      </div>
      <p class="job-card__company">
        {{ job.getCompany() }} <span>·</span> {{ job.getLocation() }}
      </p>
      <p class="job-card__description">{{ summary }}</p>
      <div class="job-card__tags">
        <Chip v-for="term in job.getAssessment().getMatchedTerms()" :key="term">
          {{ term }}
        </Chip>
      </div>
    </div>
    <div class="job-card__details">
      <Chip class="job-card__label" :tone="statusTone">{{ status }}</Chip>
      <Chip class="job-card__label" tone="accent">{{ job.getWorkMode() }}</Chip>
      <p v-if="contractTypes" class="job-card__type">{{ contractTypes }}</p>
      <p v-if="job.getCompensation()" class="job-card__salary">
        {{ job.getCompensation() }}
      </p>
      <AppButton
        :href="job.getUrl()"
        rel="noopener noreferrer"
        target="_blank"
        :aria-label="`View ${job.getTitle()} at ${job.getCompany()} (opens in a new tab)`"
      >
        View listing
      </AppButton>
    </div>
    <AppButton
      class="job-card__save"
      variant="secondary"
      icon
      :aria-label="`Save ${job.getTitle()} at ${job.getCompany()}`"
    >
      <span aria-hidden="true">♡</span>
    </AppButton>
  </article>
</template>

<style lang="scss" scoped>
.job-card {
  display: grid;
  grid-template-columns: var(--icon-size-lg) minmax(0, 1fr) auto var(
      --control-height
    );
  align-items: start;
  gap: var(--space-4);
  padding: var(--panel-padding);
  border: var(--border-width) solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  animation: rise-in var(--duration-enter) ease both;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
}

.job-card:hover {
  transform: translateY(var(--hover-lift));
  border-color: var(--color-accent-1);
  box-shadow: var(--shadow-raised);
}

.job-card__company-mark {
  display: grid;
  width: var(--icon-size-lg);
  height: var(--icon-size-lg);
  place-items: center;
  border-radius: var(--radius-lg);
  background: color-mix(
    in srgb,
    currentColor var(--tint-strength),
    transparent
  );
}

// Company-mark hues. Mint, yellow and rose reuse the theme status colors;
// the other three only exist here.
.job-card__company-mark--lavender {
  color: #c4b1e6;
}
.job-card__company-mark--peach {
  color: #e8b08a;
}
.job-card__company-mark--mint {
  color: var(--color-success);
}
.job-card__company-mark--blue {
  color: #9cc8e3;
}
.job-card__company-mark--yellow {
  color: var(--color-warning);
}
.job-card__company-mark--rose {
  color: var(--color-danger);
}

.job-card__main {
  min-width: 0;
}

.job-card__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-1) var(--space-3);
}

.job-card h2 {
  margin: 0;
  color: var(--text);
  font-weight: var(--font-weight-bold);
}

.job-card h2 a {
  color: inherit;
  text-decoration: none;
}

.job-card h2 a:hover {
  color: var(--color-accent-1);
  text-decoration: underline;
}

.job-card__posted {
  color: var(--color-secondary);
  white-space: nowrap;
}

.job-card__company {
  margin-top: var(--space-1);
  color: var(--text-muted);
}

.job-card__company span {
  padding-inline: var(--space-1);
  color: var(--color-secondary);
}

.job-card__description {
  margin-block: var(--space-2);
  color: var(--text-muted);
  line-height: var(--line-height-relaxed);
}

.job-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.job-card__details {
  display: grid;
  justify-items: end;
  gap: var(--space-2);
  color: var(--text-muted);
}

.job-card__label {
  text-transform: capitalize;
}

.job-card__salary {
  color: var(--text);
  font-weight: var(--font-weight-semibold);
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(var(--space-3));
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .job-card {
    grid-template-columns: var(--icon-size-lg) minmax(0, 1fr) var(
        --control-height
      );
    gap: var(--space-3);
  }

  .job-card__details {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    grid-column: 2;
    grid-row: 2;
  }

  .job-card__save {
    grid-column: 3;
    grid-row: 1;
  }
}
</style>
