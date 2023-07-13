import { provide, inject, reactive } from "vue";
const localStorageSymbol = Symbol();
function createLocalStorage() {
  const state = reactive({
    getItem(key) {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (error) {
        return null;
      }
    },
    setItem(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    removeItem(key) {
      localStorage.removeItem(key);
    },
    clear() {
      localStorage.clear();
    },
  });
  provide(localStorageSymbol, state);
}
function useLocalStorage() {
  const localStorage = inject(localStorageSymbol);
  if (!localStorage) {
    throw new Error(
      "useLocalStorage must be used within a component wrapped with createLocalStorage"
    );
  }
  return localStorage;
}

export { createLocalStorage, useLocalStorage };
