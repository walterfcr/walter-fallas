const root = document.documentElement
const languageButton = document.querySelector('.language-toggle')
const menuButton = document.querySelector('.menu-toggle')
const nav = document.querySelector('.main-nav')
const themeButton = document.querySelector('.theme-toggle')

function setTheme(theme) {
  const currentTheme = theme === 'light' ? 'light' : 'dark'

  root.dataset.theme = currentTheme

  if (themeButton) {
    themeButton.textContent = currentTheme === 'dark' ? 'LIGHT' : 'DARK'

    themeButton.setAttribute(
      'aria-label',
      currentTheme === 'dark'
        ? root.lang === 'es'
          ? 'Cambiar a tema claro'
          : 'Switch to light theme'
        : root.lang === 'es'
          ? 'Cambiar a tema oscuro'
          : 'Switch to dark theme',
    )
  }

  const themeColor = document.querySelector('meta[name="theme-color"]')

  themeColor?.setAttribute(
    'content',
    currentTheme === 'dark' ? '#0B1020' : '#F5F3EE',
  )

  try {
    sessionStorage.setItem('portfolio-theme', currentTheme)
  } catch {
    // El sitio sigue funcionando si el almacenamiento está bloqueado.
  }
}

themeButton?.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'light' ? 'dark' : 'light')
})

// Cambiar entre español e inglés.
function setLanguage(language) {
  const lang = language === 'en' ? 'en' : 'es'

  root.lang = lang

  document.querySelectorAll('[data-es][data-en]').forEach((element) => {
    const text = element.getAttribute(`data-${lang}`)

    if (text !== null) {
      if (element.tagName === 'H2') {
        element.innerHTML = text
      } else {
        element.textContent = text
      }
    }
  })

  if (languageButton) {
    languageButton.textContent = lang === 'es' ? 'EN' : 'ES'
    languageButton.setAttribute(
      'aria-label',
      lang === 'es' ? 'Switch to English' : 'Cambiar a español',
    )
  }

  if (menuButton) {
    menuButton.setAttribute(
      'aria-label',
      lang === 'es' ? 'Abrir menú' : 'Open menu',
    )
    menuButton.firstChild.textContent = lang === 'es' ? 'MENÚ ' : 'MENU '
  }

  try {
    sessionStorage.setItem('portfolio-language', lang)
  } catch {
    // El sitio sigue funcionando si el almacenamiento está bloqueado.
  }
}

languageButton?.addEventListener('click', () => {
  setLanguage(root.lang === 'es' ? 'en' : 'es')
})

// Menú para móviles.
menuButton?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('is-open') ?? false

  menuButton.setAttribute('aria-expanded', String(isOpen))

  const symbol = menuButton.querySelector('span')
  if (symbol) symbol.textContent = isOpen ? '−' : '+'
})

// Cerrar el menú al navegar.
nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open')
    menuButton?.setAttribute('aria-expanded', 'false')

    const symbol = menuButton?.querySelector('span')
    if (symbol) symbol.textContent = '+'
  })
})

// Año automático en el pie de página.
const year = document.querySelector('#year')
if (year) year.textContent = String(new Date().getFullYear())

// Ocultar imágenes que todavía no existen.
document.querySelectorAll('.project-visual img').forEach((img) => {
  img.addEventListener('error', () => {
    img.style.display = 'none'
  })
})

// Animaciones de entrada suaves.
const reduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches

const revealItems = document.querySelectorAll('.reveal')

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'))
} else {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          currentObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 },
  )

  revealItems.forEach((item) => observer.observe(item))
}

// Recuperar el idioma seleccionado.
try {
  setLanguage(sessionStorage.getItem('portfolio-language') || 'es')
} catch {
  setLanguage('es')
}

try {
  setTheme(sessionStorage.getItem('portfolio-theme') || 'dark')
} catch {
  setTheme('dark')
}

const user = 'hola'
const domain = ['walterfallascr', 'com'].join('.')
const email = `${user}@${domain}`

document.querySelectorAll('[data-email-link]').forEach((link) => {
  link.href = `mailto:${email}`

  const text = link.querySelector('[data-email-text]')

  if (text) {
    text.textContent = link.classList.contains('footer-cta')
      ? `${email} ↗`
      : 'Email'
  }
})
