<script setup lang="ts">
import { computed } from 'vue'
import type { JobListingModel } from '@/models/JobService/jobListingModel'

const props = defineProps<{
  job: JobListingModel
}>()

const MARK_COLORS = ['lavender', 'peach', 'mint', 'blue', 'yellow', 'rose']
const DESCRIPTION_LENGTH = 220

const initials = computed(() =>
  props.job
    .getCompany()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join(''),
)

const markColor = computed(() => {
  const hash = [...props.job.getCompany()].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return MARK_COLORS[hash % MARK_COLORS.length]
})

const posted = computed(() => {
  const publishedAt = props.job.getPublishedAt()
  if (!publishedAt) {
    return ''
  }

  const days = Math.floor((Date.now() - publishedAt.getTime()) / 86_400_000)
  if (days <= 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
})

// The API returns the source board's HTML; show it as plain text instead of rendering it.
const summary = computed(() => {
  const text = new DOMParser()
    .parseFromString(props.job.getDescription(), 'text/html')
    .body.textContent?.replace(/\s+/g, ' ')
    .trim() ?? ''
  return text.length > DESCRIPTION_LENGTH ? `${text.slice(0, DESCRIPTION_LENGTH).trimEnd()}…` : text
})

const contractTypes = computed(() => props.job.getContractTypes().join(', '))
const status = computed(() => props.job.getAssessment().getStatus())
</script>

<template>
  <article class="job-card">
    <div class="job-card__company-mark" :class="`job-card__company-mark--${markColor}`">
      {{ initials }}
    </div>
    <div class="job-card__main">
      <div class="job-card__title-row">
        <h3>
          <a :href="job.getUrl()" rel="noopener noreferrer" target="_blank">{{ job.getTitle() }}</a>
        </h3>
        <span v-if="posted" class="job-card__posted">{{ posted }}</span>
      </div>
      <p class="job-card__company">{{ job.getCompany() }} <span>·</span> {{ job.getLocation() }}</p>
      <p class="job-card__description">{{ summary }}</p>
      <div class="job-card__tags">
        <span v-for="term in job.getAssessment().getMatchedTerms()" :key="term">{{ term }}</span>
      </div>
    </div>
    <div class="job-card__details">
      <span class="job-card__status" :class="`job-card__status--${status}`">{{ status }}</span>
      <span class="job-card__arrangement">{{ job.getWorkMode() }}</span>
      <span v-if="contractTypes" class="job-card__type">{{ contractTypes }}</span>
      <span v-if="job.getCompensation()" class="job-card__salary">{{ job.getCompensation() }}</span>
    </div>
    <button class="job-card__save" type="button" :aria-label="`Save ${job.getTitle()} at ${job.getCompany()}`">
      <span aria-hidden="true">♡</span>
    </button>
  </article>
</template>

<style lang="scss" scoped>
@use '@globalStyle/variables' as *;

.job-card {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) auto 34px;
  align-items: start;
  gap: 16px;
  padding: 19px 20px;
  border: 1px solid $color-border;
  border-radius: 10px;
  background: $color-white;
  animation: rise-in 350ms ease both;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

.job-card:hover {
  transform: translateY(-2px);
  border-color: #d5ddd3;
  box-shadow: 0 8px 24px rgba(37, 52, 44, 0.05);
}

.job-card__company-mark {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 12px;
  font-family: $font-display;
  font-size: 22px;
}

.job-card__company-mark--lavender { background: #eee8f6; color: #6f5c8a; }
.job-card__company-mark--peach { background: #f8e7da; color: #aa6a40; }
.job-card__company-mark--mint { background: #e0eee6; color: #4b7c60; }
.job-card__company-mark--blue { background: #e2edf3; color: #48758b; }
.job-card__company-mark--yellow { background: #f3efd8; color: #8c7e36; }
.job-card__company-mark--rose { background: #f4e4e7; color: #a3606f; }

.job-card__main {
  min-width: 0;
}

.job-card__title-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.job-card h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.2px;
}

.job-card h3 a {
  color: inherit;
  text-decoration: none;
}

.job-card h3 a:hover {
  color: $color-green;
  text-decoration: underline;
}

.job-card__posted {
  color: #929c94;
  font-size: 10px;
  white-space: nowrap;
}

.job-card__company {
  margin: 5px 0 0;
  color: #637168;
  font-size: 11px;
}

.job-card__company span {
  padding-inline: 3px;
  color: #a7afa8;
}

.job-card__description {
  margin: 10px 0;
  color: #79847c;
  font-size: 11px;
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
  background: #f3f5f1;
  color: #68776d;
  font-size: 9px;
  font-weight: 550;
}

.job-card__details {
  display: flex;
  min-width: 104px;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  padding-top: 2px;
  color: #7b877e;
  font-size: 10px;
}

.job-card__status,
.job-card__arrangement {
  padding: 5px 8px;
  border-radius: 5px;
  font-weight: 600;
  text-transform: capitalize;
}

.job-card__status {
  background: #f3efd8;
  color: #8c7e36;
}

.job-card__status--match {
  background: #e0eee6;
  color: #4b7c60;
}

.job-card__arrangement {
  background: #eef2ea;
  color: #526b57;
}

.job-card__salary {
  margin-top: 4px;
  color: #3d5747;
  font-size: 11px;
  font-weight: 650;
}

.job-card__save {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid $color-border;
  border-radius: 7px;
  background: transparent;
  color: #78847b;
  font-size: 19px;
  cursor: pointer;
  transition: color 160ms ease, border-color 160ms ease, background 160ms ease;
}

.job-card__save:hover {
  border-color: #cbd7c7;
  background: #f2f5ef;
  color: $color-green;
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

  .job-card h3 {
    font-size: 13px;
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

  .job-card__salary {
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
