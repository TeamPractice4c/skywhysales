<script setup></script>

<template>
  <div class="footer">
    <div class="footer-content">
      <div>
        <img src="../assets/icons/logo.svg" alt="" />
      </div>
      <div class="about">
        <p style="color: #6e7491; font-weight: bold">О нас</p>
        <p>О SkyWhySales</p>
        <p>Как это работает</p>
        <p>Карьера</p>
      </div>
      <div class="support">
        <p style="color: #6e7491; font-weight: bold">Поддержка</p>
        <p>Связаться с нами</p>
        <p>Политика конфиденциальности</p>
        <p>Условия обслуживания</p>
        <p>Доверие и безопасность</p>
      </div>
    </div>
    <div class="copyright">
      <p style="text-align: center">© 2025 SkyWhySales. Все права защищены.</p>
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'Nunito-sans';
  src: url('../assets/fonts/NunitoSans.ttf');
}

* {
  font-family: 'Nunito-sans', sans-serif;
}
p {
  color: #7c8db0;
}
.footer {
  display: flex;
  flex-direction: column;
}
.footer-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 120px 60px;
}
</style>
