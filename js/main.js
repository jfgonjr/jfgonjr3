/* Melhorias progressivas. O conteúdo e a navegação funcionam sem este arquivo. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Menu móvel ---- */
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('menu');
  if (btn && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    btn.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); btn.focus(); } });
    document.addEventListener('click', function (e) { if (nav.classList.contains('open') && !e.target.closest('.top')) setOpen(false); });
    var mq = matchMedia('(min-width: 761px)');
    (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function (e) { if (e.matches) setOpen(false); });
  }

  /* ---- Entrada suave ---- */
  var alvos = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });
    alvos.forEach(function (a) { io.observe(a); });
    /* salvaguarda: nenhum conteúdo fica oculto se a rolagem for rápida, na impressão ou com leitores de tela */
    var revelaTudo = function () { alvos.forEach(function (a) { a.classList.add('on'); }); };
    setTimeout(revelaTudo, 4000);
    window.addEventListener('beforeprint', revelaTudo);
    window.addEventListener('hashchange', function () { setTimeout(revelaTudo, 900); });
  } else { alvos.forEach(function (a) { a.classList.add('on'); }); }

  /* ---- Índice lateral: seção atual ---- */
  var toc = document.querySelectorAll('.toc a');
  if (toc.length && 'IntersectionObserver' in window) {
    var map = {}; toc.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) { toc.forEach(function (a) { a.classList.remove('on'); a.removeAttribute('aria-current'); }); map[e.target.id].classList.add('on'); map[e.target.id].setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    document.querySelectorAll('.asec').forEach(function (s) { so.observe(s); });
  }

  /* ---- Copiar e-mail (só confirma se a cópia realmente funcionou) ---- */
  var cb = document.querySelector('[data-copy]'), st = document.querySelector('[data-copy-status]');
  if (cb && st) {
    var lab = cb.querySelector('[data-copy-label]'), orig = lab.textContent;
    cb.addEventListener('click', function () {
      var txt = cb.getAttribute('data-copy');
      var ok = function () { lab.textContent = 'Copiado'; st.textContent = 'E-mail copiado: ' + txt; setTimeout(function () { lab.textContent = orig; }, 2200); };
      var fail = function () { st.textContent = 'Não foi possível copiar automaticamente. Selecione o endereço: ' + txt; };
      if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(txt).then(ok, fail); } else { fail(); }
    });
  }
})();
