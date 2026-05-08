import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: '4hlhry87',
    dataset: 'production',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
    appId: "bxzdh5opzw7yfz3b5x66kqah",
  },
});
