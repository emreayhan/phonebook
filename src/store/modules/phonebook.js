const namespaced = true;

const state = {
  contacts: [
    {
      id: "1",

      first_name: "Sohrab",

      last_name: "Sheikhani",

      phone_number: "+903333332220",

      created_at: "2021-07-08 17:00:00",
    },
    {
      id: "2",

      first_name: "Emre",

      last_name: "Ayhan",

      phone_number: "+903333332221",

      created_at: "2021-07-08 18:00:00",
    },
    {
      id: "3",

      first_name: "John",

      last_name: "John",

      phone_number: "+903333332222",

      created_at: "2021-07-08 18:00:00",
    },
    {
      id: "4",

      first_name: "Jesse",

      last_name: "Jesse",

      phone_number: "+903333332223",

      created_at: "2021-07-08 18:00:00",
    },
  ],

  favoriteContacts: [
    {
      id: "2",

      first_name: "Emre",

      last_name: "Ayhan",

      phone_number: "+903333332221",

      created_at: "2021-07-08 18:00:00",
    },
  ],
};

const getters = {};

const actions = {
  addNewContact({ commit, state }, payload) {
    const phoneNumbers = state.contacts.map((item) => item.phone_number);
    if (phoneNumbers.includes(payload.phone_number)) {
      return false;
    } else {
      commit("setAddNewContact", payload);
      return true;
    }
  },

  getAllContacts(state) {
    return state.contacts;
  },

  getFavoriteContacts(state) {
    return state.favoriteContacts;
  },

  updateContact({ commit }, payload) {
    commit("setUpdateContact", payload);
  },

  deleteContact({ commit }, payload) {
    commit("setDeleteContact", payload);
  },

  favContact({ commit }, payload) {
    commit("setFavContact", payload);
  },

  unFavContact({ commit }, payload) {
    commit("setUnFavContact", payload);
  },
};

const mutations = {
  setAddNewContact(state, newContact) {
    state.contacts.unshift(newContact);
  },

  setUpdateContact(state, selectedContact) {
    const objIndex = state.contacts.findIndex(
      (obj) => obj.id == selectedContact.id
    );

    const objIndexForFavorite = state.favoriteContacts.findIndex(
      (obj) => obj.id == selectedContact.id
    );

    state.contacts[objIndex] = selectedContact;
    state.favoriteContacts[objIndexForFavorite] = selectedContact;
  },

  setDeleteContact(state, selectedContact) {
    state.contacts = state.contacts.filter(
      (contact) => contact.id !== selectedContact.id
    );
    state.favoriteContacts = state.favoriteContacts.filter(
      (contact) => contact.id !== selectedContact.id
    );
  },

  setFavContact(state, selectedContact) {
    state.favoriteContacts.push(selectedContact);
  },

  setUnFavContact(state, selectedContact) {
    state.favoriteContacts = state.favoriteContacts.filter(
      (contact) => contact.id !== selectedContact.id
    );
  },
};

export default {
  namespaced,
  getters,
  state,
  actions,
  mutations,
};
