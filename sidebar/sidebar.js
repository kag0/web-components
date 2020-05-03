const sidebarComponentTemplate = document.createElement("template");
sidebarComponentTemplate.innerHTML = 
`<style>
	.sidebar-container {
		display: flex;
		height: 100%;
		width: 100%;
	}
	.sidebar {
		transition: 0.5s;
		min-width: 250px;
		overflow: auto;
		flex-shrink: 0;
	}
	.main-content {
		width: 100%;
		overflow: auto;
	}
</style>

<div class="sidebar-container">
	<div id="left"><slot name="left"></slot></div>
	<div id="right"><slot name="right"></slot></div>
</div>`


class SidebarComponent extends HTMLElement {
	static get observedAttributes() {
		return ['collapsed', 'side', 'width'];
	}

	constructor() {
		super();
		var template = sidebarComponentTemplate.content;
		this
			.attachShadow({mode: 'open'})
			.appendChild(template.cloneNode(true));
		this.refresh();
	}

	refresh() {
		this.side(this.getAttribute("side"));
		this.width = this.getAttribute("width");
		this.collapsed = this.getAttribute("collapsed");
	}

	truthy(value) {
		return value === true || value === "" || value === "true";
	}

	set collapsed(value) {
		if(this.truthy(value)) {
			this.sidebar.style.minWidth = 0;
			this.sidebar.style.width = 0;
			this.collapsed_value = true;
		} else {
			this.sidebar.style.minWidth = this.width;
			this.collapsed_value = false;
			this.sidebar.style.width = '';
		}
	}

	toggleCollapsed() {
		this.collapsed = !this.collapsed_value;
	}

	side(value) {
		switch(value) {
			case "right": 
				this.sidebar = this.shadowRoot.getElementById("right");
				this.mainContent = this.shadowRoot.getElementById("left");
				break;
			default:
				this.sidebar = this.shadowRoot.getElementById("left");
				this.mainContent = this.shadowRoot.getElementById("right");
		}

		this.sidebar.className = "sidebar";
		this.mainContent.className = "main-content";
	}

	set width(value) {
		if(value !== "" && value != null) {
			this.sidebar.style.minWidth = value;
		} else {
			this.sidebar.style.minWidth = "250px";
		}
	}

	get width() {
		if(this.hasAttribute("width")) {
			return this.getAttribute("width");
		} else {
			return "250px";
		}
	}
}

customElements.define('sidebar-component', SidebarComponent);