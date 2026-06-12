<script setup lang="ts">
const { tiles, moves, isComplete, isAdjacentToEmpty, moveTile, resetBoard, startNewGame } =
  usePuzzleBoard();

const moveLabel = computed(() => (moves.value === 1 ? 'move' : 'moves'));
</script>

<template>
  <UApp>
    <main
      class="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-6 text-white sm:p-6"
    >
      <section class="w-full max-w-sm space-y-4 sm:max-w-md sm:space-y-6">
        <div class="space-y-2 text-center">
          <p class="text-primary-300 text-xs font-semibold tracking-[0.3em] uppercase sm:text-sm">
            15 Puzzle
          </p>
          <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Slide the tiles into place</h1>
          <p class="text-sm text-slate-300 sm:text-base">
            Click a tile next to the empty space to move it.
          </p>
        </div>

        <div
          class="rounded-3xl border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur sm:p-4"
        >
          <div class="grid grid-cols-4 gap-2 sm:gap-3">
            <template v-for="(tile, index) in tiles" :key="index">
              <UButton
                v-if="tile"
                :disabled="isComplete || !isAdjacentToEmpty(index)"
                :class="[
                  'aspect-square min-h-0 justify-center rounded-xl border bg-slate-700/90 p-0 text-xl font-bold text-slate-100 shadow-lg shadow-black/30 transition hover:bg-slate-600/90 sm:rounded-2xl sm:text-2xl',
                  !isComplete && isAdjacentToEmpty(index)
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
                class="aspect-square rounded-xl border border-dashed border-white/20 bg-slate-950/60 sm:rounded-2xl"
              ></div>
            </template>
          </div>
        </div>

        <div class="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
          <span class="text-sm text-slate-300">Moves</span>
          <span aria-label="Move count" class="text-2xl font-bold">{{ moves }}</span>
        </div>

        <div
          v-if="isComplete"
          aria-live="polite"
          class="border-primary-300/40 bg-primary-400/10 text-primary-100 rounded-2xl border px-4 py-3 text-center text-sm font-semibold shadow-lg shadow-black/20 sm:text-base"
        >
          Puzzle complete! You solved it in {{ moves }} {{ moveLabel }}.
        </div>

        <div class="flex flex-wrap justify-center gap-3">
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
