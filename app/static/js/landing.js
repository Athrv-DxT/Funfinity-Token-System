// Toggle auth box expand and tabs
(function(){
	function byId(id){ return document.getElementById(id); }
	const showLoginBtn = byId('showLogin');
	const showRegisterBtn = byId('showRegister');
	const authForms = byId('authForms');
	const authActions = byId('authActions');
	const closeBtn = byId('closeForms');
	if(!showLoginBtn || !showRegisterBtn || !authForms || !authActions){ return; }

	function openForms(defaultTab){
		authActions.style.display = 'none';
		authForms.classList.add('open');
		setActiveTab(defaultTab || 'login');
	}
	function closeForms(){
		authForms.classList.remove('open');
		authActions.style.display = 'flex';
	}
	function setActiveTab(tab){
		var loginTabBtn = document.querySelector('.auth-tabs .tab[data-tab="login"]');
		var registerTabBtn = document.querySelector('.auth-tabs .tab[data-tab="register"]');
		var loginPanel = byId('panel-login');
		var registerPanel = byId('panel-register');
		if(!loginTabBtn || !registerTabBtn || !loginPanel || !registerPanel) return;
		if(tab === 'login'){
			loginTabBtn.classList.add('active');
			registerTabBtn.classList.remove('active');
			loginPanel.classList.add('show');
			registerPanel.classList.remove('show');
		}else{
			registerTabBtn.classList.add('active');
			loginTabBtn.classList.remove('active');
			registerPanel.classList.add('show');
			loginPanel.classList.remove('show');
		}
	}

	showLoginBtn.addEventListener('click', function(){ openForms('login'); });
	showRegisterBtn.addEventListener('click', function(){ openForms('register'); });
	if(closeBtn){ closeBtn.addEventListener('click', function(){ closeForms(); }); }

	var tabButtons = document.querySelectorAll('.auth-tabs .tab');
	tabButtons.forEach(function(btn){
		btn.addEventListener('click', function(){ setActiveTab(btn.getAttribute('data-tab')); });
	});
})();

// Dynamic Doodle Animation
(function(){
	const doodleAnimation = document.getElementById('doodleAnimation');
	if (!doodleAnimation) return;
	
	let isAnimating = true;
	let animationSpeed = 1;
	
	// Randomize animation speeds periodically
	function randomizeAnimation() {
		if (!isAnimating) return;
		
		// Randomly change animation speeds
		const circles = doodleAnimation.querySelectorAll('.doodle-circle');
		const lines = doodleAnimation.querySelectorAll('.doodle-line');
		const dots = doodleAnimation.querySelectorAll('.doodle-dot');
		
		circles.forEach(circle => {
			const randomDuration = (Math.random() * 4 + 4) + 's';
			circle.style.animationDuration = randomDuration;
		});
		
		lines.forEach(line => {
			const randomDuration = (Math.random() * 2 + 2) + 's';
			line.style.animationDuration = randomDuration;
		});
		
		dots.forEach(dot => {
			const randomDuration = (Math.random() * 1.5 + 1.5) + 's';
			dot.style.animationDuration = randomDuration;
		});
		
		// Randomize again in 10-15 seconds
		setTimeout(randomizeAnimation, Math.random() * 5000 + 10000);
	}
	
	// Add hover effects
	doodleAnimation.addEventListener('mouseenter', function() {
		animationSpeed = 0.5;
		doodleAnimation.style.animationDuration = '4s';
	});
	
	doodleAnimation.addEventListener('mouseleave', function() {
		animationSpeed = 1;
		doodleAnimation.style.animationDuration = '8s';
	});
	
	// Add click interaction
	doodleAnimation.addEventListener('click', function() {
		// Create a ripple effect
		const ripple = document.createElement('div');
		ripple.style.cssText = `
			position: absolute;
			top: 50%;
			left: 50%;
			width: 0;
			height: 0;
			border: 2px solid rgba(255,255,255,0.6);
			border-radius: 50%;
			transform: translate(-50%, -50%);
			animation: ripple 1s ease-out;
			pointer-events: none;
		`;
		
		// Add ripple animation
		const style = document.createElement('style');
		style.textContent = `
			@keyframes ripple {
				0% { width: 0; height: 0; opacity: 1; }
				100% { width: 200px; height: 200px; opacity: 0; }
			}
		`;
		document.head.appendChild(style);
		
		doodleAnimation.appendChild(ripple);
		
		setTimeout(() => {
			if (ripple.parentNode) {
				ripple.parentNode.removeChild(ripple);
			}
		}, 1000);
	});
	
	// Start randomizing after initial load
	setTimeout(randomizeAnimation, 2000);
	
	// Pause animation when page is not visible (performance optimization)
	document.addEventListener('visibilitychange', function() {
		if (document.hidden) {
			isAnimating = false;
			doodleAnimation.style.animationPlayState = 'paused';
		} else {
			isAnimating = true;
			doodleAnimation.style.animationPlayState = 'running';
			randomizeAnimation();
		}
	});
})();

