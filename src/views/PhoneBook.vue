<template>
  <div>
    <h2 class="mb-3">Phone Book App</h2>
    <div class="d-flex justify-content-center mb-4" style="gap: 750px">
      <div class="d-flex">
        <h6
          class="list-title"
          id="contact-list"
          @click="handleChangeItems('contacts')"
        >
          Contact List
        </h6>
        <h6
          id="favorite-list"
          class="list-title"
          @click="handleChangeItems('favoriteContacts')"
        >
          Favorite List
        </h6>
      </div>
      <b-button
        @click="openContactCreateEditModal({ title: 'create', item: null })"
        variant="primary"
      >
        Add New Contact
      </b-button>
    </div>

    <div class="d-flex flex-column align-items-center">
      <b-row class="col-8">
        <b-table
          striped
          hover
          :per-page="perPage"
          :current-page="currentPage"
          :items="filteredList"
          :fields="itemType == 'contacts' ? fields : favoriteFields"
        >
          <template #top-row="{ fields }">
            <td
              v-for="(field, i) of fields"
              :key="field.key + i"
              class="text-center w-55"
            >
              <b-input
                v-if="field._searchable"
                v-model="tableFilters[field.key]"
                :type="field._type || 'text'"
              />
            </td>
          </template>
          <template slot="delete" slot-scope="{ item }">
            <b-button @click="handleDeleteContact(item)" variant="danger">
              Delete
            </b-button>
          </template>
          <template slot="edit" slot-scope="{ item }">
            <b-button
              @click="openContactCreateEditModal({ title: 'edit', item })"
              variant="warning"
            >
              Edit
            </b-button>
          </template>
          <template slot="setFavorite" slot-scope="{ item }">
            <b-button
              @click="handleFavContact(item)"
              variant="success"
              :disabled="
                favoriteContacts
                  .map((contacts) => contacts.id)
                  .includes(item.id)
              "
            >
              Fav
            </b-button>
          </template>
          <template slot="unsetFavorite" slot-scope="{ item }">
            <b-button @click="handleUnFavContact(item)" variant="danger">
              UnFav
            </b-button>
          </template>
        </b-table>
        <b-pagination
          v-model="currentPage"
          :total-rows="filteredList.length"
          :per-page="perPage"
          aria-controls="my-table"
        />
      </b-row>
    </div>
    <contact-create-edit-modal
      ref="contactCreateEditModal"
      :title="contactCreateEditModalTitle"
      :item="selectedItem"
      :show.sync="isUpdateProcessDone"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import dayjs from "dayjs";
import ContactCreateEditModal from "../components/ContactCreateEditModal.vue";
import { debounce } from "lodash-es";

