<template>
<div class="mb-1">

  <v-navigation-drawer
          v-model="drawer"
          clipped
          app
          color="#E9EBEF"
          :style="`margin-top: ${$vuetify.application.top + $vuetify.application.bar}px`"
          :width="navWidth"
          temporary>
    <v-list>
      <div v-for="(item) in items.filter(obj => obj.authorized)" v-bind:key="item.title">
      <v-list-item v-if="!item.items"
            :key="item.title+`1`"
            class="menuRow"
            :id="stripWhitespace(item.title + `MenuBtn`)">
          <router-link :to="{ name: item.link }"  :target="item.newTab ? '_blank' : '_self'" class="router">
            <v-list-item-content>
              <v-list-item-title v-if="item.link === $route.name" class="menuItem"><strong>{{item.title}}</strong></v-list-item-title>
              <v-list-item-title v-else class="menuItem">{{item.title}}</v-list-item-title>
            </v-list-item-content>
          </router-link>
      </v-list-item>
      <v-list-group
              v-else
              :key="item.title"
              no-action
              active-class="active"
              class="groupMenu"
              :id="stripWhitespace(item.title) + `MenuBtn`"
              append-icon=""
              @click="setActive(item)"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" class="menuItem"></v-list-item-title>
          </v-list-item-content>
          <v-icon color="#003366" v-if="!item.active">$plus</v-icon>
          <v-icon color="#003366" v-else>$minus</v-icon>
        </template>

        <v-list-item
                v-for="subItem in item.items.filter(obj => obj.authorized)"
                :key="subItem.title"
                class="subMenuRow pl-9"
                :id="stripWhitespace(subItem.title) + `MenuBtn`"
        >
          <router-link :to="{ name: subItem.link }" :target="subItem.newTab ? '_blank' : '_self'" class="router">
            <v-list-item-content>
              <v-list-item-title v-if="subItem.link === $route.name" class="menuItem"><strong>{{ subItem.title }}</strong></v-list-item-title>
              <v-list-item-title v-else v-text="subItem.title" class="menuItem"></v-list-item-title>
            </v-list-item-content>
          </router-link>
        </v-list-item>
      </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>
  <v-app-bar v-if="hasAnyItems" app absolute elevation="0" color="#38598A" :dark="true" id="navBar" class="pl-4 pr-8" :class="{'pl-16': $vuetify.breakpoint.mdAndUp}">
    <v-app-bar-nav-icon id="menuBtn" @click="drawer=true">
      <v-icon v-if="!drawer">$menu</v-icon>
      <v-icon v-else>$close</v-icon>
      <p class="ma-0 pl-4 pr-2 hidden-sm-and-down">Menu</p>
    </v-app-bar-nav-icon>
    <v-toolbar-title id="navTitle" class="nav-title" :class="{'ml-4': $vuetify.breakpoint.mdAndUp, 'pl-1': $vuetify.breakpoint.smAndDown}">{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</div>
</template>

<script>
import {PAGE_TITLES} from '@/utils/constants';
import { mapState } from 'vuex';
import {PERMISSION} from '@/utils/constants/Permission';
export default {
  name: 'navBar',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      drawer: null,
      items: [],
      hasAnyItems: false
    };
  },
  computed: {
    ...mapState('auth', ['isAuthenticated']),
    ...mapState('auth', ['userInfo']),
    navWidth () {
      switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        return '50%';
      case 'sm':
        return '50%';
      default:
        return '15%';
      }
    }
  },
  watch:{
    userInfo: {
      handler() {
        this.refreshUserPermissions();
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    refreshUserPermissions(){
      this.items = [
        {
          title: PAGE_TITLES.DASHBOARD,
          link: 'home',
          authorized: this.hasRequiredPermission(PERMISSION.SECURE_EXCHANGE),
        },
        {
          title: PAGE_TITLES.EXCHANGE,
          link: 'inbox',
          authorized: this.hasRequiredPermission(PERMISSION.SECURE_EXCHANGE),
        },
        {
          title: PAGE_TITLES.ADMINISTRATION,
          authorized: this.hasRequiredPermission(PERMISSION.EDX_USER_SCHOOL_ADMIN),
          items: [
            {
              title: 'User Management',
              link: 'exchangeAccess',
              authorized: this.hasRequiredPermission(PERMISSION.EDX_USER_SCHOOL_ADMIN)
            }
          ],
        }
      ];
      this.hasAnyItems = this.items.filter(obj => obj.authorized).length > 0;
    },
    hasRequiredPermission(permission){
      return this.userInfo?.activeInstitutePermissions?.filter(perm => perm === permission).length > 0;
    },
    setActive(item) {
      let index = this.items.findIndex(obj => obj.title === item.title);
      if(item.active) {
        this.items[index].active = false;
      } else {
        this.items.filter(obj => obj.items && obj.active).forEach(obj => obj.active = !obj.active);
        this.items[index].active = true;
      }
    },
    stripWhitespace(title) {
      return title.replace(/\s+/g, '');
    }
  }
};
</script>
<style scoped>
  #navBar {
    z-index: 7;
  }
  .router {
    width: 100%;
  }
  .menuItem {
    color: #003366;
  }
  .menuRow, .groupMenu {
    border-bottom: 2px solid #d2d2d2;
  }
  .router:hover .v-list-item__content, /deep/.v-list-group__header:hover .v-list-item__content, .router-link-exact-active {
    text-decoration: underline #003366;
  }
  .subMenuRow {
    border-top: 2px solid #d2d2d2;
    border-left: 4px solid #FCBA19;
    background-color: white;
  }
  .menuRow /deep/ i {
    color: #003366;
  }
  /deep/ .active {
    border-left: 4px solid #FCBA19;
    background-color: white;
  }
  header /deep/ .v-toolbar__content {
    padding-left: 0 !important;
  }
  /deep/ .v-list-group__header:before {
    background-color: #E9EBEF;
  }

  .nav-title {
    font-size: 1.4rem;
  }

  @media screen and (max-width: 801px){
    .nav-title {
      font-size: 1.1rem;
    }
  }
</style>
