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
		
		// Randomly change animation speeds for all elements
		const circles = doodleAnimation.querySelectorAll('.doodle-circle');
		const lines = doodleAnimation.querySelectorAll('.doodle-line');
		const dots = doodleAnimation.querySelectorAll('.doodle-dot');
		const triangles = doodleAnimation.querySelectorAll('.doodle-triangle');
		const squares = doodleAnimation.querySelectorAll('.doodle-square');
		const waves = doodleAnimation.querySelectorAll('.doodle-wave');
		const sparkles = doodleAnimation.querySelectorAll('.doodle-sparkle');
		
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
		
		triangles.forEach(triangle => {
			const randomDuration = (Math.random() * 3 + 3) + 's';
			triangle.style.animationDuration = randomDuration;
		});
		
		squares.forEach(square => {
			const randomDuration = (Math.random() * 2.5 + 2.5) + 's';
			square.style.animationDuration = randomDuration;
		});
		
		waves.forEach(wave => {
			const randomDuration = (Math.random() * 1.5 + 1.5) + 's';
			wave.style.animationDuration = randomDuration;
		});
		
		sparkles.forEach(sparkle => {
			const randomDuration = (Math.random() * 2 + 2) + 's';
			sparkle.style.animationDuration = randomDuration;
		});
		
		// Randomize again in 8-12 seconds
		setTimeout(randomizeAnimation, Math.random() * 4000 + 8000);
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
	
	// Add click interaction with enhanced effects
	doodleAnimation.addEventListener('click', function(e) {
		// Create multiple ripple effects
		for (let i = 0; i < 3; i++) {
			setTimeout(() => {
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
				doodleAnimation.appendChild(ripple);
				
				setTimeout(() => {
					if (ripple.parentNode) {
						ripple.parentNode.removeChild(ripple);
					}
				}, 1000);
			}, i * 200);
		}
		
		// Create floating particles
		createFloatingParticles(e.offsetX, e.offsetY);
		
		// Temporarily speed up all animations
		const allElements = doodleAnimation.querySelectorAll('*');
		allElements.forEach(el => {
			el.style.animationDuration = '0.5s';
		});
		
		setTimeout(() => {
			allElements.forEach(el => {
				el.style.animationDuration = '';
			});
		}, 2000);
	});
	
	// Create floating particles effect
	function createFloatingParticles(x, y) {
		const particles = ['✨', '⭐', '💫', '✨', '⭐'];
		
		particles.forEach((particle, index) => {
			setTimeout(() => {
				const particleEl = document.createElement('div');
				particleEl.textContent = particle;
				particleEl.style.cssText = `
					position: absolute;
					left: ${x}px;
					top: ${y}px;
					font-size: 20px;
					pointer-events: none;
					animation: particleFloat 2s ease-out forwards;
					z-index: 1000;
				`;
				
				// Add particle animation
				const style = document.createElement('style');
				style.textContent = `
					@keyframes particleFloat {
						0% { 
							transform: translate(0, 0) scale(1) rotate(0deg); 
							opacity: 1; 
						}
						100% { 
							transform: translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) scale(0.3) rotate(360deg); 
							opacity: 0; 
						}
					}
				`;
				document.head.appendChild(style);
				
				doodleAnimation.appendChild(particleEl);
				
				setTimeout(() => {
					if (particleEl.parentNode) {
						particleEl.parentNode.removeChild(particleEl);
					}
				}, 2000);
			}, index * 100);
		});
	}
	
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

