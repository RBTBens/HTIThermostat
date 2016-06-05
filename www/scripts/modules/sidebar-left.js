// Add the object to our module array
var obj = { id: "sidebar-left" };
app.modules[obj.id] = obj;
app.moduleHelper.inherit(obj.id, "sidebar");

// Called when all scripts are ready
obj.load = function() {
	this.beginTemplate();
	
	this.addMenu();
		this.addMenuItem("Homepage", "", "home", true);
		this.addMenuItem("Original theme", "http://enableds.com/products/bolt/dark/index.html", "file-o", false, false);
		
		/*
		this.addSubMenu("Features", "cog");
			this.addSubMenuItem("Typography", "features-typography.html");
			this.addSubMenuItem("Tabs", "features-tabs.html");
			this.addSubMenuItem("Toggles", "features-toggles.html");
			this.addSubMenuItem("Accordions", "features-accordion.html");
			this.addSubMenuItem("Notifications", "features-notifications.html");
			this.addSubMenuItem("Charts & Stats", "features-charts.html");
			this.addSubMenuItem("Buttons & Icons", "features-buttons.html");
			this.addSubMenuItem("Other Features", "features-others.html");
		this.endSubMenu();
		
		this.addSubMenu("Galleries", "camera");
			this.addSubMenuItem("Rounded", "gallery-round.html");
			this.addSubMenuItem("Squared", "gallery-square.html");
			this.addSubMenuItem("Adaptive", "gallery-adaptive.html");
			this.addSubMenuItem("Masonry", "gallery-masonry.html");
			this.addSubMenuItem("Filterable", "gallery-filter.html");
		this.endSubMenu();
		
		this.addSubMenu("Portfolios", "image");
			this.addSubMenuItem("One Item", "portfolio-one.html");
			this.addSubMenuItem("Two Items", "portfolio-two.html");
			this.addSubMenuItem("Filterable", "portfolio-filter.html");
			this.addSubMenuItem("Adaptive", "portfolio-adaptive.html");
			this.addSubMenuItem("Widescreen", "portfolio-widescreen.html");
		this.endSubMenu();
		
		this.addSubMenu("Pages", "file-o");
			this.addSubMenuItem("Activity", "page-activity.html");
			this.addSubMenuItem("Error Page", "page-error.html");
			this.addSubMenuItem("Soon Page", "page-soon.html");
			this.addSubMenuItem("Profile Page", "page-profile.html");
			this.addSubMenuItem("Log In Page", "page-login.html");
			this.addSubMenuItem("Sign Up Page", "page-signup.html");
			this.addSubMenuItem("Userlist Page", "page-userlist.html");
			this.addSubMenuItem("User Reviews", "page-reviews.html");
		this.endSubMenu();
		
		this.addSubMenu("App Pages", "mobile");
			this.addSubMenuItem("Chat", "pageapp-chat.html");
			this.addSubMenuItem("Log In", "pageapp-login.html");
			this.addSubMenuItem("Sign Up", "pageapp-signup.html");
			this.addSubMenuItem("Calendar", "pageapp-calendar.html");
			this.addSubMenuItem("Timeline", "pageapp-timeline.html");
			this.addSubMenuItem("Tasklist", "pageapp-tasklist.html");
			this.addSubMenuItem("Checklist", "pageapp-checklist.html");
			this.addSubMenuItem("Reminders", "pageapp-reminders.html");
			this.addSubMenuItem("Coverpage", "pageapp-coverpage.html");
		this.endSubMenu();
		
		this.addSubMenu("Store", "shopping-cart");
			this.addSubMenuItem("Storefront", "store-chat.html");
			this.addSubMenuItem("Product List", "store-product-list.html");
			this.addSubMenuItem("Product Page", "store-product-page.html");
			this.addSubMenuItem("Checkout Page", "store-checkout.html");
			this.addSubMenuItem("Purchase History", "store-history.html");
		this.endSubMenu();
		
		this.addSubMenu("News", "newspaper-o");
			this.addSubMenuItem("News Page", "news-front.html");
			this.addSubMenuItem("News Article", "news-article.html");
			this.addSubMenuItem("News Article List", "news-article-list.html");
			this.addSubMenuItem("News Article Archive", "news-article-archive.html");
		this.endSubMenu();
		
		this.addSubMenu("Blog", "pencil");
			this.addSubMenuItem("Blog Page", "page-blog.html");
			this.addSubMenuItem("Blog Post", "page-blog-post.html");
		this.endSubMenu();
		
		this.addMenuItem("Videos", "page-videos.html", "youtube-play");
		this.addMenuItem("Sitemap", "page-sitemap.html", "navicon");
		this.addMenuItem("Contact", "contact.html", "envelope-o");
		*/
		
		this.addMenuItem("Close", "#this", "times", false, true);
	this.endMenu();

	return this.endTemplate();
}