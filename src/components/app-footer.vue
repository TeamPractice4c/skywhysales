<template>
  <div class="footer">
    <div class="footer-content">
        <img src="../assets/icons/logo.svg" alt="" width="200"/>
      <div class="support">
        <p>Связаться с нами</p>
        <a href="mailto:ksebija@gmail.com">ksebija@gmail.com</a>
        <a href="mailto:aidarfaiza@gmail.com">aidarfaiza@gmail.com</a>
        <p></p>
      </div>
    </div>
    <div class="copyright">
      <p style="text-align: center">© 2025 SkyWhySales. Все права защищены.</p>
    </div>
  </div>
</template>

<style scoped>
a {
  color: var(--color-grey-400);
  text-decoration: none;
}
p {
  color: var(--color-grey-600);
  font-weight: bold;
}
.footer {
  display: flex;
  flex-direction: column;
}
.footer-content {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 60px;
}
.footer-content img {
  justify-self: center;
}
.support {
  display: flex;
  flex-direction: column;
}
.copyright p {
  color: var(--color-grey-400);
  font-weight: normal;
}
</style>
