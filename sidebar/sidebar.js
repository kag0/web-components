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

customElements.define('sidebar-component',
	class extends HTMLElement {
		static get observedAttributes() {
			return ['collapsed', 'side', 'width'];
		}

		constructor() {
			super();
			var template = sidebarComponentTemplate.content;
			const shadowRoot = this
				.attachShadow({mode: 'open'})
				.appendChild(template.cloneNode(true));
			this.refresh();
		}
	
		refresh() {
			this.side(this.getAttribute("side"));
			this.width = this.getAttribute("width");
			this.collapsed = this.getAttribute("collapsed");
		}

		set collapsed(value) {
			if(value === true || value === "" || value === "true") {
				this.sidebar.style.minWidth = 0;
				this.sidebar.style.width = 0;
			} else {
				this.sidebar.style.minWidth = this.getAttribute("width");
			}
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
	}
);