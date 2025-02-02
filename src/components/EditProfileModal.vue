<template>
  <q-dialog v-model="internalOpen" persistent>
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">Edit Profile</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleSubmit">
          <q-input v-model="editableProfile.displayName" label="Username" outlined />

          <q-input v-model="editableProfile.birthday" label="Birthday" outlined type="date" />

          <q-uploader
              v-model="editableProfile.profilePicture"
              label="Upload Profile Picture"
              accept=".jpg, .png"
          />

          <div class="q-mt-md">
            <q-btn type="submit" label="Save Changes" color="primary" />
            <q-btn label="Cancel" color="negative" flat @click="close" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "EditProfileModal",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:modelValue", "updated"],
  data() {
    return {
      editableProfile: {
        displayName: this.user.displayName || "",
        birthday: this.user.birthday || "",
        profilePicture: null,
      },
    };
  },
  computed: {
    internalOpen: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  methods: {
    close() {
      this.internalOpen = false;
    },
    async handleSubmit() {
      try {
        // Simulate profile update logic
        this.$emit("updated", {
          displayName: this.editableProfile.displayName,
          birthday: this.editableProfile.birthday,
        });
        this.close();
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile.");
      }
    },
  },
};
</script>