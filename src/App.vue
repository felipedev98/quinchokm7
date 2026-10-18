<script setup>
import { onMounted } from 'vue'
import { MotionConfig } from 'motion-v'
import { precargarAlEstarOcioso } from './lib/lazy.js'
import { TESTIMONIOS_VISIBLES, PROMO_ACTIVE } from './config.js'
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/HeroSection.vue'
import UsosSection from './components/UsosSection.vue'
import EquipamientoSection from './components/EquipamientoSection.vue'
import ModalidadesSection from './components/ModalidadesSection.vue'
import GaleriaSection from './components/GaleriaSection.vue'
import TestimoniosSection from './components/TestimoniosSection.vue'
import CotizaSection from './components/CotizaSection.vue'
import UbicacionSection from './components/UbicacionSection.vue'
import PromoToast from './components/PromoToast.vue'
import SiteFooter from './components/SiteFooter.vue'

onMounted(precargarAlEstarOcioso)
</script>

<template>
  <MotionConfig reduced-motion="user">
    <div id="pagina">
      <SiteHeader />
      <main>
        <HeroSection />
        <UsosSection />
        <EquipamientoSection />
        <ModalidadesSection />
        <GaleriaSection />
        <TestimoniosSection v-if="TESTIMONIOS_VISIBLES" />
        <UbicacionSection />
        <CotizaSection :promo-active="PROMO_ACTIVE" />
      </main>
      <SiteFooter />
    </div>
    <PromoToast :active="PROMO_ACTIVE" />
  </MotionConfig>
</template>
