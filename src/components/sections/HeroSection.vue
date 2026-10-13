<script setup lang="ts">
import JobSearchForm from '@/components/content/JobSearchForm.vue'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'
import type { JobSearchCriteria } from '@/models/job'

const criteria = defineModel<JobSearchCriteria>({ required: true })

defineEmits<{
  search: []
  clear: []
}>()
</script>

<template>
  <section class="hero">
    <div class="hero__inner">
      <SectionEyebrow dot>A better way to find your next thing</SectionEyebrow>
      <h1>Good work.<br /><span>Good people.</span></h1>
      <p class="hero__copy">
        Find thoughtful opportunities from teams doing work that matters.
        Your next chapter starts with a search.
      </p>
      <JobSearchForm
        v-model="criteria"
        @search="$emit('search')"
        @clear="$emit('clear')"
      />
      <div class="hero__note">
        <span class="hero__sparkle" aria-hidden="true">✳</span>
        A little less scrolling, a lot more possibility.
      </div>
    </div>
    <div class="hero__decoration" aria-hidden="true">
      <div class="hero__sun"></div>
      <div class="hero__orbit hero__orbit--one"></div>
      <div class="hero__orbit hero__orbit--two"></div>
      <span class="hero__star hero__star--one">✳</span>
      <span class="hero__star hero__star--two">✳</span>
      <span class="hero__star hero__star--three">✦</span>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@globalStyle/variables' as *;

.hero {
  position: relative;
  min-height: 478px;
  padding: 64px 24px 48px;
  overflow: hidden;
  background: #eaf0e6;
}

.hero__inner {
  position: relative;
  z-index: 1;
  width: min(100%, 920px);
  margin-inline: auto;
  animation: rise-in 550ms ease both;
}

.hero h1 {
  margin: 0;
  color: $color-green-dark;
  font-family: $font-display;
  font-size: clamp(50px, 7vw, 74px);
  font-weight: 400;
  letter-spacing: -2.6px;
  line-height: 0.98;
}

.hero h1 span {
  color: #78924e;
  font-style: italic;
}

.hero__copy {
  max-width: 440px;
  margin: 16px 0 29px;
  color: #68766d;
  font-size: 14px;
  line-height: 1.7;
}

.hero__note {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 16px;
  color: #77837a;
  font-size: 11px;
}

.hero__sparkle {
  color: #829b51;
  font-size: 14px;
}

.hero__decoration {
  position: absolute;
  top: 48px;
  right: max(calc((100vw - 1100px) / 2 - 8px), 24px);
  width: 238px;
  height: 238px;
  opacity: 0.82;
}

.hero__sun {
  position: absolute;
  top: 27px;
  right: 17px;
  width: 132px;
  height: 132px;
  border-radius: 50%;
  background: #d3e3b4;
}

.hero__orbit {
  position: absolute;
  border: 1px solid rgba(82, 117, 74, 0.22);
  border-radius: 50%;
  transform: rotate(-33deg);
}

.hero__orbit--one {
  top: 6px;
  right: -29px;
  width: 239px;
  height: 175px;
}

.hero__orbit--two {
  top: 59px;
  right: 8px;
  width: 207px;
  height: 147px;
  transform: rotate(34deg);
}

.hero__star {
  position: absolute;
  color: $color-green;
}

.hero__star--one {
  top: 18px;
  right: 153px;
  font-size: 28px;
}

.hero__star--two {
  right: 4px;
  bottom: 40px;
  font-size: 22px;
}

.hero__star--three {
  top: 166px;
  left: 7px;
  color: #91a755;
  font-size: 17px;
}

@media (min-width: 1400px) {
  .hero__decoration {
    right: calc((100vw - 1100px) / 2 + 8px);
  }
}

@media (max-width: 900px) {
  .hero__decoration {
    right: 16px;
    opacity: 0.45;
  }

  .hero__inner {
    width: min(100%, 760px);
  }
}

@media (max-width: 680px) {
  .hero {
    min-height: auto;
    padding: 52px 18px 33px;
  }

  .hero__decoration {
    top: 12px;
    right: -40px;
    transform: scale(0.7);
    transform-origin: top right;
    opacity: 0.28;
  }

  .hero__copy {
    max-width: 360px;
    font-size: 13px;
  }
}
</style>
