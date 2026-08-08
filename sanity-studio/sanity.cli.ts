import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'xm9au2qy',
    dataset: 'production'
  },
  deployment: {
    /**
     * Set a custom host name for the deployed studio.
     */
    studioHost: 'aceray-studio',
    appId: 'ogmixgfvs8gpekjszec7wdui',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
