<script setup lang="ts">
const { tiles, moves, isAdjacentToEmpty, moveTile, resetBoard, startNewGame } = usePuzzleBoard();
</script>

<template>
  <UApp>
    <main
      class="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white"
    >
      <section class="w-full max-w-md space-y-6">
        <div class="space-y-2 text-center">
          <p class="text-primary-300 text-sm font-semibold tracking-[0.3em] uppercase">15 Puzzle</p>
          <h1 class="text-4xl font-bold tracking-tight">Slide the tiles into place</h1>
          <p class="text-sm text-slate-300">Click a tile next to the empty space to move it.</p>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
          <div class="grid grid-cols-4 gap-3">
            <template v-for="(tile, index) in tiles" :key="index">
              <UButton
                v-if="tile"
                :disabled="!isAdjacentToEmpty(index)"
                :class="[
                  'aspect-square justify-center rounded-2xl border bg-slate-700/90 text-2xl font-bold text-slate-100 shadow-lg shadow-black/30 transition hover:bg-slate-600/90',
                  isAdjacentToEmpty(index)
                    ? 'border-primary-200 ring-primary-300/60 -translate-y-0.5 cursor-pointer ring-2'
                    : 'cursor-not-allowed border-white/25'
                ]"
                color="primary"
                size="xl"
                variant="solid"
                @click="moveTile(index)"
              >
                {{ tile }}
              </UButton>
              <div
                v-else
                aria-hidden="true"
                class="aspect-square rounded-2xl border border-dashed border-white/20 bg-slate-950/60"
              ></div>
            </template>
          </div>
        </div>

        <div class="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
          <span class="text-sm text-slate-300">Moves</span>
          <span aria-label="Move count" class="text-2xl font-bold">{{ moves }}</span>
        </div>

        <div class="flex justify-center gap-3">
          <UButton
            class="hover:border-primary-200/60 hover:shadow-primary-950/30 cursor-pointer rounded-full border border-white/15 bg-slate-800/80 px-6 py-2.5 font-semibold text-slate-100 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-700/90 hover:text-white"
            color="neutral"
            size="lg"
            variant="ghost"
            @click="resetBoard"
          >
            Reset
          </UButton>

          <UButton
            class="hover:border-primary-200/60 hover:shadow-primary-950/30 cursor-pointer rounded-full border border-white/15 bg-slate-800/80 px-6 py-2.5 font-semibold text-slate-100 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-700/90 hover:text-white"
            color="neutral"
            size="lg"
            variant="ghost"
            @click="startNewGame"
          >
            New game
          </UButton>
        </div>
      </section>
    </main>
  </UApp>
</template>
