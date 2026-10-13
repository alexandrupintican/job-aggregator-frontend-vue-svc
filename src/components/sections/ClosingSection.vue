<template>
  <section class="closing">
    <span class="closing__sparkle" aria-hidden="true">✳</span>
    <p>Find work that feels like <em>you.</em></p>
  </section>
</template>

<style lang="scss" scoped>
@use '@globalStyle/variables' as *;

.closing {
  display: flex;
  min-height: 155px;
  align-items: center;
  justify-content: center;
  gap: 13px;
  background: #eaf0e6;
}

.closing__sparkle {
  color: #78924e;
  font-size: 24px;
}

.closing p {
  margin: 0;
  color: $color-green-dark;
  font-family: $font-display;
  font-size: clamp(23px, 4vw, 31px);
}

.closing em {
  color: #829851;
  font-weight: 400;
}
</style>
