/**
 * HOTEL RADHE KRISHNA PALACE, VARANASI
 * Master Client-Facing Application & Direct Booking Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Official Owner Contact Details (Primary: +919696619832)
  const defaultContact = {
    phone: '+919696619832',
    phoneDisplay: '+91 96966 19832',
    phone2: '+919044241613',
    phone2Display: '+91 90442 41613',
    phone3: '+919336103236',
    phone3Display: '+91 93361 03236',
    whatsapp: '919696619832',
    whatsapp2: '919044241613',
    name: 'Hotel Radhe Krishna Palace'
  };

  let currentContact = { ...defaultContact };
  const savedContact = localStorage.getItem('radhe_palace_contact_v4');
  if (savedContact) {
    try {
      currentContact = { ...defaultContact, ...JSON.parse(savedContact) };
    } catch (e) {
      console.error('Error loading saved contact', e);
    }
  }

  // Update all phone and WhatsApp links across the entire DOM
  function updateDOMContacts() {
    // Phone Links
    document.querySelectorAll('.js-phone-link').forEach(el => {
      el.setAttribute('href', `tel:${currentContact.phone}`);
    });
    document.querySelectorAll('.js-phone-text').forEach(el => {
      el.textContent = currentContact.phoneDisplay || currentContact.phone;
    });

    // WhatsApp Links (default greeting)
    document.querySelectorAll('.js-wa-link').forEach(el => {
      const defaultMsg = encodeURIComponent("Namaste Hotel Radhe Krishna Palace! 🙏 I want to inquire about room booking and availability at your Varanasi hotel.");
      el.setAttribute('href', `https://wa.me/${currentContact.whatsapp}?text=${defaultMsg}`);
    });
  }
  updateDOMContacts();

  // Header Scroll Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile Navigation Drawer Toggle
  const menuBtn = document.getElementById('menuToggleBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const drawerClose = document.getElementById('drawerCloseBtn');

  function openDrawer() {
    drawer?.classList.add('open');
    backdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer?.classList.remove('open');
    backdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuBtn?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Live IST Clock & Greeting
  const liveClockEl = document.getElementById('liveISTClock');
  function updateLiveClock() {
    if (!liveClockEl) return;
    const now = new Date();
    // Format in IST
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const istTimeStr = new Intl.DateTimeFormat('en-IN', options).format(now);
    liveClockEl.textContent = `${istTimeStr} IST`;
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // Booking Engine Form & Date Setup
  const checkinInput = document.getElementById('calcCheckin');
  const checkoutInput = document.getElementById('calcCheckout');
  const roomTypeSelect = document.getElementById('calcRoomType');
  const guestsSelect = document.getElementById('calcGuests');
  const calcBtn = document.getElementById('btnCalculateRate');
  const resultBox = document.getElementById('calcResultBox');

  // Set default dates: checkin = today, checkout = tomorrow
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (d) => d.toISOString().split('T')[0];
  if (checkinInput && !checkinInput.value) checkinInput.value = formatDate(today);
  if (checkoutInput && !checkoutInput.value) checkoutInput.value = formatDate(tomorrow);

  // Room Pricing Matrix (Direct Discount vs OTA)
  const roomRates = {
    standard: { name: 'Standard Non-AC Room', directRate: 899, otaRate: 1199 },
    deluxe: { name: 'Deluxe AC Room (Top Choice)', directRate: 1299, otaRate: 1749 },
    family: { name: 'Super Deluxe Family Suite', directRate: 1799, otaRate: 2399 }
  };

  function calculateBooking() {
    if (!checkinInput || !checkoutInput || !roomTypeSelect || !guestsSelect) return;

    const cin = new Date(checkinInput.value);
    const cout = new Date(checkoutInput.value);

    // Validate dates
    if (isNaN(cin.getTime()) || isNaN(cout.getTime()) || cout <= cin) {
      showToast('⚠️ Please select a check-out date after check-in date.');
      return;
    }

    const diffTime = Math.abs(cout - cin);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const roomKey = roomTypeSelect.value;
    const roomData = roomRates[roomKey] || roomRates.deluxe;

    const totalDirect = roomData.directRate * nights;
    const totalOTA = roomData.otaRate * nights;
    const totalSavings = totalOTA - totalDirect;

    // Update Result UI
    document.getElementById('resRoomName').textContent = roomData.name;
    document.getElementById('resNights').textContent = `${nights} Night${nights > 1 ? 's' : ''}`;
    document.getElementById('resDirectPrice').textContent = `₹${totalDirect.toLocaleString('en-IN')}`;
    document.getElementById('resOtaPrice').textContent = `₹${totalOTA.toLocaleString('en-IN')}`;
    document.getElementById('resSavings').textContent = `Save ₹${totalSavings.toLocaleString('en-IN')} (Direct Deal)`;

    // Build WhatsApp Deep Link
    const waMsg = encodeURIComponent(
      `*Namaste Hotel Radhe Krishna Palace!* 🙏\n` +
      `I would like to book a direct room reservation:\n\n` +
      `🏨 *Room:* ${roomData.name}\n` +
      `📅 *Check-In:* ${checkinInput.value}\n` +
      `📅 *Check-Out:* ${checkoutInput.value} (${nights} Night${nights > 1 ? 's' : ''})\n` +
      `👥 *Guests:* ${guestsSelect.value}\n` +
      `💰 *Direct Booking Rate:* ₹${totalDirect.toLocaleString('en-IN')}\n\n` +
      `Please confirm availability. Looking forward to our stay in Varanasi!`
    );

    const waBtn = document.getElementById('resWaBtn');
    if (waBtn) {
      waBtn.setAttribute('href', `https://wa.me/${currentContact.whatsapp}?text=${waMsg}`);
    }

    resultBox?.classList.add('active');
    resultBox?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast(`✨ Special direct discount applied! You save ₹${totalSavings}!`);
  }

  calcBtn?.addEventListener('click', calculateBooking);

  // Quick Room Card Book Buttons
  document.querySelectorAll('.js-quick-book-room').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const roomType = e.currentTarget.getAttribute('data-room-type');
      if (roomTypeSelect && roomType) {
        roomTypeSelect.value = roomType;
        calculateBooking();
        const bookingSection = document.getElementById('booking-engine');
        bookingSection?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Gallery Filtering
  const filterTabs = document.querySelectorAll('.filter-tab');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Modal for Photos
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title')?.textContent || '';
      const caption = item.querySelector('.gallery-caption')?.textContent || '';

      if (lightbox && lightboxImg && img) {
        lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.textContent = `${title} — ${caption}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeCustomizer();
    }
  });

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Owner Customizer Modal (Lets Client or Sales Agent test live phone & WhatsApp numbers)
  const customizerModal = document.getElementById('customizerModal');
  const openCustomizerBtn = document.getElementById('btnOpenCustomizer');
  const closeCustomizerBtn = document.getElementById('customizerCloseBtn');
  const saveCustomizerBtn = document.getElementById('btnSaveCustomizer');
  const inputPhone = document.getElementById('custPhoneInput');
  const inputWa = document.getElementById('custWaInput');

  function openCustomizer() {
    if (inputPhone) inputPhone.value = currentContact.phoneDisplay;
    if (inputWa) inputWa.value = currentContact.whatsapp;
    customizerModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCustomizer() {
    customizerModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  openCustomizerBtn?.addEventListener('click', openCustomizer);
  closeCustomizerBtn?.addEventListener('click', closeCustomizer);
  customizerModal?.addEventListener('click', (e) => {
    if (e.target === customizerModal) closeCustomizer();
  });

  saveCustomizerBtn?.addEventListener('click', () => {
    const phoneVal = inputPhone?.value.trim() || defaultContact.phone;
    const waVal = inputWa?.value.replace(/\D/g, '') || defaultContact.whatsapp;

    currentContact = {
      phone: phoneVal.replace(/\s+/g, ''),
      phoneDisplay: phoneVal,
      whatsapp: waVal,
      name: 'Hotel Radhe Krishna Palace'
    };

    localStorage.setItem('radhe_palace_contact_v4', JSON.stringify(currentContact));
    updateDOMContacts();
    closeCustomizer();
    showToast('✅ Contact numbers updated! Try testing the WhatsApp or Call buttons now.');
  });

  // Simple Multi-Language Toggle (English / Hindi हिंदी)
  const langToggleBtn = document.getElementById('langToggleBtn');
  let currentLang = 'en';

  const translations = {
    en: {
      bookDirect: 'Book Direct & Save 15%',
      heroBadge: 'Sunderpur, Lanka, Varanasi • Only 150m from MPMMCC Cancer Centre & BHU',
      heroTitle: 'Hotel Radhe Krishna Palace',
      heroSub: 'Experience tranquil hospitality, pristine clean AC rooms, and authentic Varanasi warmth. Located just 150 meters (1.5 mins walk) from MPMMCC Cancer Hospital and minutes from Assi Ghat & Kashi Vishwanath.',
      roomsHeading: 'Comfortable & Budget-Friendly Accommodations',
      directSave: 'Direct Booking Benefit',
      otaCut: 'Zero Middleman Commission'
    },
    hi: {
      bookDirect: 'सीधे बुक करें और 15% छूट पाएं',
      heroBadge: 'सुंदरपुर, लंका, वाराणसी • कैंसर अस्पताल (MPMMCC) से मात्र 150 मीटर',
      heroTitle: 'होटल राधे कृष्णा पैलेस',
      heroSub: 'वाराणसी में शांत, स्वच्छ एसी कमरे और प्रामाणिक आतिथ्य का आनंद लें। महामना कैंसर अस्पताल से मात्र 150 मीटर (1.5 मिनट की दूरी) और अस्सी घाट व काशी विश्वनाथ मंदिर से कुछ ही दूरी पर।',
      roomsHeading: 'आरामदायक एवं बजट-अनुकूल कमरे',
      directSave: 'डायरेक्ट बुकिंग लाभ',
      otaCut: 'बिचौलियों और कमीशन से 100% मुक्ति'
    }
  };

  langToggleBtn?.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    const langData = translations[currentLang];
    langToggleBtn.innerHTML = currentLang === 'en' ? '🌐 <span>हिंदी</span>' : '🌐 <span>English</span>';

    // Apply translations
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (langData[key]) {
        el.textContent = langData[key];
      }
    });

    showToast(currentLang === 'en' ? 'Switched to English' : 'भाषा हिंदी में बदली गई');
  });

  // Toast Notification System
  function showToast(msg) {
    let toast = document.getElementById('siteToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'siteToast';
      toast.style.position = 'fixed';
      toast.style.bottom = '85px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = 'rgba(17, 24, 39, 0.95)';
      toast.style.color = '#F3C766';
      toast.style.border = '1px solid rgba(212, 175, 55, 0.4)';
      toast.style.padding = '0.75rem 1.4rem';
      toast.style.borderRadius = '9999px';
      toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
      toast.style.fontSize = '0.88rem';
      toast.style.fontWeight = '600';
      toast.style.zIndex = '3000';
      toast.style.transition = 'all 0.3s ease';
      toast.style.textAlign = 'center';
      toast.style.pointerEvents = 'none';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
    }, 3800);
  }

  // ==========================================================================
  // ROYAL 3-4s OPENING WELCOME AUDIO & CHIME ENGINE
  // ==========================================================================
  const audioElement = document.getElementById('royalWelcomeAudio');
  const soundButtons = document.querySelectorAll('.sound-toggle-btn');
  const preloaderAudioStatus = document.getElementById('preloaderAudioStatus');
  const preloaderProgressBar = document.getElementById('preloaderProgressBar');
  const preloaderTapHint = document.getElementById('preloaderTapHint');
  let audioContext = null;
  let audioPlayed = false;

  // Web Audio API Synthesizer Fallback (Temple Bell with sacred harmonic decay)
  function playSynthesizedBell() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContext) {
        audioContext = new AudioCtx();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      const now = audioContext.currentTime;
      // Frequencies for sacred resonant Indian chime (G#4, C#5, D#5, G#5, C#6)
      const harmonics = [
        { freq: 415.3, gain: 0.28, type: 'sine' },
        { freq: 554.37, gain: 0.35, type: 'sine' },
        { freq: 622.25, gain: 0.22, type: 'triangle' },
        { freq: 830.61, gain: 0.20, type: 'sine' },
        { freq: 1108.73, gain: 0.12, type: 'sine' }
      ];

      harmonics.forEach(h => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = h.type;
        osc.frequency.setValueAtTime(h.freq, now);

        // Smooth 3.5s natural chime envelope
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(h.gain, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.6);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(now);
        osc.stop(now + 3.65);
      });
    } catch (e) {
      console.warn('Web Audio synthesis fallback error:', e);
    }
  }

  function setAudioVisualPlaying(isPlaying) {
    if (preloaderAudioStatus) {
      if (isPlaying) {
        preloaderAudioStatus.style.opacity = '1';
        if (preloaderTapHint) preloaderTapHint.style.display = 'none';
      }
    }
    soundButtons.forEach(btn => {
      if (isPlaying) {
        btn.classList.add('playing');
      } else {
        btn.classList.remove('playing');
      }
    });
  }

  function playRoyalWelcomeMusic(showToastNotice = false) {
    let playPromise = null;
    if (audioElement) {
      audioElement.currentTime = 0;
      audioElement.volume = 0.85;
      playPromise = audioElement.play();
    }

    if (playPromise !== null && playPromise !== undefined) {
      playPromise.then(() => {
        audioPlayed = true;
        setAudioVisualPlaying(true);
        if (showToastNotice) {
          showToast('🎵 Playing Royal Welcome Chime (3.6s)');
        }
        setTimeout(() => {
          setAudioVisualPlaying(false);
        }, 3600);
      }).catch(err => {
        // Autoplay policy prevented immediate playback
        if (preloaderTapHint) {
          preloaderTapHint.style.display = 'inline-flex';
        }
        // If triggered by a user click, use synthesized chime as fallback
        if (showToastNotice) {
          playSynthesizedBell();
          showToast('🎵 Playing Royal Welcome Chime (3.6s)');
          setAudioVisualPlaying(true);
          setTimeout(() => setAudioVisualPlaying(false), 3600);
        }
      });
    } else {
      playSynthesizedBell();
      setAudioVisualPlaying(true);
      if (showToastNotice) {
        showToast('🎵 Playing Royal Welcome Chime (3.6s)');
      }
      setTimeout(() => setAudioVisualPlaying(false), 3600);
    }
  }

  // Bind sound toggle buttons in header and announcement bar
  soundButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      playRoyalWelcomeMusic(true);
    });
  });

  // Royal Preloader Curtain Reveal with 3-4s Opening Sequence
  const preloader = document.getElementById('royalPreloader');
  if (preloader) {
    // Start progress bar animation smoothly
    if (preloaderProgressBar) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          preloaderProgressBar.style.width = '100%';
        }, 80);
      });
    }

    // Attempt to start 3-4s welcome chime
    playRoyalWelcomeMusic(false);

    // If user clicks anywhere on preloader or window during opening, ensure music triggers
    const onPreloaderInteraction = () => {
      if (!audioPlayed) {
        playRoyalWelcomeMusic(false);
      }
    };
    preloader.addEventListener('click', onPreloaderInteraction);
    window.addEventListener('click', onPreloaderInteraction, { once: true });
    window.addEventListener('touchstart', onPreloaderInteraction, { once: true });

    const finishPreloader = () => {
      preloader.classList.add('loaded');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 900);
    };

    // Royal opening animation duration: 3.4 seconds (3-4 sec as requested)
    const OPENING_ANIMATION_MS = 3400;
    setTimeout(finishPreloader, OPENING_ANIMATION_MS);
  }

  // Scroll Reveal Animations via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-init');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('reveal-visible'));
  }

  // ==========================================================================
  // SACRED WELCOME FLOWER PETALS & GOLDEN BUTTERFLIES PARTICLE ENGINE
  // ==========================================================================
  const canvas = document.getElementById('royalEffectsCanvas');
  const toggleEffectsBtn = document.getElementById('btnToggleEffects');
  const effectsStatusText = document.getElementById('effectsStatusText');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let effectsActive = localStorage.getItem('radhe_effects_enabled') !== 'false';
    if (!effectsActive) {
      canvas.classList.add('effects-disabled');
      if (toggleEffectsBtn) toggleEffectsBtn.classList.add('effects-off');
      if (effectsStatusText) effectsStatusText.textContent = 'Effects: Off';
    }

    const isMobile = window.innerWidth < 768;
    const maxParticles = isMobile ? 22 : 38;
    const particles = [];
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let scrollTimeout = null;

    // Listen to scroll velocity for realistic air breeze
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      scrollVelocity = Math.max(-15, Math.min(15, delta * 0.4));

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollVelocity = 0;
      }, 100);
    }, { passive: true });

    // Resize handler
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Particle Factory
    class RoyalParticle {
      constructor(isWelcomeShower = false) {
        this.reset(isWelcomeShower);
      }

      reset(isWelcomeShower = false) {
        this.x = Math.random() * width;
        this.y = isWelcomeShower ? Math.random() * height * 0.5 - height * 0.4 : -30;
        
        // Types: 0 = Marigold Petal, 1 = Lotus/Rose Petal, 2 = Golden Butterfly, 3 = Golden Sparkle
        const rand = Math.random();
        if (rand < 0.45) {
          this.type = 0; // Marigold
          this.size = 11 + Math.random() * 8;
        } else if (rand < 0.80) {
          this.type = 1; // Lotus / Rose
          this.size = 12 + Math.random() * 9;
        } else if (rand < 0.94) {
          this.type = 2; // Golden Butterfly
          this.size = 16 + Math.random() * 8;
        } else {
          this.type = 3; // Golden Stardust
          this.size = 3 + Math.random() * 4;
        }

        this.speedY = 1.0 + Math.random() * 1.8;
        this.speedX = (Math.random() - 0.5) * 1.2;
        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = (Math.random() - 0.5) * 0.04;
        this.swing = Math.random() * Math.PI * 2;
        this.swingSpeed = 0.02 + Math.random() * 0.03;
        this.wingFlap = Math.random() * Math.PI * 2;
        this.wingSpeed = 0.25 + Math.random() * 0.15;
        this.opacity = 0.75 + Math.random() * 0.25;
        this.flip = Math.random() * Math.PI;
        this.flipSpeed = 0.02 + Math.random() * 0.03;
      }

      update() {
        this.angle += this.angularSpeed;
        this.swing += this.swingSpeed;
        this.flip += this.flipSpeed;
        this.wingFlap += this.wingSpeed;

        // Base falling speed modified by scroll velocity
        const effectiveBreeze = scrollVelocity * 0.5;
        this.y += this.speedY + Math.abs(scrollVelocity * 0.2);
        this.x += this.speedX + Math.sin(this.swing) * 1.2 + effectiveBreeze * 0.3;

        // Reset if out of viewport
        if (this.y > height + 40 || this.x < -60 || this.x > width + 60) {
          this.reset(false);
          this.y = -25;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        if (this.type === 0) {
          // ==============================
          // 🌸 MARIGOLD (GENDA) PETAL
          // ==============================
          const scaleX = Math.cos(this.flip);
          ctx.scale(scaleX, 1);
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.4, this.size * 0.7, this.size * 0.7, 0, this.size);
          ctx.bezierCurveTo(-this.size * 0.7, this.size * 0.7, -this.size * 0.8, -this.size * 0.4, 0, -this.size);
          
          const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
          grad.addColorStop(0, '#FBBF24');   // Bright Saffron Gold
          grad.addColorStop(0.5, '#F59E0B'); // Warm Amber
          grad.addColorStop(1, '#D97706');   // Deep Terracotta Gold
          ctx.fillStyle = grad;
          ctx.globalAlpha = this.opacity;
          ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
          ctx.shadowBlur = 6;
          ctx.fill();

        } else if (this.type === 1) {
          // ==============================
          // 🪷 LOTUS / ROSE (KAMAL) PETAL
          // ==============================
          const scaleX = Math.sin(this.flip);
          ctx.scale(scaleX, 1);
          ctx.beginPath();
          ctx.moveTo(0, -this.size * 1.1);
          ctx.quadraticCurveTo(this.size * 0.9, -this.size * 0.2, 0, this.size * 0.9);
          ctx.quadraticCurveTo(-this.size * 0.9, -this.size * 0.2, 0, -this.size * 1.1);

          const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
          grad.addColorStop(0, '#FDA4AF');   // Soft Lotus Petal Pink
          grad.addColorStop(0.6, '#F43F5E'); // Rich Varanasi Rose
          grad.addColorStop(1, '#BE123C');   // Deep Sacred Crimson
          ctx.fillStyle = grad;
          ctx.globalAlpha = this.opacity * 0.92;
          ctx.shadowColor = 'rgba(244, 63, 94, 0.35)';
          ctx.shadowBlur = 5;
          ctx.fill();

        } else if (this.type === 2) {
          // ==============================
          // 🦋 GOLDEN SACRED BUTTERFLY
          // ==============================
          const flap = Math.sin(this.wingFlap);
          const wingSpan = Math.abs(flap) * this.size * 0.9 + this.size * 0.2;

          ctx.shadowColor = 'rgba(234, 179, 8, 0.75)';
          ctx.shadowBlur = 10;
          ctx.globalAlpha = this.opacity;

          // Left Wing
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(-wingSpan * 0.5, -this.size * 0.2, wingSpan * 0.5, this.size * 0.7, -0.2, 0, Math.PI * 2);
          const leftGrad = ctx.createRadialGradient(-wingSpan * 0.5, -this.size * 0.2, 1, -wingSpan * 0.5, -this.size * 0.2, this.size);
          leftGrad.addColorStop(0, '#FEF08A');
          leftGrad.addColorStop(0.5, '#EAB308');
          leftGrad.addColorStop(1, '#B45309');
          ctx.fillStyle = leftGrad;
          ctx.fill();
          ctx.restore();

          // Right Wing
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(wingSpan * 0.5, -this.size * 0.2, wingSpan * 0.5, this.size * 0.7, 0.2, 0, Math.PI * 2);
          const rightGrad = ctx.createRadialGradient(wingSpan * 0.5, -this.size * 0.2, 1, wingSpan * 0.5, -this.size * 0.2, this.size);
          rightGrad.addColorStop(0, '#FEF08A');
          rightGrad.addColorStop(0.5, '#EAB308');
          rightGrad.addColorStop(1, '#B45309');
          ctx.fillStyle = rightGrad;
          ctx.fill();
          ctx.restore();

          // Torso & Antennae
          ctx.beginPath();
          ctx.ellipse(0, 0, 1.8, this.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#78350F';
          ctx.fill();

        } else if (this.type === 3) {
          // ==============================
          // ✨ SACRED GOLDEN SPARKLE DUST
          // ==============================
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fillStyle = '#FEF08A';
          ctx.shadowColor = 'rgba(253, 224, 71, 0.9)';
          ctx.shadowBlur = 12;
          ctx.globalAlpha = (Math.sin(this.swing * 2) * 0.4 + 0.6) * this.opacity;
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Initialize particle pool with welcome shower
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new RoyalParticle(true));
    }

    // Main animation loop (optimized 60FPS)
    let animFrameId = null;
    function renderEffects() {
      if (!effectsActive) return;

      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animFrameId = requestAnimationFrame(renderEffects);
    }

    // Start loop
    if (effectsActive) {
      renderEffects();
    }

    // Pause animation when tab is inactive to preserve battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrameId);
      } else if (effectsActive) {
        renderEffects();
      }
    });

    // Interactive Mouse / Touch Stardust Spawn
    let lastSparkleTime = 0;
    const spawnSparkleAt = (clientX, clientY) => {
      if (!effectsActive) return;
      const now = performance.now();
      if (now - lastSparkleTime < 50) return;
      lastSparkleTime = now;

      // Find an inactive sparkle or repurpose oldest particle
      const p = particles[Math.floor(Math.random() * particles.length)];
      p.x = clientX + (Math.random() - 0.5) * 20;
      p.y = clientY + (Math.random() - 0.5) * 20;
      p.type = 3;
      p.speedY = 0.5 + Math.random();
      p.speedX = (Math.random() - 0.5) * 1.5;
      p.size = 3.5 + Math.random() * 3;
      p.opacity = 1;
    };

    window.addEventListener('mousemove', (e) => spawnSparkleAt(e.clientX, e.clientY), { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        spawnSparkleAt(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    // Effects Toggle Button Handler
    if (toggleEffectsBtn) {
      toggleEffectsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        effectsActive = !effectsActive;
        localStorage.setItem('radhe_effects_enabled', effectsActive ? 'true' : 'false');

        if (effectsActive) {
          canvas.classList.remove('effects-disabled');
          toggleEffectsBtn.classList.remove('effects-off');
          if (effectsStatusText) effectsStatusText.textContent = '🌸 Flowers & Butterflies';
          showToast('🌸 Sacred flowers & golden butterflies enabled!');
          renderEffects();
        } else {
          canvas.classList.add('effects-disabled');
          toggleEffectsBtn.classList.add('effects-off');
          if (effectsStatusText) effectsStatusText.textContent = 'Effects: Off';
          showToast('Effects paused');
          ctx.clearRect(0, 0, width, height);
          cancelAnimationFrame(animFrameId);
        }
      });
    }
  }
});
