<template>
  <div>
    <h1 class="text-2xl font-bold mb-8">Configuración</h1>

    <div class="bg-white shadow rounded-lg p-6">
      <div class="mb-8">
        <h2 class="text-lg font-medium mb-4">Configuración General</h2>
        <form @submit.prevent="saveGeneralSettings" class="space-y-6">
          <div>
            <label
              for="storeName"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Nombre de la tienda</label
            >
            <input
              type="text"
              id="storeName"
              v-model="settings.storeName"
              class="w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label
              for="contactEmail"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Email de contacto</label
            >
            <input
              type="email"
              id="contactEmail"
              v-model="settings.contactEmail"
              class="w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Opciones de la tienda</label
            >
            <div class="space-y-2">
              <div class="flex items-center">
                <input
                  id="enableRegistrations"
                  type="checkbox"
                  v-model="settings.enableRegistrations"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  for="enableRegistrations"
                  class="ml-2 text-sm text-gray-700"
                >
                  Permitir registros de nuevos usuarios
                </label>
              </div>

              <div class="flex items-center">
                <input
                  id="maintenanceMode"
                  type="checkbox"
                  v-model="settings.maintenanceMode"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <label for="maintenanceMode" class="ml-2 text-sm text-gray-700">
                  Activar modo mantenimiento
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
              :disabled="isSaving"
            >
              {{ isSaving ? "Guardando..." : "Guardar cambios" }}
            </button>
          </div>
        </form>
      </div>

      <div class="pt-6 border-t">
        <h2 class="text-lg font-medium mb-4">Seguridad</h2>

        <div class="mb-6">
          <h3 class="font-medium text-gray-700 mb-2">Cambiar contraseña</h3>
          <form @submit.prevent="changePassword" class="space-y-4">
            <div>
              <label
                for="currentPassword"
                class="block text-sm font-medium text-gray-700"
                >Contraseña actual</label
              >
              <input
                type="password"
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                class="mt-1 w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label
                for="newPassword"
                class="block text-sm font-medium text-gray-700"
                >Nueva contraseña</label
              >
              <input
                type="password"
                id="newPassword"
                v-model="passwordForm.newPassword"
                class="mt-1 w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                class="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
                :disabled="isChangingPassword"
              >
                {{
                  isChangingPassword ? "Actualizando..." : "Cambiar contraseña"
                }}
              </button>
            </div>
          </form>
        </div>

        <div class="pt-6 border-t">
          <h3 class="text-red-600 font-medium mb-2">Zona de peligro</h3>
          <p class="text-sm text-gray-500 mb-4">
            Las acciones en esta sección pueden ser destructivas o causar
            problemas graves si no se usan correctamente.
          </p>

          <div class="space-y-4">
            <div>
              <button
                @click="confirmClearCache"
                class="border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 transition-colors"
              >
                Limpiar caché del sistema
              </button>
            </div>

            <div>
              <button
                @click="confirmResetDatabase"
                class="border border-red-300 text-red-600 py-2 px-4 rounded hover:bg-red-50 transition-colors"
              >
                Reiniciar base de datos de pruebas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <Teleport to="body">
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {{ confirmModalTitle }}
          </h3>
          <p class="text-sm text-gray-500 mb-6">{{ confirmModalMessage }}</p>

          <div class="flex justify-end space-x-3">
            <button
              @click="showConfirmModal = false"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
            >
              Cancelar
            </button>
            <button
              @click="handleConfirm"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useApi } from "~/composables/useApi";
import { useToast } from "~/composables/useToast";

// Definir middleware y layout para proteger esta ruta
definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

// Composables
const api = useApi();
const { showToast } = useToast();

// Estado para las configuraciones
const settings = ref({
  storeName: "SHOP.CO",
  contactEmail: "admin@shop.co",
  enableRegistrations: true,
  maintenanceMode: false,
});

// Estado para el formulario de contraseña
const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
});

// Estado para los modales y carga
const isSaving = ref(false);
const isChangingPassword = ref(false);
const showConfirmModal = ref(false);
const confirmModalTitle = ref("");
const confirmModalMessage = ref("");
const confirmAction = ref(null);

// Cargar configuraciones
const loadSettings = async () => {
  try {
    // Esta llamada API no existe aún, deberías implementarla en el backend
    const response = await api.get("/admin/settings");
    if (response.success) {
      settings.value = response.data;
    }
  } catch (error) {
    console.error("Error cargando configuraciones:", error);
    showToast("No se pudieron cargar las configuraciones", "error");
  }
};

// Guardar configuraciones generales
const saveGeneralSettings = async () => {
  isSaving.value = true;
  try {
    // Esta llamada API no existe aún, deberías implementarla en el backend
    const response = await api.put("/admin/settings", settings.value);
    if (response.success) {
      showToast("Configuraciones guardadas correctamente", "success");
    } else {
      showToast(response.message || "Error guardando configuraciones", "error");
    }
  } catch (error) {
    console.error("Error guardando configuraciones:", error);
    showToast("Error al conectar con el servidor", "error");
  } finally {
    isSaving.value = false;
  }
};

// Cambiar contraseña
const changePassword = async () => {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
    showToast("Debes completar ambos campos de contraseña", "error");
    return;
  }

  isChangingPassword.value = true;
  try {
    const response = await api.put("/auth/profile", {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    });

    if (response.success) {
      showToast("Contraseña actualizada correctamente", "success");
      passwordForm.value.currentPassword = "";
      passwordForm.value.newPassword = "";
    } else {
      showToast(response.message || "Error al cambiar contraseña", "error");
    }
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    showToast("Error al conectar con el servidor", "error");
  } finally {
    isChangingPassword.value = false;
  }
};

// Funciones para confirmar acciones peligrosas
const confirmClearCache = () => {
  confirmModalTitle.value = "Limpiar caché del sistema";
  confirmModalMessage.value =
    "Esta acción limpiará todas las cachés del sistema. ¿Estás seguro de que deseas continuar?";
  confirmAction.value = clearCache;
  showConfirmModal.value = true;
};

const confirmResetDatabase = () => {
  confirmModalTitle.value = "Reiniciar base de datos de pruebas";
  confirmModalMessage.value =
    "Esta acción eliminará todos los datos y volverá a cargar los datos de prueba. Esta operación es irreversible. ¿Estás seguro?";
  confirmAction.value = resetDatabase;
  showConfirmModal.value = true;
};

const handleConfirm = () => {
  if (confirmAction.value) {
    confirmAction.value();
  }
  showConfirmModal.value = false;
};

const clearCache = async () => {
  try {
    // Esta llamada API no existe aún, deberías implementarla en el backend
    const response = await api.post("/admin/settings/clear-cache");
    if (response.success) {
      showToast("Caché limpiada correctamente", "success");
    } else {
      showToast(response.message || "Error al limpiar caché", "error");
    }
  } catch (error) {
    console.error("Error limpiando caché:", error);
    showToast("Error al conectar con el servidor", "error");
  }
};

const resetDatabase = async () => {
  try {
    // Esta llamada API no existe aún, deberías implementarla en el backend
    const response = await api.post("/admin/settings/reset-database");
    if (response.success) {
      showToast("Base de datos reiniciada correctamente", "success");
    } else {
      showToast(
        response.message || "Error al reiniciar base de datos",
        "error"
      );
    }
  } catch (error) {
    console.error("Error reiniciando base de datos:", error);
    showToast("Error al conectar con el servidor", "error");
  }
};

// Cargar datos iniciales
onMounted(async () => {
  await loadSettings();
});
</script>
