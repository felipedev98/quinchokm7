<script setup>
import { asset } from '../lib/asset.js'
import { WHATSAPP_DISPLAY } from '../config.js'
import { whatsappUrl, DIRECT_MESSAGE } from '../lib/whatsapp.js'
</script>

<template>
  <footer class="overflow-hidden bg-paper">
    <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div class="grid gap-8 text-sm sm:grid-cols-3">
        <p class="text-ink/70">Eventos corporativos y privados</p>
        <a
          :href="whatsappUrl(DIRECT_MESSAGE)"
          target="_blank"
          rel="noopener"
          class="-my-3 inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline sm:justify-self-center"
        >
          WhatsApp {{ WHATSAPP_DISPLAY }}
        </a>
        <p class="text-ink/70 sm:text-right">Coyhaique, Chile.</p>
      </div>

      <img
        :src="asset('km7-logo.webp')"
        alt="QuinchoKM7"
        width="2560"
        height="386"
        loading="lazy"
        class="mt-12 w-full md:mt-16"
        style="aspect-ratio: 2560 / 386; object-fit: cover; object-position: top"
      />
    </div>
  </footer>
</template>