export default {
  name: "PhoneBoook",
  components: {
    ContactCreateEditModal,
  },
  data() {
    return {
      fields: [
        {
          key: "first_name",
          label: "First Name",
          sortable: true,
          _searchable: true,
        },
        {
          key: "last_name",
          label: "Last Name",
          sortable: true,
          _searchable: true,
        },
        {
          key: "phone_number",
          label: "Phone Number",
          sortable: true,
          _searchable: true,
        },
        {
          key: "created_at",
          label: "Created Date",
          sortable: true,
          formatter: (value) => dayjs(value).format("DD MMMM YYYY, HH:mm"),
        },
        { key: "delete", label: "" },
        { key: "edit", label: "" },
        { key: "setFavorite", label: "" },
      ],
      favoriteFields: [
        {
          key: "first_name",
          label: "First Name",
          _searchable: true,
          sortable: true,
        },
        {
          key: "last_name",
          label: "Last Name",
          _searchable: true,
          sortable: true,
        },
        {
          key: "phone_number",
          label: "Phone Number",
          sortable: true,
          _searchable: true,
        },
        { key: "created_at", label: "Created Date" },
        {
          key: "unsetFavorite",
          label: "",
          sortable: true,
          formatter: (value) => dayjs(value).format("DD MMMM YYYY, HH:mm"),
        },
      ],
      tableFilters: {},
      isShowContentCreateEditModal: false,
      contactCreateEditModalTitle: "create",
      selectedItem: null,
      itemType: "contacts",
      items: [],
      perPage: 3,
      currentPage: 1,
      isUpdateProcessDone: false,
      filteredList: [],
    };
  },

  watch: {
    tableFilters: {
      handler(value) {
        this.debounceHandleSearchByFilter(value);
      },
      deep: true,
    },

    contacts: {
      handler(val) {
        this.filteredList = val;
      },
    },
    isUpdateProcessDone: {
      async handler(val) {
        if (val) {
          await this.getAllContacts();
          this.filteredList = await this.contacts;
          setTimeout(() => {
            this.filteredList = this.favoriteContacts;
          }, 10);
          setTimeout(() => {
            this.filteredList = this.contacts;
          }, 10);
        }
      },
    },
  },

  created() {
    this.getAllContacts();
    if (this.itemType == "contacts") {
      this.filteredList = this.contacts;
    } else {
      this.filteredList = this.favoriteContacts;
    }
  },

  mounted() {
    document.getElementById("contact-list").classList.add("selected-list");
  },

  computed: {
    ...mapState("phonebook", ["contacts", "favoriteContacts"]),
  },

  methods: {
    ...mapActions("phonebook", [
      "deleteContact",
      "getAllContacts",
      "favContact",
      "unFavContact",
    ]),

    handleDeleteContact(item) {
      this.deleteContact(item);
      this.$bvToast.toast("Contact deleted from list successfully", {
        title: "Delete a Contact ",
        variant: "danger",
        solid: true,
      });
      this.itemType = "contacts";
    },

    openContactCreateEditModal({ title, item }) {
      this.$refs.contactCreateEditModal.show();
      this.selectedItem = item;
      this.contactCreateEditModalTitle = title;
    },

    handleChangeItems(itemType) {
      if (itemType == "contacts") {
        this.filteredList = this.contacts;
        this.itemType = "contacts";

        document
          .getElementById("favorite-list")
          .classList.remove("selected-list");
        document.getElementById("contact-list").classList.add("selected-list");
      } else {
        this.filteredList = this.favoriteContacts;
        this.itemType = "favoriteContacts";

        document
          .getElementById("contact-list")
          .classList.remove("selected-list");
        document.getElementById("favorite-list").classList.add("selected-list");
      }
    },

    handleFavContact(item) {
      this.favContact(item);
      this.$bvToast.toast("Contact added to favorite list successfully", {
        title: "Fav a Contact ",
        variant: "success",
        solid: true,
      });
    },

    handleUnFavContact(item) {
      this.unFavContact(item);
      this.$bvToast.toast("Contact deleted from favorite list successfully", {
        title: "UnFav a Contact ",
        variant: "success",
        solid: true,
      });
      this.itemType = "favoriteContacts";
      this.filteredList = this.favoriteContacts;
    },

    debounceHandleSearchByFilter: debounce(function (value) {
      this.items =
        this.itemType == "contacts" ? this.contacts : this.favoriteContacts;
      this.filteredList = this.items;
      if (value.first_name) {
        this.filteredList = this.items.filter(
          (item) =>
            item.first_name
              .toLocaleLowerCase("tr")
              .indexOf(value.first_name.toLocaleLowerCase("tr")) !== -1
        );
      }
      if (value.last_name) {
        this.filteredList = this.items.filter(
          (item) =>
            item.last_name
              .toLocaleLowerCase("tr")
              .indexOf(value.last_name.toLocaleLowerCase("tr")) !== -1
        );
      }
      if (value.phone_number) {
        this.filteredList = this.items.filter(
          (item) =>
            item.phone_number.toString().indexOf(value.phone_number) !== -1
        );
      }
    }, 2),
  },
};
</script>

<style scoped>
.list-title {
  opacity: 0.5;
  cursor: pointer;
  padding: 5px;
}
.selected-list {
  color: rgb(4, 58, 16);
  font-size: 20px;
  opacity: 1;
}
</style>
