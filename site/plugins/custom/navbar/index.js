panel.plugin("blogsite/navbar-block", {
  blocks: {
    navbar: {
      computed: {
        previewText() {
          const logo = this.content.logo || 'Your Site'
          const linkCount = this.content.links ? this.content.links.length : 0
          return `${logo} (${linkCount} links)`
        }
      },
      template: `
        <div class="navbar-preview">
          <div class="navbar-preview-header">
            <span class="navbar-preview-logo">{{ content.logo || 'Your Site' }}</span>
            <span class="navbar-preview-style">{{ content.style || 'default' }}</span>
          </div>
          <div class="navbar-preview-links" v-if="content.links && content.links.length">
            <span v-for="link in content.links" :key="link.title" class="navbar-preview-link">
              {{ link.title }}
            </span>
          </div>
          <div v-else class="navbar-preview-empty">
            No navigation links yet
          </div>
        </div>
      `
    }
  }
});
