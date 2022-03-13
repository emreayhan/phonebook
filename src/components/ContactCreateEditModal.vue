<template>
  <b-modal
    ref="contactCreateEditModal"
    size="lg"
    hide-footer
    :title="title == 'create' ? 'Create A New Contact' : 'Edit A Contact'"
    v-bind="$attrs"
    v-on="$listeners"
    @shown="
      () => {
        title == 'create'
          ? (form = {})
          : (form = JSON.parse(JSON.stringify(item)));
        getAllContacts();
        $emit('update:show', false);
      }
    "
    @hidden="
      () => {
        form = {};
        getAllContacts();
        $emit('update:show', true);
      }
    "
  >
    <div class="d-flex flex-column" style="gap: 20px">
      <b-form-input
        v-model="form.first_name"
        type="text"
        placeholder="First Name"
      />
      <b-form-input
        v-model="form.last_name"
        type="text"
        placeholder="Last Name"
      />
      <VuePhoneNumberInput
        v-model="form.phone_number"
        @update="handlePhoneNumberEnter"
      />
    </div>
    <template>
      <div class="w-100 mt-4 d-flex flex-column footer">
        <div class="w-100 d-flex justify-content-end align-items-baseline">
          <template>
            <b-button class="mr-2" variant="outline-secondary" @click="hide">
              Cancel
            </b-button>
            <b-button
              variant="primary"
              @click="handleApproveButton"
              :disabled="checkForm"
            >
              {{ title == "create" ? "Create" : "Update" }}
            </b-button>
          </template>
        </div>
      </div>
    </template>
  </b-modal>
</template>
<script>
import dayjs from "dayjs";
import { mapActions, mapState } from "vuex";
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
export default {
  name: "ContactCreateEditModal",

  components: {
    VuePhoneNumberInput,
  },

  props: {
    title: {
      type: String,
      required: "Create",
    },
    item: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {
      form: {
        id: null,
        first_name: null,
        last_name: null,
        phone_number: null,
        created_at: null,
      },
      isPhoneNumberValid: false,
      formattedNumber: null,
    };
  },

  computed: {
    ...mapState("phonebook", ["contacts"]),
    checkForm() {
      return (
        Object.values(this.form).some((value) => value === null) ||
        this.isPhoneNumberValid == false
      );
    },
  },

  methods: {
    ...mapActions("phonebook", [
      "updateContact",
      "addNewContact",
      "getAllContacts",
    ]),

    async handleApproveButton() {
      if (this.title == "create") {
        const { first_name, last_name } = this.form;

        const payload = {
          id: this.contacts.length + 1,
          first_name,
          last_name,
          created_at: dayjs().format("DD MMMM YYYY, HH:mm"),
          phone_number: this.formattedNumber,
        };

        const res = await this.addNewContact(payload);

        if (res) {
          this.$bvToast.toast("Contact created successfully", {
            title: "Create a Contact ",
            variant: "success",
            solid: true,
          });
        } else if (!res) {
          this.$bvToast.toast(
            "Contact could not be added, Phone number should be unique",
            {
              title: "Create a Contact ",
              variant: "danger",
              solid: true,
            }
          );
        }
        this.hide();
      } else {
        const { first_name, last_name, id, created_at } = this.form;

        const payload = {
          id,
          first_name,
          last_name,
          created_at,
          phone_number: this.formattedNumber,
        };

        await this.updateContact(payload);

        this.$bvToast.toast("Contact updated successfully", {
          title: "Update a Contact ",
          variant: "success",
          solid: true,
        });
        this.hide();
      }
    },

    show() {
      return this.$refs.contactCreateEditModal.show();
    },

    hide() {
      this.form = {};
      return this.$refs.contactCreateEditModal.hide();
    },
    async handlePhoneNumberEnter(event) {
      this.isPhoneNumberValid = event.isValid;
      this.formattedNumber = await event.e164;
    },
  },
};
</script>
