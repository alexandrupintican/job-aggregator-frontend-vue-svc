<script setup lang="ts">
import { computed } from "vue";
import PrimaryButton from "@/components/ui/PrimaryButton.vue";
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
        <span
          v-for="term in job.getAssessment().getMatchedTerms()"
          :key="term"
          >{{ term }}</span
        >
      </div>
    </div>
    <div class="job-card__details">
      <p class="job-card__status" :class="`job-card__status--${status}`">
        {{ status }}
      </p>
      <p class="job-card__arrangement">{{ job.getWorkMode() }}</p>
      <p v-if="contractTypes" class="job-card__type">{{ contractTypes }}</p>
      <p v-if="job.getCompensation()" class="job-card__salary">
        {{ job.getCompensation() }}
      </p>
      <PrimaryButton
        class="job-card__open"
        :href="job.getUrl()"
        rel="noopener noreferrer"
        target="_blank"
        :aria-label="`View ${job.getTitle()} at ${job.getCompany()} (opens in a new tab)`"
      >
        View listing
      </PrimaryButton>
    </div>
    <button
      class="job-card__save"
      type="button"
      :aria-label="`Save ${job.getTitle()} at ${job.getCompany()}`"
    >
      <span aria-hidden="true">♡</span>
    </button>
  </article>
</template>

<style lang="scss" scoped>
@use "@globalStyle/variables" as *;

.job-card {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) auto 34px;
  align-items: start;
  gap: 16px;
  padding: 19px 20px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  animation: rise-in 350ms ease both;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;
}

.job-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-accent-1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.job-card__company-mark {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 12px;
}

.job-card__company-mark--lavender {
  background: rgba(167, 139, 214, 0.15);
  color: #c4b1e6;
}
.job-card__company-mark--peach {
  background: rgba(224, 150, 100, 0.15);
  color: #e8b08a;
}
.job-card__company-mark--mint {
  background: rgba(110, 190, 145, 0.15);
  color: #9ad3b2;
}
.job-card__company-mark--blue {
  background: rgba(110, 170, 210, 0.15);
  color: #9cc8e3;
}
.job-card__company-mark--yellow {
  background: rgba(214, 196, 100, 0.15);
  color: #e0d08a;
}
.job-card__company-mark--rose {
  background: rgba(224, 138, 154, 0.15);
  color: #e8a8b5;
}

.job-card__main {
  min-width: 0;
}

.job-card__title-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.job-card h2 {
  margin: 0;
  color: var(--text);
  font-weight: 700;
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
  margin: 5px 0 0;
  color: var(--text-muted);
}

.job-card__company span {
  padding-inline: 3px;
  color: var(--color-secondary);
}

.job-card__description {
  margin: 10px 0;
  color: var(--text-muted);
  line-height: 1.55;
}

.job-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.job-card__tags span {
  padding: 5px 8px;
  border-radius: 5px;
  background: var(--border);
  color: var(--text-muted);
  font-weight: 550;
}

.job-card__details {
  display: flex;
  min-width: 104px;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  padding-top: 2px;
  color: var(--text-muted);
}

.job-card__status,
.job-card__arrangement {
  padding: 5px 8px;
  border-radius: 5px;
  font-weight: 600;
  text-transform: capitalize;
}

.job-card__status {
  background: rgba(214, 196, 100, 0.15);
  color: #e0d08a;
}

.job-card__status--match {
  background: rgba(110, 190, 145, 0.15);
  color: #9ad3b2;
}

.job-card__arrangement {
  background: color-mix(in srgb, var(--color-accent-1) 18%, transparent);
  color: var(--text);
}

.job-card__salary {
  margin-top: 4px;
  color: var(--text);
  font-weight: 650;
}

.job-card__open {
  margin-top: 4px;
}

.job-card__save {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    color 160ms ease,
    border-color 160ms ease,
    background 160ms ease;
}

.job-card__save:hover {
  border-color: var(--color-accent-1);
  background: color-mix(in srgb, var(--color-accent-1) 12%, transparent);
  color: var(--color-accent-1);
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .job-card {
    grid-template-columns: 42px minmax(0, 1fr) auto 32px;
    gap: 12px;
    padding: 17px;
  }

  .job-card__company-mark {
    width: 42px;
    height: 42px;
  }
}

@media (max-width: 680px) {
  .job-card {
    grid-template-columns: 40px minmax(0, 1fr) 30px;
    gap: 11px;
    padding: 15px;
  }

  .job-card__company-mark {
    width: 40px;
    height: 40px;
  }

  .job-card__title-row {
    flex-wrap: wrap;
    gap: 3px 9px;
  }

  .job-card__details {
    grid-column: 2;
    grid-row: 2;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
    min-width: 0;
    padding-top: 2px;
  }

  .job-card__salary,
  .job-card__open {
    margin-top: 0;
  }

  .job-card__save {
    grid-column: 3;
    grid-row: 1;
  }

  .job-card__description {
    margin-block: 8px;
  }
}
</style>
