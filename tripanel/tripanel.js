import "../sidebar/sidebar.js"

const tripanelComponentTemplate = document.createElement("template");
tripanelComponentTemplate.innerHTML = 
`<style>
.topbar {
	background-color: #333;
	flex: 0 1 auto;
	display: flex;
}
.tripanel-outer {
	display: flex;
	flex-flow: column;
	height: 100%;
}
.rightbar {}
@media (max-width: 500px) {
	.rightbar {
		width: 100vw;
	}
}
</style>
<div class="tripanel-outer">
<div class="topbar">
	<slot id="menu-button-closed-slot" name="menu-button-closed">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="36px" height="36px"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>	</slot>
	<slot id="menu-button-open-slot" name="menu-button-open" style="display: none;">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="36px" height="36px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 18h13v-2H3v2zm0-5h10v-2H3v2zm0-7v2h13V6H3zm18 9.59L17.42 12 21 8.41 19.59 7l-5 5 5 5L21 15.59z"/></svg>
	</slot>
	<slot name="topbar"></slot>
</div>
<div style="flex: 1 1 auto; min-height: 0;">
<sidebar-component id="leftbar" collapsed>
	<slot name="navigation-drawer" slot="left">
		navigation drawer
	</slot>
	<sidebar-component id="rightbar" side="right" slot=right>
		<slot name="resource-list"  slot="left">
			resource list
		</slot>
		<div slot="right">
			<slot name="close-resource-details-button" id="close-rightbar-button">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="36px" height="36px"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
			</slot>
			<div class="rightbar">
			<slot name="resource-details">
				resource details
			</slot>
			</div>
	</div>
	</sidebar-component>
</sidebar-component>
</div>
</div>
`

customElements.define('tripanel-component', class extends HTMLElement {
	static get observedAttributes() {
		return ['navigationCollapsed', 'detailsCollapsed'];
	}

	constructor() {
		super();

		this.attachShadow({mode: 'open'})
			.appendChild(tripanelComponentTemplate.content.cloneNode(true));

		this.sidebar = this.shadowRoot.getElementById('leftbar');
		this.menuButtonOpen = this.shadowRoot.getElementById('menu-button-open-slot');
		this.menuButtonClosed = this.shadowRoot.getElementById('menu-button-closed-slot');
		this.detailsBar = this.shadowRoot.getElementById('rightbar');

		this.menuButtonOpen.onclick = () => this.closeSidebar();
		this.menuButtonClosed.onclick = () => this.openSidebar();

		this.shadowRoot.getElementById("close-rightbar-button").onclick = () => {
			this.detailsBar.collapsed = true;
			return false;
		};

		window.matchMedia("(max-width: 500px)").addListener(() => this.closeSidebar());
		window.matchMedia("(min-width: 900px)").addListener(() => {
			if(window.innerWidth >= 900) {
				this.openSidebar();
			}
		});

		this.navigationCollapsed = this.getAttribute("navigationCollapsed");
		this.detailsCollapsed = this.getAttribute("detailsCollapsed");
	}

	set navigationCollapsed(value) {
		if(this.sidebar.truthy(value)) {
			this.closeSidebar();
		} else {
			this.openSidebar();
		}
	}

	get navigationCollapsed() {
		return this.sidebar.collapsed_value;
	}

	set detailsCollapsed(value) {
		if(this.sidebar.truthy(value)) {
			this.detailsBar.collapsed = true;
		} else {
			this.detailsBar.collapsed = false;
		}
	}

	get detailsCollapsed() {
		return this.detailsBar.collapsed_value;
	}

	toggleNavigation() {
		if(this.sidebar.collapsed_value) {
			this.openSidebar();
		}
		else {
			this.closeSidebar();
		}
	}

	openSidebar() {
		this.sidebar.collapsed = false;
		this.menuButtonOpen.style.display = "block";
		this.menuButtonClosed.style.display = "none";
	}

	closeSidebar() {
		this.sidebar.collapsed = true;
		this.menuButtonOpen.style.display = "none";
		this.menuButtonClosed.style.display = "block";
	}
});