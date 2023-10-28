
<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>{{ appName }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <hanko-auth @onAuthFlowCompleted="authCompleted"  />
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { register, Hanko } from '@teamhanko/hanko-elements';
import { appName, hankoApi } from '@/env';
import { dispatchRegister} from '@/store/main/actions';
import { IUserProfileCreate } from '@/interfaces';


@Component
export default class HankoAuthView extends Vue {

  public appName: string = appName;
  private hankoApi: string = hankoApi;

  public hanko = new Hanko(this.hankoApi);
 
  public async mounted() {
    try {
      await register(this.hankoApi);
    } catch (error) {
      // Handle the error here if needed.
    }
  }

  public async authCompleted() {

    const user = await this.hanko.user.getCurrent();

    if (await this.$validator.validateAll()) {
      const updatedProfile: IUserProfileCreate = {
        uuid: user.id,
        email: user.email,
      };
      updatedProfile.is_active = true;
      await dispatchRegister(this.$store, updatedProfile);
    }

  }
}
</script>
